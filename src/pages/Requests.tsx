import AllFilters from "@/components/AllFilters";
import FetchingLoader from "@/components/FetchingLoader";
import ListTable, { type ColumnConfig } from "@/components/ListTable";
import Pagination from "@/components/Pagination";
import { useFetchRequests } from "@/hooks/useFetchRequests";
import type { RequestType } from "@/types/Requests";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const Requests = () => {
  const [filters, setFilters] = useState({
    requestCategory: "all",
    requestIdentity: "all",
    requestStatus: "all",
    requestWillingToPay: "all",
    requestUrgent: "all",
    requestFemaleOnly: "all",
  });
  const [page, setPage] = useState(1);

  const requestColumns = [
    { label: "User ID", accessor: "user_id" },
    {
      label: "Requester",
      accessor: "users",
      render: (row) => row.users?.full_name ?? "—",
    },
    { label: "Request", accessor: "request_text" },
    { label: "Category", accessor: "category" },
    {
      label: "Verified",
      accessor: "users",
      render: (row) => (row.users?.is_verified ? "True" : "False"),
    },
    { label: "Urgent", accessor: "is_urgent" },
    { label: "Status", accessor: "status" },
  ] satisfies ColumnConfig<RequestType>[];

  const { data, isLoading, isError, isRefetching, refetch } =
    useFetchRequests(filters);
  console.log("🚀 ~ Requests ~ data:", data);

  if (isError)
    return (
      <div className="w-full h-full flex justify-center items-center gap-3">
        <span className="text-sm">Error while fetching requests.</span>
      </div>
    );

  return (
    <div className="flex min-h-full max-xl:flex-col">
      <AllFilters
        filterType={"requests"}
        filters={filters}
        setFilters={setFilters}
      />
      <div className="w-full bg-app-foreground rounded-2xl py-6 pb-10 px-8 border flex flex-col justify-between">
        {isRefetching || isLoading ? (
          <FetchingLoader type="requests" />
        ) : (
          <>
            <ListTable<RequestType>
              data={data}
              columns={requestColumns}
              refetch={refetch}
            />
            <Pagination
              page={page}
              limit={10}
              count={data?.count || 0}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Requests;

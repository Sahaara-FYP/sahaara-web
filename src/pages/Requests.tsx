import AllFilters from "@/components/AllFilters";
import ListTable, { type ColumnConfig } from "@/components/ListTable";
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

  const requestColumns = [
    { label: "ID", accessor: "id" },
    { label: "User ID", accessor: "user_id" },
    { label: "Request", accessor: "request_text" },
    { label: "Category", accessor: "category" },
    { label: "Urgent", accessor: "is_urgent" },
    { label: "Status", accessor: "status" },
  ] satisfies ColumnConfig<RequestType>[];

  const { data, isLoading, isError } = useFetchRequests(filters);
  if (isError)
    return (
      <div className="w-full h-full flex justify-center items-center gap-3">
        <span className="text-sm">Error while fetching requests.</span>
      </div>
    );

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center gap-3">
        <Loader2 className="animate-spin" />
        <span className="text-sm">Fetching latest requests...</span>
      </div>
    );

  return (
    <div className="flex min-h-full max-xl:flex-col">
      <AllFilters
        filterType={"requests"}
        filters={filters}
        setFilters={setFilters}
      />
      <ListTable<RequestType> data={data} columns={requestColumns} />
    </div>
  );
};

export default Requests;

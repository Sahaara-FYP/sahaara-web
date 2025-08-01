import AllFilters from "@/components/AllFilters";
import ListTable from "@/components/ListTable";
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

  const { data, isLoading, isError } = useFetchRequests(filters);
  console.log("🚀 ~ Requests ~ data:", data);
  if (isError)
    return (
      <>
        <p>Error while fetching requests</p>
      </>
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
      <ListTable<RequestType> data={data} />
    </div>
  );
};

export default Requests;

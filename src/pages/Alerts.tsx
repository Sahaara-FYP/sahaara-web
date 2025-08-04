import AllFilters from "@/components/AllFilters";
import { useState } from "react";

const Alerts = () => {
  const [filters, setFilters] = useState({
    alertCategory: "all",
  });
  const [page, setPage] = useState(1);
  return (
    <div className="flex min-h-full max-xl:flex-col">
      <AllFilters
        filterType={"alerts"}
        filters={filters}
        setFilters={setFilters}
      />
      <div className="w-full bg-app-foreground rounded-2xl py-6 pb-10 px-8 border flex flex-col justify-between"></div>
    </div>
  );
};

export default Alerts;

import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { RefreshCcw, FilterX } from "lucide-react";

interface AdminHeaderPropTypes {
  currentPage: string;
  onResetFilters?: () => void; // NEW
}

const AdminHeader = ({ currentPage, onResetFilters }: AdminHeaderPropTypes) => {
  const queryClient = useQueryClient();

  function handleRefreshClick() {
    queryClient.invalidateQueries({ queryKey: [currentPage] });
  }

  return (
    <div className="flex justify-end items-center mb-6 w-full">
      <div className="flex items-center gap-3">
        {/* RESET FILTERS BUTTON */}
        {onResetFilters && currentPage !== "dashboard" && (
          <Button
            onClick={onResetFilters}
            variant="outline"
            title="Reset Filters"
            className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all shadow-sm"
          >
            <FilterX strokeWidth={2.5} size={18} />
          </Button>
        )}

        {/* REFRESH BUTTON */}
        <Button
          onClick={handleRefreshClick}
          title="Refresh Page"
          className="bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50 shadow-md shadow-indigo-500/20 transition-all font-medium"
        >
          <RefreshCcw strokeWidth={2.5} size={18} className="mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;

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
    <div className="flex justify-between items-center mb-4 ml-2">
      <div className="flex justify-between w-full">
        <h1 className="text-3xl font-semibold capitalize">{currentPage}</h1>

        <div className="flex items-center gap-2">
          {/* RESET FILTERS BUTTON */}
          {onResetFilters && currentPage != "dashboard" && (
            <Button
              onClick={onResetFilters}
              variant="outline"
              title="Reset Filters" // ← TOOLTIP
              className="border-app-primary-color text-app-primary-color hover:bg-app-background"
            >
              <FilterX strokeWidth={2.5} />
            </Button>
          )}

          {/* REFRESH BUTTON */}
          <Button
            onClick={handleRefreshClick}
            title="Refresh Page" // ← TOOLTIP
            className="bg-app-primary-color hover:bg-app-primary-hover-color"
          >
            <RefreshCcw strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;

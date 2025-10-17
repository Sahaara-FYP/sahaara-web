import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";
interface AdminHeaderPropTypes {
  currentPage: string;
}

const AdminHeader = ({ currentPage }: AdminHeaderPropTypes) => {
  const queryClient = useQueryClient();

  function handleRefreshClick() {
    queryClient.invalidateQueries({ queryKey: [currentPage] });
  }
  return (
    <div className="flex justify-between items-center mb-4 ml-2">
      <div className="flex justify-between w-full">
        <h1 className="text-3xl font-semibold capitalize">{currentPage}</h1>
        <Button
          onClick={handleRefreshClick}
          className="bg-app-primary-color hover:bg-app-primary-hover-color"
        >
          <RefreshCcw strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;

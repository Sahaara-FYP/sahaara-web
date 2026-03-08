import { Loader2 } from "lucide-react";

const FetchingLoader = ({ type }: { type?: string }) => {
  return (
    <div className="w-full h-full flex justify-center items-center gap-3">
      <Loader2 className="animate-spin" />
      <span className="text-sm">Fetching latest {type || "data"}...</span>
    </div>
  );
};

export default FetchingLoader;

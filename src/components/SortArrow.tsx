/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export const SortArrow = ({
  column,
  sortConfig,
}: {
  column: any;
  sortConfig: any;
}) => {
  if (sortConfig.key !== column || !sortConfig.direction)
    return <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-gray-400" />;

  return sortConfig.direction === "asc" ? (
    <ArrowUp className="w-3.5 h-3.5 ml-1 text-app-primary-color" />
  ) : (
    <ArrowDown className="w-3.5 h-3.5 ml-1 text-app-primary-color" />
  );
};

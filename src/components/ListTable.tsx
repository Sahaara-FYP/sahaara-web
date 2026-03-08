import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaginatedResponse, RequestType } from "@/types/Requests";
import { Button } from "./ui/button";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";

interface ListTableProps<T> {
  data: PaginatedResponse<T> | undefined;
  caption?: string;
  columns: ColumnConfig<T>[];
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<PaginatedResponse<RequestType>, Error>>;
  actionItems: (item: T) => Record<string, () => void>;
}

export interface ColumnConfig<T> {
  label: string;
  accessor: keyof T;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
}

const ListTable = <T,>({
  data,
  caption,
  columns,
  refetch,
  actionItems,
}: ListTableProps<T>) => {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">List of Items</h2>
        <Button
          variant={"outline"}
          onClick={() => {
            refetch();
          }}
          className="bg-app-primary-color dark:bg-app-primary-color text-white border-0 dark:border hover:bg-app-primary-hover-color hover:text-white"
        >
          Refresh
        </Button>
      </div>
      <Table className="mt-2">
        <TableCaption>{caption || ""}</TableCaption>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={String(col.accessor)}
                className={`
                  ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : ""
                  }`}
              >
                {col.label}
              </TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map((item, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell
                  key={String(col.accessor)}
                  className={`
                    ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : ""
                    } capitalize`}
                >
                  {col.render ? col.render(item) : String(item[col.accessor])}
                </TableCell>
              ))}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="ml-3">
                    <Ellipsis width={20} height={20} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(actionItems(item)).map(
                      ([label, handler], idx) => (
                        <DropdownMenuItem key={idx} onClick={handler}>
                          {label}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data?.data.length == 0 && (
        <p className="text-app-primary-text text-center font-semibold w-full text-sm">
          No data found
        </p>
      )}
    </div>
  );
};

export default ListTable;

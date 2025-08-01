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

interface ListTableProps<T> {
  data: PaginatedResponse<T> | undefined;
  caption?: string;
  columns: ColumnConfig<T>[];
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<PaginatedResponse<RequestType>, Error>>;
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListTable;

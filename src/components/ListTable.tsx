import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaginatedResponse } from "@/types/Requests";

interface ListTableProps<T> {
  data: PaginatedResponse<T> | undefined;
  caption?: string;
  columns: ColumnConfig<T>[];
}

export interface ColumnConfig<T> {
  label: string;
  accessor: keyof T;
  align?: "left" | "right" | "center";
}

const ListTable = <T,>({ data, caption, columns }: ListTableProps<T>) => {
  return (
    <div className="w-full bg-app-foreground rounded-2xl py-6 pb-10 px-8 border">
      <h2 className="text-xl font-semibold">List of Items</h2>
      <Table>
        <TableCaption>{caption || "Latest Details."}</TableCaption>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={String(col.accessor)}
                className={
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : ""
                }
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
                  {String(item[col.accessor])}
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

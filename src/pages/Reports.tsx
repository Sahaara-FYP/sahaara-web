import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFetchReports } from "@/hooks/useFetchReports";
import { ReportDetailsDialog } from "@/components/ReportDetailsDialog";
import {
  ReportEntityTypeItems,
  ReportReasonItems,
  ReportStatusItems,
  type ReportType,
} from "@/types/Reports";
import LoaderOverlay from "@/components/Loader";
import Pagination from "@/components/Pagination";
import { MoreVertical } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { timeAgo } from "@/utils/timeAgo";

type AdminContext = { setResetFilters: (fn: () => void) => void };

type FilterState = {
  status?: string;
  entityType?: string;
  reason?: string;
  limit?: number;
  offset?: number;
};

/* ---- Status Chip ---- */
const ReportStatusChip = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    pending: "bg-yellow-400/20 text-yellow-700 border border-yellow-400",
    reviewed: "bg-blue-500/20 text-blue-700 border border-blue-500",
    resolved: "bg-green-500/20 text-green-700 border border-green-500",
    dismissed: "bg-gray-500/20 text-gray-700 border border-gray-500",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] || map["pending"]}`}
    >
      {status}
    </span>
  );
};

/* ---- MAIN COMPONENT ---- */
const Reports = () => {
  const [filter, setFilter] = useState<FilterState>({ limit: 10, offset: 0 });
  const [selectedRow, setSelectedRow] = useState<ReportType | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const { setResetFilters } = useOutletContext<AdminContext>();

  useEffect(() => {
    setResetFilters(() => () => setFilter({ limit: 10, offset: 0 }));
  }, []);

  const { data, error, isLoading } = useFetchReports(filter);

  if (isLoading || !data) return <LoaderOverlay show={true} message="Please wait..." />;
  if (error) return <p>Error fetching reports. Please try again.</p>;

  const handlePageChange = (newPage: number) => {
    setFilter((prev) => ({
      ...prev,
      offset: (newPage - 1) * (prev.limit || 10),
    }));
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-app-foreground p-4 shadow rounded-lg">
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            value={filter.status || ""}
            onValueChange={(val) =>
              setFilter((prev) => ({
                ...prev,
                status: val === "all" ? undefined : val,
                offset: 0,
              }))
            }
          >
            <SelectTrigger className="w-40 capitalize">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ReportStatusItems).map((opt) => (
                <SelectItem key={opt} value={opt} className="capitalize">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filter.entityType || ""}
            onValueChange={(val) =>
              setFilter((prev) => ({
                ...prev,
                entityType: val === "all" ? undefined : val,
                offset: 0,
              }))
            }
          >
            <SelectTrigger className="w-40 capitalize">
              <SelectValue placeholder="Entity Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ReportEntityTypeItems).map((opt) => (
                <SelectItem key={opt} value={opt} className="capitalize">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filter.reason || ""}
            onValueChange={(val) =>
              setFilter((prev) => ({
                ...prev,
                reason: val === "all" ? undefined : val,
                offset: 0,
              }))
            }
          >
            <SelectTrigger className="w-48 capitalize">
              <SelectValue placeholder="Reason" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ReportReasonItems).map((opt) => (
                <SelectItem key={opt} value={opt} className="capitalize">
                  {opt.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Table className="bg-app-foreground shadow-md overflow-hidden rounded-lg">
        <TableCaption className="text-app-secondary-color text-sm py-2">
          Community reports awaiting review
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-app-foreground border-b">
            {["Reporter", "Reported User", "Entity", "Reason", "Submitted", "Status", "Actions"].map((col) => (
              <TableHead
                key={col}
                className={`px-4 py-3 font-semibold text-app-primary-text ${
                  col === "Reporter" || col === "Reported User" ? "text-left" : "text-center"
                }`}
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.data.map((row) => (
            <TableRow
              key={row.id}
              className="hover:bg-app-background/70 transition-colors"
            >
              <TableCell className="px-4 py-3 text-left">
                <div className="flex flex-col">
                  <span className="font-medium">{row.reporter.fullName}</span>
                  <span className="text-xs text-app-secondary-text">
                    {row.reporter.email}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 text-left">
                {row.reportedUser ? (
                  <div className="flex flex-col">
                    <span className="font-medium">{row.reportedUser.fullName}</span>
                    <span className="text-xs text-app-secondary-text">
                      {row.reportedUser.email}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-app-secondary-text">—</span>
                )}
              </TableCell>
              <TableCell className="px-4 py-3 text-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--app-tertiary-color)]/20 text-[var(--app-tertiary-color)] border border-[var(--app-tertiary-color)] capitalize">
                  {row.entityType}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3 text-center text-sm capitalize">
                {row.reason.replace(/_/g, " ")}
              </TableCell>
              <TableCell className="px-4 py-3 text-center text-sm">
                {timeAgo(row.createdAt)}
              </TableCell>
              <TableCell className="px-4 py-3 text-center">
                <ReportStatusChip status={row.status} />
              </TableCell>
              <TableCell className="px-4 py-3 text-center text-app-secondary-text">
                <DropdownMenu
                  open={openDropdownId === row.id}
                  onOpenChange={(isOpen) =>
                    setOpenDropdownId(isOpen ? row.id : null)
                  }
                >
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-sm hover:bg-app-background transition">
                      <MoreVertical className="w-5 h-5 text-app-primary-text" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedRow(row);
                        setOpenDropdownId(null);
                      }}
                    >
                      View & Action
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {data.data.length === 0 && (
            <TableCell colSpan={6} className="py-4 text-center w-full">
              No Reports Found
            </TableCell>
          )}
        </TableBody>
      </Table>

      <Pagination pagination={data.pagination} onPageChange={handlePageChange} />

      {selectedRow && (
        <ReportDetailsDialog
          open={!!selectedRow}
          onOpenChange={(open) => {
            if (!open) setSelectedRow(null);
          }}
          report={selectedRow}
        />
      )}
    </div>
  );
};

export default Reports;

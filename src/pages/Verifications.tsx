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
import { useFetchVerifications } from "@/hooks/useFetchVerifications";
import { VerificationDetailsDialog } from "@/components/VerificationDetailsDialog";
import {
  VerificationStatusItems,
  type VerificationType,
} from "@/types/Verifications";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoaderOverlay from "@/components/Loader";
import Pagination from "@/components/Pagination";
import { useOutletContext, useLocation } from "react-router-dom";
import { timeAgo } from "@/utils/timeAgo";
import { ShieldCheck, ShieldX, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminContext = { setResetFilters: (fn: () => void) => void };

/* ---- Filter state ---- */
type FilterState = {
  status?: string;
  userId?: string;
  limit?: number;
  offset?: number;
};

/* ---- Status Chip ---- */
const VerifStatusChip = ({ status }: { status: string }) => {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    pending: {
      cls: "bg-yellow-400/20 text-yellow-700 border border-yellow-400",
      icon: <Clock size={14} />,
    },
    verified: {
      cls: "bg-green-500/20 text-green-700 border border-green-500",
      icon: <ShieldCheck size={14} />,
    },
    rejected: {
      cls: "bg-red-500/20 text-red-700 border border-red-500",
      icon: <ShieldX size={14} />,
    },
  };
  const config = map[status] || map["pending"];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${config.cls}`}
    >
      {config.icon}
      {status}
    </span>
  );
};

/* ---- MAIN COMPONENT ---- */
const Verifications = () => {
  const { state } = useLocation();
  const [filter, setFilter] = useState<FilterState>({ limit: 10, offset: 0, userId: state?.targetUserId || undefined });
  const [selectedRow, setSelectedRow] = useState<VerificationType | null>(null);
  const { setResetFilters } = useOutletContext<AdminContext>();

  useEffect(() => {
    setResetFilters(() => () => setFilter({ limit: 10, offset: 0 }));
  }, []);

  const { data, error, isLoading } = useFetchVerifications(filter);

  // Automatically open the verification request if navigated with targetUserId
  useEffect(() => {
    if (data?.data && data.data.length > 0 && state?.targetUserId && !selectedRow) {
      setSelectedRow(data.data[0]);
    }
  }, [data?.data, state?.targetUserId]);

  if (isLoading || !data) return <LoaderOverlay show={true} message="Please wait..." />;
  if (error) return <p>Error fetching verifications. Please try again.</p>;

  const handlePageChange = (newPage: number) => {
    setFilter((prev) => ({
      ...prev,
      offset: (newPage - 1) * (prev.limit || 10),
    }));
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="bg-app-foreground p-4 shadow rounded-lg">
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-sm font-semibold text-app-secondary-text">
            Filter by Status:
          </p>
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
            <SelectTrigger className="w-44 capitalize">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(VerificationStatusItems).map((opt) => (
                <SelectItem key={opt} value={opt} className="capitalize">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {filter.userId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter(prev => ({ ...prev, userId: undefined, offset: 0 }))}
              className="text-app-secondary-text h-9 border-gray-300"
            >
              Clear User Filter
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table className="bg-app-foreground shadow-md overflow-hidden rounded-lg">
        <TableCaption className="text-app-secondary-color text-sm py-2">
          KYC Verification submissions
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-app-foreground border-b">
            {[
              "User",
              "Email",
              "CNIC Number",
              "Submitted",
              "Status",
              "Actions",
            ].map((col) => (
              <TableHead
                key={col}
                className={`px-4 py-3 font-semibold text-app-primary-text ${
                  col === "User" ? "text-left" : "text-center"
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
              className="hover:bg-app-background/70 transition-colors cursor-pointer"
              onClick={() => setSelectedRow(row)}
            >
              <TableCell className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  {row.user.profilePictureUrl ? (
                    <img
                      src={row.user.profilePictureUrl}
                      alt={row.user.fullName}
                      className="h-8 w-8 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-app-background flex items-center justify-center text-xs font-bold text-app-secondary-text">
                      {row.user.fullName?.[0] || "?"}
                    </div>
                  )}
                  <span className="font-medium">{row.user.fullName}</span>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 text-center text-sm text-app-secondary-text">
                {row.user.email}
              </TableCell>
              <TableCell className="px-4 py-3 text-center text-sm">
                {row.user.cnicNumber || "—"}
              </TableCell>
              <TableCell className="px-4 py-3 text-center text-sm">
                {timeAgo(row.createdAt)}
              </TableCell>
              <TableCell className="px-4 py-3 text-center">
                <VerifStatusChip status={row.status} />
              </TableCell>
              <TableCell className="px-4 py-3 text-center">
                <button
                  className="text-xs font-semibold text-app-primary-color hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRow(row);
                  }}
                >
                  Review
                </button>
              </TableCell>
            </TableRow>
          ))}
          {data.data.length === 0 && (
            <TableCell colSpan={6} className="py-4 text-center w-full">
              No Verification Records Found
            </TableCell>
          )}
        </TableBody>
      </Table>

      <Pagination pagination={data.pagination} onPageChange={handlePageChange} />

      {selectedRow && (
        <VerificationDetailsDialog
          open={!!selectedRow}
          onOpenChange={(open) => {
            if (!open) setSelectedRow(null);
          }}
          verification={selectedRow}
        />
      )}
    </div>
  );
};

export default Verifications;

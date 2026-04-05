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
import {
  MoreVertical,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { timeAgo } from "@/utils/timeAgo";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
  const map: Record<
    string,
    { cls: string; icon: React.ReactNode; label: string }
  > = {
    pending: {
      cls: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      icon: <Clock size={12} />,
      label: "Awaiting Review",
    },
    reviewed: {
      cls: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      icon: <ShieldAlert size={12} />,
      label: "In Review",
    },
    resolved: {
      cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      icon: <CheckCircle2 size={12} />,
      label: "Resolved",
    },
    dismissed: {
      cls: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      icon: <XCircle size={12} />,
      label: "Dismissed",
    },
  };
  const config = map[status] || map["pending"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${config.cls}`}
    >
      {config.icon}
      {config.label}
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

  if (isLoading || !data)
    return <LoaderOverlay show={true} message="Please wait..." />;
  if (error) return <p>Error fetching reports. Please try again.</p>;

  const handlePageChange = (newPage: number) => {
    setFilter((prev) => ({
      ...prev,
      offset: (newPage - 1) * (prev.limit || 10),
    }));
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      } as any,
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-20"
    >
      {/* Filters */}
      <motion.div
        variants={item}
        className="bg-white/5 p-6 shadow-xl shadow-black/20 border border-white/10 rounded-2xl backdrop-blur-md"
      >
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">
              Status Queue
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
              <SelectTrigger className="w-44 capitalize h-12 bg-[#020617]/40 border-white/10 text-white/90 rounded-xl font-semibold focus:ring-indigo-500/50 hover:bg-[#020617]/60 transition-all">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-[#020617] border border-white/10 text-white/90 rounded-xl shadow-2xl backdrop-blur-xl">
                <SelectItem
                  value="all"
                  className="font-semibold text-white/40 focus:bg-white/5 cursor-pointer"
                >
                  All Statuses
                </SelectItem>
                {Object.values(ReportStatusItems).map((opt) => (
                  <SelectItem
                    key={opt}
                    value={opt}
                    className="capitalize font-semibold focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">
              Entity Origin
            </p>
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
              <SelectTrigger className="w-44 capitalize h-12 bg-[#020617]/40 border-white/10 text-white/90 rounded-xl font-semibold focus:ring-indigo-500/50 hover:bg-[#020617]/60 transition-all">
                <SelectValue placeholder="All Entities" />
              </SelectTrigger>
              <SelectContent className="bg-[#020617] border border-white/10 text-white/90 rounded-xl shadow-2xl backdrop-blur-xl">
                <SelectItem
                  value="all"
                  className="font-semibold text-white/40 focus:bg-white/5 cursor-pointer"
                >
                  All Entities
                </SelectItem>
                {Object.values(ReportEntityTypeItems).map((opt) => (
                  <SelectItem
                    key={opt}
                    value={opt}
                    className="capitalize font-semibold focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">
              Violation Reason
            </p>
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
              <SelectTrigger className="w-52 capitalize h-12 bg-[#020617]/40 border-white/10 text-white/90 rounded-xl font-semibold focus:ring-indigo-500/50 hover:bg-[#020617]/60 transition-all">
                <SelectValue placeholder="All Reasons" />
              </SelectTrigger>
              <SelectContent className="bg-[#020617] border border-white/10 text-white/90 rounded-xl shadow-2xl backdrop-blur-xl">
                <SelectItem
                  value="all"
                  className="font-semibold text-white/40 focus:bg-white/5 cursor-pointer"
                >
                  All Reasons
                </SelectItem>
                {Object.values(ReportReasonItems).map((opt) => (
                  <SelectItem
                    key={opt}
                    value={opt}
                    className="capitalize font-semibold focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    {opt.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(filter.status || filter.entityType || filter.reason) && (
            <Button
              variant="ghost"
              className="mt-6 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
              onClick={() => setFilter({ limit: 10, offset: 0 })}
            >
              Reset Filters
            </Button>
          )}
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div variants={item}>
        <Table className="bg-white/5 shadow-2xl shadow-black/40 overflow-hidden rounded-2xl border border-white/10 ring-1 ring-white/5 mx-0.5 backdrop-blur-sm">
          <TableCaption className="text-white/30 font-medium text-[11px] tracking-[0.2em] uppercase py-8">
            Community Review Queue
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-white/[0.02] border-white/10 hover:bg-transparent">
              {[
                "Reporter",
                "Violation Target",
                "Type",
                "Violation Reason",
                "Date",
                "Status",
                "Actions",
              ].map((col) => (
                <TableHead
                  key={col}
                  className={`px-8 py-6 font-bold text-[10px] uppercase tracking-[0.15em] text-white/30 transition-all ${
                    col === "Reporter" || col === "Violation Target"
                      ? "text-left"
                      : "text-center"
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
                className="group border-white/5 transition-all duration-200 hover:bg-white/[0.03] cursor-pointer"
                onClick={() => setSelectedRow(row)}
              >
                <TableCell className="px-8 py-6 text-left">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-white tracking-tight leading-tight">
                      {row.reporter.fullName}
                    </span>
                    <span className="text-[11px] font-bold text-white/30 tabular-nums">
                      {row.reporter.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6 text-left">
                  {row.reportedUser ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-white tracking-tight leading-tight">
                        {row.reportedUser.fullName}
                      </span>
                      <span className="text-[11px] font-bold text-white/30 tabular-nums">
                        {row.reportedUser.email}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-black uppercase tracking-widest text-white/10">
                      N/A
                    </span>
                  )}
                </TableCell>
                <TableCell className="px-8 py-6 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/60 border border-white/10 backdrop-blur-sm">
                    {row.entityType}
                  </span>
                </TableCell>
                <TableCell className="px-8 py-6 text-center text-sm font-bold text-white/70 capitalize">
                  {row.reason.replace(/_/g, " ")}
                </TableCell>
                <TableCell className="px-8 py-6 text-center text-[13px] font-bold text-white/30 tabular-nums whitespace-nowrap">
                  {timeAgo(row.createdAt)}
                </TableCell>
                <TableCell className="px-8 py-6 text-center">
                  <ReportStatusChip status={row.status} />
                </TableCell>
                <TableCell className="px-8 py-6 text-center">
                  <DropdownMenu
                    open={openDropdownId === row.id}
                    onOpenChange={(isOpen) =>
                      setOpenDropdownId(isOpen ? row.id : null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-2 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group-hover:scale-110 active:scale-95 shadow-xl shadow-black/0 hover:shadow-black/40"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-5 h-5 text-white/40 group-hover:text-indigo-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#020617] border border-white/10 text-white/90 rounded-xl shadow-2xl backdrop-blur-xl min-w-[160px] p-2">
                      <DropdownMenuItem
                        className="font-bold text-xs uppercase tracking-widest p-3 focus:bg-indigo-600 focus:text-white rounded-lg cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRow(row);
                          setOpenDropdownId(null);
                        }}
                      >
                        Review Audit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {data.data.length === 0 && (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={7} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-10">
                    <Search size={64} strokeWidth={1} />
                    <p className="text-xs font-black tracking-[0.3em] uppercase">
                      No Reports In Queue
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <motion.div variants={item} className="flex justify-end pt-4">
        <Pagination
          pagination={data.pagination}
          onPageChange={handlePageChange}
        />
      </motion.div>

      {selectedRow && (
        <ReportDetailsDialog
          open={!!selectedRow}
          onOpenChange={(open) => {
            if (!open) setSelectedRow(null);
          }}
          report={selectedRow}
        />
      )}
    </motion.div>
  );
};

export default Reports;

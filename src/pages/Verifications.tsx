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
import { ShieldCheck, ShieldX, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
  const map: Record<
    string,
    { cls: string; icon: React.ReactNode; label: string }
  > = {
    pending: {
      cls: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      icon: <Clock size={12} />,
      label: "Pending",
    },
    verified: {
      cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      icon: <ShieldCheck size={12} />,
      label: "Verified",
    },
    rejected: {
      cls: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      icon: <ShieldX size={12} />,
      label: "Rejected",
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
const Verifications = () => {
  const { state } = useLocation();
  const [filter, setFilter] = useState<FilterState>({
    limit: 10,
    offset: 0,
    userId: state?.targetUserId || undefined,
  });
  const [selectedRow, setSelectedRow] = useState<VerificationType | null>(null);
  const { setResetFilters } = useOutletContext<AdminContext>();

  useEffect(() => {
    setResetFilters(() => () => setFilter({ limit: 10, offset: 0 }));
  }, [setResetFilters]);

  const { data, error, isLoading } = useFetchVerifications(filter);

  // Automatically open the verification request if navigated with targetUserId
  useEffect(() => {
    if (
      data?.data &&
      data.data.length > 0 &&
      state?.targetUserId &&
      !selectedRow
    ) {
      setSelectedRow(data.data[0]);
    }
  }, [data?.data, state?.targetUserId, selectedRow]);

  if (isLoading || !data)
    return <LoaderOverlay show={true} message="Please wait..." />;
  if (error) return <p>Error fetching verifications. Please try again.</p>;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const handlePageChange = (newPage: number) => {
    setFilter((prev) => ({
      ...prev,
      offset: (newPage - 1) * (prev.limit || 10),
    }));
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-20"
    >
      {/* Filter bar */}
      <motion.div
        variants={item}
        className="bg-white/5 p-6 shadow-xl shadow-black/20 border border-white/10 rounded-2xl backdrop-blur-md"
      >
        <div className="flex items-center gap-6 flex-wrap">
          <p className="text-sm font-bold text-white/50 uppercase tracking-[0.1em]">
            Status Filter
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
            <SelectTrigger className="w-48 capitalize h-12 bg-[#020617]/40 border-white/10 text-white/90 rounded-xl font-semibold focus:ring-indigo-500/50 hover:bg-[#020617]/60 transition-all">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-[#020617] border border-white/10 text-white/90 rounded-xl shadow-2xl backdrop-blur-xl">
              <SelectItem
                value="all"
                className="font-semibold text-white/40 focus:bg-white/5 cursor-pointer"
              >
                All Statuses
              </SelectItem>
              {Object.values(VerificationStatusItems).map((opt) => (
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

          {filter.userId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilter((prev) => ({ ...prev, userId: undefined, offset: 0 }))
              }
              className="text-white/60 h-12 border-white/10 px-6 rounded-xl hover:bg-white/10 hover:text-white transition-all font-bold"
            >
              Clear User Filter
            </Button>
          )}
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div variants={item}>
        <Table className="bg-white/5 shadow-2xl shadow-black/40 overflow-hidden rounded-2xl border border-white/10 ring-1 ring-white/5 mx-0.5 backdrop-blur-sm">
          <TableCaption className="text-white/30 font-medium text-[11px] tracking-[0.2em] uppercase py-8">
            User Verifications Overview
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-white/[0.02] border-white/10 hover:bg-transparent">
              {[
                "User",
                "Email",
                "Identification",
                "Date",
                "Status",
                "Actions",
              ].map((col) => (
                <TableHead
                  key={col}
                  className={`px-8 py-6 font-bold text-[10px] uppercase tracking-[0.15em] text-white/30 transition-all ${
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
                className="group border-white/5 transition-all duration-200 hover:bg-white/[0.03] cursor-pointer"
                onClick={() => setSelectedRow(row)}
              >
                <TableCell className="px-8 py-6 text-left">
                  <div className="flex items-center gap-3">
                    {row.user.profilePictureUrl ? (
                      <img
                        src={row.user.profilePictureUrl}
                        alt={row.user.fullName}
                        className="h-10 w-10 rounded-full object-cover border border-white/10 ring-2 ring-white/5"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[#020617] border border-white/10 flex items-center justify-center text-[10px] font-black text-white/30 shadow-inner">
                        {row.user.fullName?.[0] || "?"}
                      </div>
                    )}
                    <span className="font-bold text-white tracking-tight">
                      {row.user.fullName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6 text-center text-[13px] font-bold text-white/40 tracking-tight">
                  {row.user.email}
                </TableCell>
                <TableCell className="px-8 py-6 text-center text-[13px] font-bold text-white/60 tabular-nums">
                  {row.user.cnicNumber || "—"}
                </TableCell>
                <TableCell className="px-8 py-6 text-center text-[13px] font-bold text-white/30">
                  {timeAgo(row.createdAt)}
                </TableCell>
                <TableCell className="px-8 py-6 text-center">
                  <VerifStatusChip status={row.status} />
                </TableCell>
                <TableCell className="px-8 py-6 text-center">
                  <button
                    className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all border border-indigo-500/20 hover:border-indigo-500"
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
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={6} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-10">
                    <Search size={64} strokeWidth={1} />
                    <p className="text-xs font-black tracking-[0.3em] uppercase">
                      No Records Found
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
        <VerificationDetailsDialog
          open={!!selectedRow}
          onOpenChange={(open) => {
            if (!open) setSelectedRow(null);
          }}
          verification={selectedRow}
        />
      )}
    </motion.div>
  );
};

export default Verifications;

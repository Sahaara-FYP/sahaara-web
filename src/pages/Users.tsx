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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useFetchUsers } from "@/hooks/useFetchUsers";
import { StatusBadge } from "@/components/StatusBadge";
import { UserDetailsDialog } from "@/components/UserDetailsDialog";
import type { AdminUserType } from "@/types/AdminUsers";
import { useAuthContext } from "@/contexts/AuthContext";
import LoaderOverlay from "@/components/Loader";
import { handleSort } from "@/utils/sortHandler";
import { SortArrow } from "@/components/SortArrow";
import {
  MoreVertical,
  Search,
  ShieldAlert,
  UserIcon,
  ShieldCheck,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { useOutletContext } from "react-router-dom";
import { timeAgo } from "@/utils/timeAgo";
import { motion } from "framer-motion";

/* ---------------------------- TYPES ---------------------------- */
type FilterState = {
  search?: string;
  role?: string;
  isActive?: string;
  isVerified?: string;
  limit?: number;
  offset?: number;
};

type SortKey =
  | "fullName"
  | "email"
  | "role"
  | "isActive"
  | "isVerified"
  | "createdAt";

type AdminContext = { setResetFilters: (fn: () => void) => void };

/* ---------------------------- FILTER OPTIONS ---------------------------- */
const filterConfig = {
  role: ["admin", "user"],
  isActive: ["true", "false"],
  isVerified: ["true", "false"],
} as const;

/* ---------------------------- MAIN COMPONENT ---------------------------- */
const Users = () => {
  const [filter, setFilter] = useState<FilterState>({ limit: 10, offset: 0 });
  const [openViewDetailsDialog, setOpenViewDetailsDialog] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<AdminUserType>(
    {} as AdminUserType,
  );
  const [search, setSearch] = useState("");
  const { adminDetails } = useAuthContext();

  const [sortConfig, setSortConfig] = useState<{
    key: SortKey | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  const { setResetFilters } = useOutletContext<AdminContext>();

  function handleResetFilters() {
    setFilter({ limit: 10, offset: 0 });
    setSearch("");
  }

  useEffect(() => {
    setResetFilters(() => handleResetFilters);
  }, [setResetFilters]);

  const { data, error, isLoading, isFetching } = useFetchUsers(filter);

  if (!data || isLoading)
    return <LoaderOverlay show={true} message="Please wait..." />;
  if (isFetching && !data)
    return <LoaderOverlay show={true} message="Please wait..." />;
  if (error) return <p>Error! Please try again later</p>;

  /* ---------------------------- SORTED DATA ---------------------------- */
  const sortedData = [...data.data].sort(
    (a: AdminUserType, b: AdminUserType) => {
      if (!sortConfig.key || !sortConfig.direction) return 0;
      const valA = a[sortConfig.key as keyof AdminUserType];
      const valB = b[sortConfig.key as keyof AdminUserType];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (valA! < valB!) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA! > valB!) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    },
  );

  const handlePageChange = (newPage: number) => {
    setFilter((prev) => ({
      ...prev,
      offset: (newPage - 1) * (prev.limit || 10),
    }));
  };

  const handleSearch = () => {
    setFilter((prev) => ({ ...prev, search }));
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
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-20"
    >
      {/* Search + Filters */}
      <motion.div
        variants={item}
        className="bg-white/5 p-6 shadow-xl shadow-black/20 border border-white/10 rounded-2xl backdrop-blur-md"
      >
        <div className="grid gap-6 sm:grid-cols-3 items-center">
          {/* Search Input */}
          <div className="flex flex-col gap-3">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors"
                size={18}
              />
              <Input
                placeholder="Search users..."
                value={search || ""}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="w-full pl-12 h-12 bg-[#020617]/40 border-white/10 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/50 text-white rounded-xl placeholder:text-white/20 transition-all font-medium"
              />
            </div>
            <Button
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 rounded-xl font-bold tracking-wide transition-all"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 col-span-2">
            {(
              Object.entries(filterConfig) as [
                keyof typeof filterConfig,
                readonly string[],
              ][]
            ).map(([key, options]) => (
              <Select
                key={key}
                value={(filter[key as keyof FilterState] as string) || ""}
                onValueChange={(value) =>
                  setFilter({
                    ...filter,
                    [key]: value === "all" ? "" : value,
                  })
                }
              >
                <SelectTrigger className="w-full capitalize h-12 bg-[#020617]/40 border-white/10 text-white/90 rounded-xl font-semibold focus:ring-indigo-500/50 hover:bg-[#020617]/60 transition-all">
                  <SelectValue
                    placeholder={
                      key === "isActive"
                        ? "Status"
                        : key === "isVerified"
                          ? "Verified"
                          : key.charAt(0).toUpperCase() + key.slice(1)
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-[#020617] border border-white/10 text-white/90 rounded-xl shadow-2xl backdrop-blur-xl">
                  <SelectItem
                    value="all"
                    className="font-semibold text-white/40 focus:bg-white/5 cursor-pointer"
                  >
                    All{" "}
                    {key === "isActive"
                      ? "Statuses"
                      : key === "isVerified"
                        ? "Verifications"
                        : "Roles"}
                  </SelectItem>
                  {options.map((opt) => (
                    <SelectItem
                      className="capitalize font-semibold focus:bg-white/10 focus:text-white cursor-pointer"
                      key={opt}
                      value={opt}
                    >
                      {key === "isActive"
                        ? opt === "true"
                          ? "Active"
                          : "Inactive"
                        : key === "isVerified"
                          ? opt === "true"
                            ? "Verified"
                            : "Unverified"
                          : opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div variants={item}>
        <Table className="bg-white/5 shadow-2xl shadow-black/40 overflow-hidden rounded-2xl border border-white/10 ring-1 ring-white/5 mx-0.5 backdrop-blur-sm">
          <TableCaption className="text-white/30 font-medium text-[11px] tracking-[0.2em] uppercase py-8">
            Registered Users Directory
          </TableCaption>

          <TableHeader>
            <TableRow className="bg-white/[0.02] border-white/10 hover:bg-transparent">
              {[
                { key: "fullName", label: "User", sortable: true },
                { key: "role", label: "Role", sortable: true },
                { key: "isVerified", label: "Verification", sortable: true },
                { key: "isActive", label: "Status", sortable: true },
                { key: "createdAt", label: "Joined", sortable: true },
                { key: "actions", label: "Actions", sortable: false },
              ].map((col, i) => (
                <TableHead
                  key={i}
                  onClick={() =>
                    col.sortable &&
                    handleSort(col.key as SortKey, setSortConfig)
                  }
                  className={`px-8 py-6 font-bold text-[10px] uppercase tracking-[0.15em] text-white/30 cursor-pointer select-none transition-all
                    ${col.label === "Identity" ? "w-[320px] text-left" : col.label === "Control" ? "text-right w-[140px] justify-end" : "w-[130px] text-center"}
                    ${col.sortable ? "hover:text-indigo-400" : ""}
                  `}
                >
                  <div
                    className={`flex items-center ${col.label === "Actions" ? "justify-center" : col.label === "User" ? "justify-start" : "justify-center"}`}
                  >
                    {col.label}
                    {col.sortable && (
                      <SortArrow
                        column={col.key as SortKey}
                        sortConfig={sortConfig}
                      />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedData.map((row) => (
              <TableRow
                key={row.id}
                className="group border-white/5 transition-all duration-200 hover:bg-white/[0.03]"
              >
                <TableCell className="px-8 py-6 text-left">
                  <div className="flex items-center gap-4">
                    {row.profilePictureUrl ? (
                      <img
                        src={row.profilePictureUrl}
                        alt={row.fullName}
                        className="w-12 h-12 rounded-full object-cover border border-white/10 group-hover:border-indigo-500/30 transition-colors shadow-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/5 text-white/20 flex items-center justify-center border border-white/10 ring-1 ring-white/5 transition-all group-hover:text-indigo-400 group-hover:border-indigo-500/20">
                        <UserIcon size={24} strokeWidth={1} />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span
                        className="font-bold text-white tracking-tight truncate max-w-[220px] flex items-center gap-2"
                        title={row.fullName}
                      >
                        {row.fullName}
                        {adminDetails?.id.toString() === row.id.toString() && (
                          <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/30 tracking-[.2em] uppercase shadow-sm">
                            YOU
                          </span>
                        )}
                      </span>
                      <span
                        className="text-[13px] font-medium text-white/30 truncate max-w-[220px] group-hover:text-white/50 transition-colors"
                        title={row.email}
                      >
                        {row.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6 text-center">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] border
                    ${row.role === "admin" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-white/5 text-white/50 border-white/10"}`}
                  >
                    {row.role === "admin" && (
                      <ShieldAlert size={12} strokeWidth={2.5} />
                    )}
                    {row.role}
                  </span>
                </TableCell>
                <TableCell className="px-8 py-6 text-center">
                  {row.role === "admin" ? (
                    <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest italic opacity-50">
                      —
                    </span>
                  ) : (
                    <StatusBadge
                      type="moderation"
                      value={row.isVerified ? "verified" : "unverified"}
                    />
                  )}
                </TableCell>
                <TableCell className="px-8 py-6 text-center">
                  {row.role === "admin" ? (
                    <Badge
                      title="This account is protected by the system and cannot be deactivated."
                      className="min-w-[5.5rem] font-black tracking-[0.15em] justify-center capitalize px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 shadow-md shadow-indigo-500/5 transition-all cursor-help"
                    >
                      <ShieldCheck
                        size={14}
                        strokeWidth={2.5}
                        className="mr-2"
                      />
                      ACTIVE
                    </Badge>
                  ) : (
                    <StatusBadge
                      type="status"
                      value={row.isActive ? "active" : "inactive"}
                    />
                  )}
                </TableCell>
                <TableCell className="px-8 py-6 text-center font-bold text-white/50 text-[13px] tracking-tight">
                  {timeAgo(row.createdAt)}
                </TableCell>
                <TableCell className="px-8 py-6 text-center">
                  <DropdownMenu
                    open={openDropdownId === row.id}
                    onOpenChange={(isOpen) =>
                      setOpenDropdownId(isOpen ? row.id : null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <button className="p-2.5 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all ring-1 ring-transparent hover:ring-white/10 hover:shadow-lg">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#020617] border border-white/10 text-white shadow-2xl rounded-2xl p-2 min-w-[200px] backdrop-blur-3xl animate-in fade-in zoom-in-95 ease-out duration-200">
                      <DropdownMenuItem
                        className="font-bold text-[11px] uppercase tracking-widest focus:bg-indigo-600 focus:text-white cursor-pointer rounded-xl h-11 px-5 transition-all"
                        onClick={() => {
                          setSelectedRow(row);
                          setOpenViewDetailsDialog(true);
                          setOpenDropdownId(null);
                        }}
                      >
                        Manage User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {sortedData.length === 0 && (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={6} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-10">
                    <UserIcon size={64} strokeWidth={1} />
                    <p className="text-xs font-black tracking-[0.3em] uppercase">
                      No Users Found
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Pagination Section */}
      <motion.div variants={item} className="flex justify-end pt-4">
        <Pagination
          pagination={data.pagination}
          onPageChange={handlePageChange}
        />
      </motion.div>

      {openViewDetailsDialog && selectedRow && (
        <UserDetailsDialog
          open={openViewDetailsDialog}
          onOpenChange={setOpenViewDetailsDialog}
          user={selectedRow}
        />
      )}
    </motion.div>
  );
};

export default Users;

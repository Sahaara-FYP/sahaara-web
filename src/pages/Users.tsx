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
import { MoreVertical, Search, ShieldAlert, UserIcon, ShieldCheck } from "lucide-react";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { useOutletContext } from "react-router-dom";
import { timeAgo } from "@/utils/timeAgo";

/* ---------------------------- TYPES ---------------------------- */
type FilterState = {
  search?: string;
  role?: string;
  isActive?: string;
  isVerified?: string;
  limit?: number;
  offset?: number;
};

const sortableKeys = [
  "fullName",
  "email",
  "role",
  "isActive",
  "isVerified",
  "createdAt",
] as const;
type SortKey = (typeof sortableKeys)[number];

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
  const [selectedRow, setSelectedRow] = useState<AdminUserType>({} as AdminUserType);
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
  }, []);

  const { data, error, isLoading, isFetching } = useFetchUsers(filter);

  if (!data || isLoading)
    return <LoaderOverlay show={true} message="Please wait..." />;
  if (isFetching && !data)
    return <LoaderOverlay show={true} message="Please wait..." />;
  if (error) return <p>Error! Please try again later</p>;

  /* ---------------------------- SORTED DATA ---------------------------- */
  const sortedData = [...data.data].sort((a: AdminUserType, b: AdminUserType) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;
    const valA = (a as any)[sortConfig.key];
    const valB = (b as any)[sortConfig.key];
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handlePageChange = (newPage: number) => {
    setFilter((prev) => ({
      ...prev,
      offset: (newPage - 1) * (prev.limit || 10),
    }));
  };

  const handleSearch = () => {
    setFilter((prev) => ({ ...prev, search }));
  };

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="bg-app-foreground p-4 shadow rounded-lg">
        <div className="grid gap-4 sm:grid-cols-3 items-center">
          {/* Search Input */}
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search by name, email, username..."
                value={search || ""}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="w-full pl-9"
              />
            </div>
            <Button
              className="w-full bg-app-primary-color hover:bg-app-primary-hover-color"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 col-span-2">
            {(
              Object.entries(filterConfig) as [
                keyof typeof filterConfig,
                readonly string[]
              ][]
            ).map(([key, options]) => (
              <Select
                key={key}
                value={filter[key as keyof FilterState] as string || ""}
                onValueChange={(value) =>
                  setFilter({
                    ...filter,
                    [key]: value === "all" ? "" : value,
                  })
                }
              >
                <SelectTrigger className="w-full capitalize">
                  <SelectValue placeholder={key === "isActive" ? "Status" : key === "isVerified" ? "Verified" : key.charAt(0).toUpperCase() + key.slice(1)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All {key === "isActive" ? "Statuses" : key === "isVerified" ? "Verifications" : "Roles"}
                  </SelectItem>
                  {options.map((opt) => (
                    <SelectItem className="capitalize" key={opt} value={opt}>
                      {key === "isActive" 
                        ? (opt === "true" ? "Active" : "Inactive")
                        : key === "isVerified" 
                        ? (opt === "true" ? "Verified" : "Unverified")
                        : opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <Table className="bg-app-foreground shadow-md overflow-hidden rounded-lg">
        <TableCaption className="text-app-secondary-color text-sm py-2">
          Directory of all registered users
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-app-foreground border-b">
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
                className={`px-4 py-3 font-semibold text-app-primary-text cursor-pointer select-none
                  ${col.label === "User" ? "w-[300px] text-left" : col.label === "Actions" ? "text-right w-[150px] justify-end" : "w-[120px] text-center"}
                  ${col.sortable ? "hover:text-app-primary-color" : ""}
                `}
              >
                <div
                  className={`flex items-center ${col.label === "Actions" ? "justify-center" : col.label === "User" ? "justify-start" : "justify-center"}`}
                >
                  {col.label}
                  {col.sortable && (
                    <SortArrow column={col.key as SortKey} sortConfig={sortConfig} />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedData.map((row) => (
            <TableRow key={row.id} className="hover:bg-app-background/70 transition-colors">
              <TableCell className="px-4 py-3 text-left">
                <div className="flex items-center gap-3">
                  {row.profilePictureUrl ? (
                    <img src={row.profilePictureUrl} alt={row.fullName} className="w-10 h-10 rounded-full object-cover border" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-app-background text-app-secondary-text flex items-center justify-center border">
                      <UserIcon size={20} />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-app-primary-text truncate max-w-[200px]" title={row.fullName}>
                      {row.fullName}
                      {adminDetails?.id.toString() === row.id.toString() && (
                        <span className="ml-2 text-[10px] font-bold text-[var(--app-primary-color)] bg-[var(--app-primary-color)]/10 px-1.5 py-0.5 rounded border border-[var(--app-primary-color)]/30 tracking-wide uppercase shadow-sm">
                          You
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-app-secondary-text truncate max-w-[200px]" title={row.email}>
                      {row.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 text-center">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider
                  ${row.role === 'admin' ? "bg-amber-100 text-amber-800 border-amber-200 border" : "bg-slate-100 text-slate-700 border-slate-200 border"}`}
                >
                  {row.role === 'admin' && <ShieldAlert size={12} />}
                  {row.role}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3 text-center">
                {row.role === 'admin' ? (
                  <span className="text-xs font-semibold text-gray-400">—</span>
                ) : (
                  <StatusBadge type="moderation" value={row.isVerified ? "verified" : "unverified"} />
                )}
              </TableCell>
              <TableCell className="px-4 py-3 text-center">
                {row.role === 'admin' ? (
                  <Badge 
                    title="This account is protected by the system and cannot be deactivated."
                    className="min-w-[5rem] capitalize px-2 py-1 bg-[var(--app-primary-color)]/20 text-[var(--app-primary-color)] border border-[var(--app-primary-color)] hover:bg-[var(--app-primary-color)]/30 cursor-help"
                  >
                    <ShieldCheck size={12} strokeWidth={2.5} className="mr-1" />
                    Active
                  </Badge>
                ) : (
                  <StatusBadge type="status" value={row.isActive ? "active" : "inactive"} />
                )}
              </TableCell>
              <TableCell className="px-4 py-3 text-center text-sm">{timeAgo(row.createdAt)}</TableCell>
              <TableCell className="px-4 py-3 text-center text-app-secondary-text">
                <DropdownMenu
                  open={openDropdownId === row.id}
                  onOpenChange={(isOpen) => setOpenDropdownId(isOpen ? row.id : null)}
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
            <TableCell colSpan={6} className="py-8 text-center text-app-secondary-text">
              No Users Found matching the criteria
            </TableCell>
          )}
        </TableBody>
      </Table>

      <Pagination pagination={data.pagination} onPageChange={handlePageChange} />

      {openViewDetailsDialog && selectedRow && (
        <UserDetailsDialog
          open={openViewDetailsDialog}
          onOpenChange={setOpenViewDetailsDialog}
          user={selectedRow}
        />
      )}
    </div>
  );
};

export default Users;

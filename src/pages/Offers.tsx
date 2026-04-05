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
import { useFetchOffers } from "@/hooks/useFetchOffers";
import { StatusBadge } from "@/components/StatusBadge";
import { OfferDetailsDialog } from "@/components/OfferDetailsDialog";
import { EditModeration } from "@/components/EditModeration";
import { ModerationStatusItems, RequestCategoryItems } from "@/types/Requests";
import {
  OfferStatusItems,
  OfferTypeItems,
  type OfferType_,
} from "@/types/Offers";
import LoaderOverlay from "@/components/Loader";
import { handleSort } from "@/utils/sortHandler";
import { SortArrow } from "@/components/SortArrow";
import { MoreVertical, Search } from "lucide-react";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { useOutletContext } from "react-router-dom";
import { timeAgo } from "@/utils/timeAgo";
import { motion } from "framer-motion";

/* ---------------------------- TYPES ---------------------------- */
type FilterState = {
  search?: string;
  category?: string;
  type?: string;
  status?: string;
  moderationStatus?: string;
  limit?: number;
  offset?: number;
};

type SortKey =
  | "title"
  | "category"
  | "type"
  | "status"
  | "interactionsCount"
  | "moderationStatus"
  | "createdAt";

type AdminContext = { setResetFilters: (fn: () => void) => void };

/* ---------------------------- FILTER OPTIONS ---------------------------- */
const filterConfig = {
  category: Object.values(RequestCategoryItems),
  type: Object.values(OfferTypeItems),
  status: Object.values(OfferStatusItems),
  moderationStatus: Object.values(ModerationStatusItems),
} as const;

/* ---------------------------- MAIN COMPONENT ---------------------------- */
const Offers = () => {
  const [filter, setFilter] = useState<FilterState>({ limit: 10, offset: 0 });
  const [openViewDetailsDialog, setOpenViewDetailsDialog] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [openEditModeration, setOpenEditModeration] = useState(false);
  const [selectedRow, setSelectedRow] = useState<OfferType_>({} as OfferType_);
  const [search, setSearch] = useState("");

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

  const { data, error, isLoading, isFetching } = useFetchOffers(filter);

  if (!data || isLoading)
    return <LoaderOverlay show={true} message="Please wait..." />;
  if (isFetching && !data)
    return <LoaderOverlay show={true} message="Please wait..." />;
  if (error) return <p>Error! Please try again later</p>;

  /* ---------------------------- SORTED DATA ---------------------------- */
  const sortedData = [...data.data].sort((a: OfferType_, b: OfferType_) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;
    const key = sortConfig.key as keyof OfferType_;
    const valA = a[key];
    const valB = b[key];
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

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

  const handleSearch = () => {
    setFilter((prev) => ({ ...prev, search }));
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
                placeholder="Search offers..."
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 col-span-2">
            {(
              Object.entries(filterConfig) as [
                keyof typeof filterConfig,
                string[],
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
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                </SelectTrigger>
                <SelectContent className="bg-[#020617] border border-white/10 text-white/90 rounded-xl shadow-2xl backdrop-blur-xl">
                  <SelectItem
                    value="all"
                    className="font-semibold text-white/40 focus:bg-white/5 cursor-pointer"
                  >
                    All {key.charAt(0).toUpperCase() + key.slice(1)}s
                  </SelectItem>
                  {options.map((opt) => (
                    <SelectItem
                      className="capitalize font-semibold focus:bg-white/10 focus:text-white cursor-pointer"
                      key={opt}
                      value={opt}
                    >
                      {opt}
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
            Community Offers Directory
          </TableCaption>

          <TableHeader>
            <TableRow className="bg-white/[0.02] border-white/10 hover:bg-transparent">
              {[
                { key: "title", label: "Title", sortable: true },
                { key: "category", label: "Category", sortable: true },
                { key: "type", label: "Type", sortable: true },
                { key: "createdAt", label: "Date", sortable: true },
                {
                  key: "interactionsCount",
                  label: "Interactions",
                  sortable: true,
                },
                { key: "status", label: "Status", sortable: true },
                {
                  key: "moderationStatus",
                  label: "Moderation",
                  sortable: true,
                },
                { key: "actions", label: "Actions", sortable: false },
              ].map((col, i) => (
                <TableHead
                  key={i}
                  onClick={() =>
                    col.sortable &&
                    handleSort(col.key as SortKey, setSortConfig)
                  }
                  className={`px-8 py-6 font-bold text-[10px] uppercase tracking-[0.15em] text-white/30 cursor-pointer select-none transition-all
                    ${col.label === "Title" ? "w-[300px] text-left" : col.label === "Actions" ? "text-right w-[140px] justify-end" : "w-[130px] text-center"}
                    ${col.sortable ? "hover:text-indigo-400" : ""}
                  `}
                >
                  <div
                    className={`flex items-center ${col.label === "Actions" ? "justify-center" : col.label === "Title" ? "justify-start" : "justify-center"}`}
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
            {sortedData.map((row, idx) => (
              <TableRow
                key={idx}
                className="group border-white/5 transition-all duration-200 hover:bg-white/[0.03]"
              >
                <TableCell
                  className="px-8 py-6 text-left font-bold text-white tracking-tight"
                  title={row.title}
                >
                  <div className="truncate max-w-[280px]">{row.title}</div>
                </TableCell>
                <TableCell className="px-8 py-6 text-center">
                  <span className="bg-white/5 text-white/60 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10">
                    {row.category}
                  </span>
                </TableCell>
                <TableCell className="px-8 py-6 text-center">
                  <StatusBadge type="offerType" value={row.type} />
                </TableCell>
                <TableCell className="px-8 py-6 text-center font-bold text-white/50 text-[13px] tracking-tight">
                  {timeAgo(row.createdAt)}
                </TableCell>
                <TableCell className="px-8 py-6 text-center font-black text-indigo-400 text-lg">
                  {row.interactionsCount ?? 0}
                </TableCell>
                <TableCell className="px-8 py-6 text-center">
                  <StatusBadge type="status" value={row.status} />
                </TableCell>
                <TableCell className="px-8 py-6 text-center">
                  <StatusBadge type="moderation" value={row.moderationStatus} />
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
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-bold text-[11px] uppercase tracking-widest focus:bg-rose-600 focus:text-white cursor-pointer rounded-xl h-11 px-5 transition-all mt-1"
                        onClick={() => {
                          setSelectedRow(row);
                          setOpenEditModeration(true);
                          setOpenDropdownId(null);
                        }}
                      >
                        Edit Moderation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {sortedData.length === 0 && (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={8} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-10">
                    <Search size={64} strokeWidth={1} />
                    <p className="text-xs font-black tracking-[0.3em] uppercase">
                      No Offers Found
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
        <OfferDetailsDialog
          open={openViewDetailsDialog}
          onOpenChange={setOpenViewDetailsDialog}
          offer={selectedRow}
        />
      )}
      {openEditModeration && selectedRow && (
        <EditModeration
          open={openEditModeration}
          onOpenChange={setOpenEditModeration}
          item={selectedRow as unknown as OfferType_}
          type="offer"
          endpoint="/offers/moderation-status"
          queryKey="offers"
        />
      )}
    </motion.div>
  );
};

export default Offers;

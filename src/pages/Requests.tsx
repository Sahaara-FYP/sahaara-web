import { useState } from "react";
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
import { useFetchRequests } from "@/hooks/useFetchRequests";
import { StatusBadge } from "@/components/StatusBadge";
import { RequestDetailsDialog } from "@/components/RequestDetailsDialog";
import {
  ModerationStatusItems,
  RequestCategoryItems,
  RequestStatusItems,
  UrgencyLevelItems,
} from "@/types/Requests";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { camelToWords } from "./../utils/Normalise";
import LoaderOverlay from "@/components/Loader";
import { EditModeration } from "@/components/EditModeration";

/* ---------------------------- TYPES ---------------------------- */

type FilterState = {
  search?: string;
  category?: string;
  urgencyLevel?: string;
  status?: string;
  moderationStatus?: string;
};

// type representing a single row in the table
type RequestRow = {
  title: string;
  category: string;
  urgencyLevel: string;
  status: string;
  locationLat: number;
  locationLng: number;
  participantsCount: number;
  moderationStatus: string;
};

// allowed sortable column keys
const sortableKeys = [
  "title",
  "category",
  "urgencyLevel",
  "status",
  "participantsCount",
  "moderationStatus",
] as const;

type SortKey = (typeof sortableKeys)[number];

/* ---------------------------- FILTER OPTIONS ---------------------------- */

const filterConfig = {
  category: Object.values(RequestCategoryItems),
  urgencyLevel: Object.values(UrgencyLevelItems),
  status: Object.values(RequestStatusItems),
  moderationStatus: Object.values(ModerationStatusItems),
} as const;

/* ---------------------------- MAIN COMPONENT ---------------------------- */

const Requests = () => {
  const [filter, setFilter] = useState<FilterState>({});
  console.log("🚀 ~ Requests ~ filter:", filter);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RequestRow | null>(null);

  const [sortConfig, setSortConfig] = useState<{
    key: SortKey | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  const { data, error, isLoading, isFetching, isPending } =
    useFetchRequests(filter);
  if (!data) return null;

  /* ---------------------------- SORT HANDLER ---------------------------- */

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        const newDir =
          prev.direction === "asc"
            ? "desc"
            : prev.direction === "desc"
            ? null
            : "asc";
        return { key, direction: newDir };
      }
      return { key, direction: "asc" };
    });
  };

  // sort data locally
  const sortedData = [...data.data].sort((a: RequestRow, b: RequestRow) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;

    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  /* ---------------------------- SORT ARROW ICON ---------------------------- */

  const SortArrow = ({ column }: { column: SortKey }) => {
    if (sortConfig.key !== column || !sortConfig.direction)
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-gray-400" />;

    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1 text-app-primary-color" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1 text-app-primary-color" />
    );
  };

  /* ---------------------------- RENDER ---------------------------- */

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3 items-center justify-between bg-app-foreground p-4 shadow rounded-lg">
        <Input
          placeholder="Search requests..."
          value={filter.search || ""}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="w-[260px]"
        />

        <div className="flex gap-3">
          {(
            Object.entries(filterConfig) as [
              keyof typeof filterConfig,
              string[]
            ][]
          ).map(([key, options]) => (
            <Select
              key={key}
              value={filter[key] || ""}
              onValueChange={(value) =>
                setFilter({
                  ...filter,
                  [key]: value === "all" ? "" : value,
                })
              }
            >
              <SelectTrigger className="w-[150px] capitalize">
                <SelectValue placeholder={camelToWords(key)[0]} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem className="capitalize" key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table className="bg-app-foreground shadow-md rounded-xl overflow-hidden">
        <TableCaption className="text-app-secondary-color text-sm py-4">
          Recent community requests
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-app-background border-b">
            {[
              { key: "title", label: "Title", sortable: true },
              { key: "category", label: "Category", sortable: true },
              { key: "urgencyLevel", label: "Urgency", sortable: true },
              { key: "status", label: "Status", sortable: true },
              { key: "locationLat", label: "Location", sortable: false },
              { key: "participantsCount", label: "Responses", sortable: true },
              { key: "moderationStatus", label: "Moderation", sortable: true },
              { key: "actions", label: "Actions", sortable: false },
            ].map((col, i) => (
              <TableHead
                key={i}
                onClick={() => col.sortable && handleSort(col.key as SortKey)}
                className={`px-4 py-3 font-semibold text-app-primary-text cursor-pointer select-none
                  ${
                    col.label === "Title"
                      ? "w-[250px] text-left"
                      : col.label === "Actions"
                      ? "text-right w-[150px]"
                      : "w-[150px] text-center"
                  }
                  ${col.sortable ? "hover:text-app-primary-color" : ""}
                `}
              >
                <div className="flex items-center justify-center sm:justify-start">
                  {col.label}
                  {col.sortable && <SortArrow column={col.key as SortKey} />}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedData.map((row, idx) => (
            <TableRow
              key={idx}
              className="odd:bg-app-foreground even:bg-app-background hover:bg-app-background transition-colors "
            >
              <TableCell className="px-4 py-3 text-left">{row.title}</TableCell>
              <TableCell className="px-4 py-3 capitalize">
                {row.category}
              </TableCell>
              <TableCell
                className={`
                px-4 py-3 font-medium capitalize
                ${
                  row.urgencyLevel === "high"
                    ? "text-red-600"
                    : row.urgencyLevel === "low"
                    ? "text-yellow-600"
                    : "text-green-600"
                }
              `}
              >
                {row.urgencyLevel}
              </TableCell>
              <TableCell className="px-4 py-3">
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell className="px-4 py-3">
                {row.locationLat}, {row.locationLng}
              </TableCell>
              <TableCell className="px-4 py-3">
                {row.participantsCount ?? 0}
              </TableCell>
              <TableCell
                className={`px-4 py-3 font-medium capitalize ${
                  row.moderationStatus === "clean"
                    ? "text-green-600"
                    : row.moderationStatus === "flagged"
                    ? "text-yellow-600"
                    : row.moderationStatus === "reviewed"
                    ? "text-app-primary-color"
                    : row.moderationStatus === "blocked"
                    ? "text-red-600"
                    : "text-app-secondary-text"
                }`}
              >
                {row.moderationStatus}
              </TableCell>
              <TableCell className="px-4 py-3 text-center text-app-secondary-text">
                <DropdownMenu>
                  <DropdownMenuTrigger>...</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedRow(row);
                        setOpenDialog(true);
                      }}
                    >
                      View Details
                    </DropdownMenuItem>
                    <EditModeration request={row} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <LoaderOverlay
        show={!data || isLoading || isFetching}
        message="Please wait..."
      />

      {/* Details Dialog */}
      <RequestDetailsDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        request={selectedRow}
      />
    </div>
  );
};

export default Requests;

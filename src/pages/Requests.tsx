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
  TrueFalseDropdownItems,
  UrgencyLevelItems,
  type RequestType,
} from "@/types/Requests";
import { camelToWords } from "./../utils/Normalise";
import LoaderOverlay from "@/components/Loader";
import { EditModeration } from "@/components/EditModeration";
import { handleSort } from "@/utils/sortHandler";
import { SortArrow } from "@/components/SortArrow";
import { MoreVertical, Search } from "lucide-react";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";

/* ---------------------------- TYPES ---------------------------- */

type FilterState = {
  search?: string;
  category?: string;
  urgencyLevel?: string;
  status?: string;
  moderationStatus?: string;
  postAnonymously?: string;
  visibilityVerifiedOnly?: string;
  visibilityWomenOnly?: string;
  limit?: number;
  offset?: number;
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
  postAnonymously: Object.values(TrueFalseDropdownItems),
  visibilityVerifiedOnly: Object.values(TrueFalseDropdownItems),
  visibilityWomenOnly: Object.values(TrueFalseDropdownItems),
} as const;

/* ---------------------------- MAIN COMPONENT ---------------------------- */

const Requests = () => {
  const [filter, setFilter] = useState<FilterState>({ limit: 10, offset: 0 });
  const [openViewDetailsDialog, setOpenViewDetailsDialog] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [openEditModeration, setOpenEditModeration] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RequestType>(
    {} as RequestType
  );
  const [search, setSearch] = useState("");

  const [sortConfig, setSortConfig] = useState<{
    key: SortKey | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  const { data, error, isLoading, isFetching, isPending, isRefetching } =
    useFetchRequests(filter);
  console.log("🚀 ~ Requests ~ data:", data);
  if (!data) return <LoaderOverlay show={true} message="Please wait..." />;
  if (error) return <p>Error! Please try again later</p>;

  /* ---------------------------- SORTED DATA ---------------------------- */

  const sortedData = [...data.data].sort((a: RequestType, b: RequestType) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;

    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  /* ---------------------------- RENDER ---------------------------- */

  const handlePageChange = (newPage: number) => {
    setFilter((prev) => ({
      ...prev,
      offset: (newPage - 1) * (prev.limit || 20),
    }));
  };

  const handleSearch = () => {
    setFilter((prev) => ({ ...prev, search }));
  };

  return (
    <div className="space-y-4">
      <LoaderOverlay
        show={isLoading || isFetching || isPending || isRefetching}
      />
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
                placeholder="Search requests..."
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

          {/* Filters Section */}
          <div
            className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4 
        gap-3
        col-span-2
      "
          >
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
                <SelectTrigger className="w-full capitalize">
                  <SelectValue
                    placeholder={
                      key === "postAnonymously"
                        ? camelToWords(key)[1]
                        : key === "visibilityVerifiedOnly" ||
                          key === "visibilityWomenOnly"
                        ? camelToWords(key).slice(1, 3).join(" ")
                        : camelToWords(key)[0]
                    }
                  />
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
      </div>

      {/* Table */}
      <Table className="bg-app-foreground shadow-md overflow-hidden rounded-lg">
        <TableCaption className="text-app-secondary-color text-sm py-2">
          Recent community requests
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-app-foreground border-b">
            {[
              { key: "title", label: "Title", sortable: true },
              { key: "category", label: "Category", sortable: true },
              { key: "locationLat", label: "Location", sortable: false },
              { key: "participantsCount", label: "Responses", sortable: true },
              { key: "urgencyLevel", label: "Urgency", sortable: true },
              { key: "status", label: "Status", sortable: true },
              { key: "moderationStatus", label: "Moderation", sortable: true },
              { key: "actions", label: "Actions", sortable: false },
            ].map((col, i) => (
              <TableHead
                key={i}
                onClick={() =>
                  col.sortable && handleSort(col.key as SortKey, setSortConfig)
                }
                className={`px-4 py-3 font-semibold text-app-primary-text cursor-pointer select-none
                  ${
                    col.label === "Title"
                      ? "w-[250px] text-left"
                      : col.label === "Actions"
                      ? "text-right w-[150px] justify-end"
                      : "w-[150px] text-center"
                  }
                  ${col.sortable ? "hover:text-app-primary-color" : ""}
                `}
              >
                <div
                  className={`flex items-center ${
                    col.label === "Actions"
                      ? "justify-center"
                      : "justify-center sm:justify-start"
                  }`}
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
              className="hover:bg-app-background/70 transition-colors "
            >
              <TableCell
                className="px-4 py-3 text-left w-[200px] max-w-[200px] truncate whitespace-nowrap overflow-hidden"
                title={row.title}
              >
                {row.title}
              </TableCell>
              <TableCell className="px-4 py-3 capitalize">
                {row.category}
              </TableCell>
              <TableCell className="px-4 py-3">
                {row.locationLat}, {row.locationLng}
              </TableCell>
              <TableCell className="px-4 py-3">
                {row.participantsCount ?? 0}
              </TableCell>
              <TableCell>
                <StatusBadge type="urgency" value={row.urgencyLevel} />
              </TableCell>
              <TableCell className="px-4 py-3">
                <StatusBadge type="status" value={row.status} />
              </TableCell>
              <TableCell>
                <StatusBadge type="moderation" value={row.moderationStatus} />
              </TableCell>
              <TableCell className="px-4 py-3 text-center text-app-secondary-text ">
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
                        setOpenViewDetailsDialog(true);
                        setOpenDropdownId(null);
                      }}
                    >
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
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
            <TableCell colSpan={8} className="py-4 text-center w-full">
              No Requests Found
            </TableCell>
          )}
        </TableBody>
      </Table>
      <Pagination
        pagination={data.pagination}
        onPageChange={handlePageChange}
      />

      {openViewDetailsDialog && (
        <RequestDetailsDialog
          open={openViewDetailsDialog}
          onOpenChange={setOpenViewDetailsDialog}
          request={selectedRow}
        />
      )}
      {openEditModeration && (
        <EditModeration
          request={selectedRow}
          open={openEditModeration}
          onOpenChange={setOpenEditModeration}
        />
      )}
    </div>
  );
};

export default Requests;

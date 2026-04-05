import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { PaginationType } from "@/types/Requests";

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function AppPagination({
  pagination,
  onPageChange,
  className = "",
}: PaginationProps) {
  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 2;
    const start = Math.max(1, page - maxVisible);
    const end = Math.min(totalPages, page + maxVisible);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
    >
      <span className="text-sm text-white/50 font-medium w-full">
        Page {page} of {totalPages}{" "}
        <span className="text-white/30 mx-1">|</span> {pagination.total} entries
      </span>

      <Pagination className="justify-end">
        <PaginationContent className="space-x-1">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => hasPrevPage && onPageChange(page - 1)}
              className={`${
                !hasPrevPage ? "pointer-events-none opacity-50" : ""
              } bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer`}
            />
          </PaginationItem>
          <div className="flex gap-1">
            {getPageNumbers().map((num, idx) => (
              <PaginationItem key={idx}>
                {typeof num === "number" ? (
                  <PaginationLink
                    onClick={() => onPageChange(num)}
                    isActive={num === page}
                    className={
                      num === page
                        ? "bg-indigo-600 border border-indigo-500/50 shadow-md shadow-indigo-500/20 text-white font-medium transition-all cursor-default"
                        : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 font-medium hover:text-white transition-all cursor-pointer"
                    }
                  >
                    {num}
                  </PaginationLink>
                ) : (
                  <span className="px-2 text-white/30 select-none">...</span>
                )}
              </PaginationItem>
            ))}
          </div>

          <PaginationItem>
            <PaginationNext
              onClick={() => hasNextPage && onPageChange(page + 1)}
              className={`${
                !hasNextPage ? "pointer-events-none opacity-50" : ""
              } bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

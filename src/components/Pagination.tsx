interface PaginationProps {
  page: number;
  limit: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  className?: string;
}

const Pagination = ({
  page,
  limit,
  totalCount,
  onPageChange,
  className = "",
}: PaginationProps) => {
  const totalPages = Math.ceil(totalCount / limit);

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalCount);

  return (
    <div
      className={`flex items-center justify-between flex-wrap gap-2 text-sm ${className}`}
    >
      {/* Summary */}
      <span className="text-muted-foreground">
        Showing {from}–{to} of {totalCount}
      </span>

      {/* Page Controls */}
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>

        <span className="px-2 text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

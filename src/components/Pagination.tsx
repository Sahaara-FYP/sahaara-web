interface PaginationProps {
  page: number;
  limit: number;
  count: number;
  onPageChange: (newPage: number) => void;
  className?: string;
}

const Pagination = ({
  page,
  limit,
  count,
  onPageChange,
  className = "",
}: PaginationProps) => {
  const from = (page - 1) * limit + 1;
  const to = from + count - 1;

  const isFirstPage = page <= 1;
  const isLastPage = count < limit;

  return (
    <div
      className={`flex items-center justify-between flex-wrap gap-2 text-sm ${className}`}
    >
      <span className="text-muted-foreground">
        Showing {from}-{to}
      </span>

      {/* Page Controls */}
      <div className="flex gap-2 items-center">
        <button
          disabled={isFirstPage}
          className={`px-3 py-1 rounded bg-app-primary-color text-white dark:border disabled:opacity-60 ${
            isFirstPage ? "cursor-not-allowed" : ""
          }`}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>

        <span className="px-2 text-muted-foreground">Page {page}</span>

        <button
          disabled={isLastPage}
          className={`px-3 py-1 rounded bg-app-primary-color text-white dark:border disabled:opacity-60 ${
            isLastPage ? "cursor-not-allowed" : ""
          }`}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

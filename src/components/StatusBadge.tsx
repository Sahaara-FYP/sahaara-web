import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: string;
};

const statusStyles: Record<string, string> = {
  pending:
    "bg-[var(--app-secondary-color)]/20 text-[var(--app-secondary-color)] border border-[var(--app-secondary-color)]",
  partially_accepted:
    "bg-[var(--app-tertiary-color)]/20 text-[var(--app-tertiary-color)] border border-[var(--app-tertiary-color)]",
  accepted:
    "bg-[var(--app-primary-color)]/20 text-[var(--app-primary-color)] border border-[var(--app-primary-color)]",
  completed: "bg-green-500/20 text-green-700 border border-green-500", // success ✅
  cancelled: "bg-red-500/20 text-red-700 border border-red-500", // danger ❌
  expired: "bg-gray-500/20 text-gray-700 border border-gray-500", // neutral ⏳
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const style = statusStyles[status.toLowerCase()] || statusStyles.default;

  return <Badge className={`${style} capitalize px-2 py-1`}>{status}</Badge>;
};

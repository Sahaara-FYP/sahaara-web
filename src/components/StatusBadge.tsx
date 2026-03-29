import { Badge } from "@/components/ui/badge";

type BadgeType = "status" | "moderation" | "urgency" | "default";

type StatusBadgeProps = {
  type: BadgeType;
  value: string;
  className?: string;
};

// 🎨 Centralized color themes for all badge types
const badgeColorSchemes: Record<BadgeType, Record<string, string>> = {
  status: {
    pending:
      "bg-[var(--app-secondary-color)]/20 text-[var(--app-secondary-color)] border border-[var(--app-secondary-color)]",
    partially_accepted:
      "bg-[var(--app-tertiary-color)]/20 text-[var(--app-tertiary-color)] border border-[var(--app-tertiary-color)]",
    accepted:
      "bg-[var(--app-primary-color)]/20 text-[var(--app-primary-color)] border border-[var(--app-primary-color)]",
    active:
      "bg-[var(--app-primary-color)]/20 text-[var(--app-primary-color)] border border-[var(--app-primary-color)]",
    inactive: "bg-red-500/20 text-red-700 border border-red-500",
    completed: "bg-green-500/20 text-green-700 border border-green-500",
    cancelled: "bg-red-500/20 text-red-700 border border-red-500",
    expired: "bg-gray-500/20 text-gray-700 border border-gray-500",
    resolved: "bg-green-500/20 text-green-700 border border-green-500",
  },

  moderation: {
    clean: "bg-green-500/20 text-green-700 border border-green-500",
    verified: "bg-green-500/20 text-green-700 border border-green-500",
    flagged: "bg-yellow-400/20 text-yellow-700 border border-yellow-400",
    unverified: "bg-yellow-400/20 text-yellow-700 border border-yellow-400",
    reviewed:
      "bg-[var(--app-primary-color)]/20 text-[var(--app-primary-color)] border border-[var(--app-primary-color)]",
    blocked: "bg-red-500/20 text-red-700 border border-red-500",
  },

  urgency: {
    high: "bg-red-500/20 text-red-700 border border-red-500",
    normal: "bg-green-500/20 text-green-700 border border-green-500",
    low: "bg-yellow-400/20 text-yellow-700 border border-yellow-400",
  },

  default: {
    default: "bg-gray-200 text-gray-700 border border-gray-300",
  },
};

export const StatusBadge = ({
  type,
  value,
  className = "",
}: StatusBadgeProps) => {
  const theme = badgeColorSchemes[type] || badgeColorSchemes.default;
  const colorClass = theme[value.toLowerCase()] || theme.default;

  return (
    <Badge
      className={`${colorClass} min-w-[5rem] capitalize px-2 py-1 ${className}`}
    >
      {value}
    </Badge>
  );
};

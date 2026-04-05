import { Badge } from "@/components/ui/badge";

type BadgeType = "status" | "moderation" | "urgency" | "offerType" | "default";

type StatusBadgeProps = {
  type: BadgeType;
  value: string;
  className?: string;
};

// 🎨 Centralized color themes for all badge types
const badgeColorSchemes: Record<BadgeType, Record<string, string>> = {
  status: {
    pending: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    partially_accepted: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
    accepted: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    inactive: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    completed:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    fulfilled:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    cancelled: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    rejected: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    expired: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
    resolved: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  },
  moderation: {
    clean: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    verified: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    flagged: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    unverified: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    reviewed: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    blocked: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  },
  urgency: {
    high: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    normal: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    low: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  },
  offerType: {
    service: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
    resource: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  },
  default: {
    default: "bg-white/5 text-white/70 border border-white/10",
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
      className={`${colorClass} min-w-[5rem] font-medium tracking-wide justify-center capitalize px-2 py-1 ${className}`}
    >
      {value}
    </Badge>
  );
};

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import type { ReportType } from "@/types/Reports";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { XCircle } from "lucide-react";

type ReportDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: ReportType;
};

export const ReportDetailsDialog: React.FC<ReportDetailsDialogProps> = ({
  open,
  onOpenChange,
  report,
}) => {
  const [adminNotes, setAdminNotes] = useState(report?.adminNotes || "");
  const [status, setStatus] = useState<"reviewed" | "resolved" | "dismissed">(
    "reviewed",
  );
  const [blockUser, setBlockUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  if (!report) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.patch(`/reports/${report.id}/action`, {
        status,
        adminNotes,
        blockUser,
      });
      toast.success("Report updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      onOpenChange(false);
    } catch (err: unknown) {
      const errorMessage =
        (err as any).response?.data?.error || "Action failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isPending = report.status === "pending" || report.status === "reviewed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl bg-[#020617] border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] text-white p-0 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white tracking-tight">
              Report Audit
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-white/50">
              Administrative review for community violation reports.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {/* Report Info */}
          <Section title="Submission Context">
            <Info label="Reported Asset" value={report.entityType} highlight />
            <Info label="Asset ID" value={report.entityId} />
            <Info
              label="Primary Reason"
              value={report.reason.replace(/_/g, " ")}
              highlight
            />
            <Info
              label="Reporter's Statement"
              value={report.details || "No statement provided"}
            />
            <Info label="Audit Status">
              <ReportStatusChip status={report.status} />
            </Info>
            <Info
              label="Submitted On"
              value={new Date(report.createdAt).toLocaleString()}
            />
            {report.resolvedAt && (
              <Info
                label="Resolution Date"
                value={new Date(report.resolvedAt).toLocaleString()}
              />
            )}
          </Section>

          {/* Report History */}
          {report.adminNotes && (
            <Section title="Administrative History">
              <Info label="Previous Audit Notes" value={report.adminNotes} />
            </Section>
          )}

          {/* Reporter */}
          <Section title="Reporter Credentials">
            <Info label="Full Identity" value={report.reporter.fullName} />
            <Info label="Contact Secure" value={report.reporter.email} />
            <Info
              label="Platform Alias"
              value={report.reporter.username || "—"}
            />
          </Section>

          {/* Reported User */}
          {report.reportedUser && (
            <Section title="Violation Target Identity">
              <Info label="Legal Name" value={report.reportedUser.fullName} />
              <Info label="Registry Email" value={report.reportedUser.email} />
              <Info label="Alias" value={report.reportedUser.username || "—"} />
              <Info label="Account Standing">
                <StatusBadge
                  type="status"
                  value={report.reportedUser.isActive ? "active" : "cancelled"}
                />
              </Info>
            </Section>
          )}

          {/* Admin Actions */}
          {isPending && (
            <Section title="Administrative Determination">
              <div className="py-2 flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 pl-1">
                    Determination Step
                  </Label>
                  <Select
                    value={status}
                    onValueChange={(val) =>
                      setStatus(val as "reviewed" | "resolved" | "dismissed")
                    }
                  >
                    <SelectTrigger className="w-full h-12 bg-[#020617]/40 border-white/10 text-white/90 rounded-xl font-semibold focus:ring-indigo-500/50 hover:bg-[#020617]/60 transition-all">
                      <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#020617] border border-white/10 text-white/90 rounded-xl shadow-2xl backdrop-blur-xl">
                      <SelectItem
                        value="reviewed"
                        className="font-semibold focus:bg-white/10 cursor-pointer"
                      >
                        Log as Reviewed
                      </SelectItem>
                      <SelectItem
                        value="resolved"
                        className="font-semibold focus:bg-emerald-500/20 focus:text-emerald-400 cursor-pointer"
                      >
                        Resolve & Close
                      </SelectItem>
                      <SelectItem
                        value="dismissed"
                        className="font-semibold focus:bg-rose-500/20 focus:text-rose-400 cursor-pointer"
                      >
                        Dismiss Report
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {report.reportedUser && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 transition-all hover:bg-rose-500/10 group/block">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        id="block-user"
                        checked={blockUser}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setBlockUser(e.target.checked)
                        }
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/10 bg-white/5 checked:bg-rose-600 checked:border-rose-500 transition-all"
                      />
                      <XCircle
                        className="absolute hidden peer-checked:block text-white pointer-events-none"
                        size={12}
                        strokeWidth={3}
                      />
                    </div>
                    <Label
                      htmlFor="block-user"
                      className="text-xs font-bold text-rose-200/60 group-hover/block:text-rose-200 cursor-pointer select-none flex-1 tracking-tight"
                    >
                      Authorize Permanent Suspension of Reported User
                    </Label>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 pl-1">
                    Audit Justification (Optional)
                  </Label>
                  <Textarea
                    placeholder="Enter professional audit notes..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="resize-none bg-[#020617]/40 border-white/10 rounded-xl focus:ring-indigo-500/50 text-white/90 placeholder:text-white/10 font-medium p-4 transition-all"
                  />
                </div>
              </div>
            </Section>
          )}
        </div>

        {isPending && (
          <DialogFooter className="p-8 border-t border-white/5 bg-white/[0.02] flex gap-3 flex-shrink-0">
            <Button
              variant="ghost"
              className="flex-1 h-12 text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-[2] h-12 bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all disabled:opacity-50"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Processing..." : "Commit Administrative Action"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* ---- Reusable Sub-components ---- */
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="border border-white/5 rounded-2xl p-6 bg-white/5 shadow-sm space-y-4">
    <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
      {title}
    </h3>
    <div className="divide-y divide-white/5">{children}</div>
  </div>
);

const Info: React.FC<{
  label: string;
  value?: string | number | null;
  highlight?: boolean;
  children?: React.ReactNode;
}> = ({ label, value, highlight, children }) => (
  <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start text-sm">
    <span className="font-bold text-white/30 text-[11px] uppercase tracking-wider pt-0.5">
      {label}:
    </span>
    <span
      className={`sm:col-span-2 break-words font-bold tracking-tight ${
        highlight ? "text-indigo-400 capitalize" : "text-white/80"
      }`}
    >
      {children || value}
    </span>
  </div>
);

/* ---- Status Chip (Internal Duplicate) ---- */
const ReportStatusChip = ({ status }: { status: string }) => {
  const map: Record<string, { cls: string; label: string }> = {
    pending: {
      cls: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      label: "Awaiting Review",
    },
    reviewed: {
      cls: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      label: "In Review",
    },
    resolved: {
      cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      label: "Resolved",
    },
    dismissed: {
      cls: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      label: "Dismissed",
    },
  };
  const config = map[status] || map["pending"];
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${config.cls}`}
    >
      {config.label}
    </span>
  );
};

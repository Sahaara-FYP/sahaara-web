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
  if (!report) return null;

  const [adminNotes, setAdminNotes] = useState(report.adminNotes || "");
  const [status, setStatus] = useState<"reviewed" | "resolved" | "dismissed">("reviewed");
  const [blockUser, setBlockUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

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
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const isPending = report.status === "pending" || report.status === "reviewed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-app-primary-color">
            Report Details
          </DialogTitle>
          <DialogDescription className="text-sm text-app-secondary-text">
            Review and take action on this report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Report Info */}
          <Section title="Report Information">
            <Info label="Entity Type" value={report.entityType} highlight />
            <Info label="Entity ID" value={report.entityId} />
            <Info label="Reason" value={report.reason.replace(/_/g, " ")} highlight />
            <Info label="Details" value={report.details || "No details provided"} />
            <Info label="Status">
              <StatusBadge
                type="default"
                value={report.status}
                className={
                  report.status === "resolved"
                    ? "bg-green-500/20 text-green-700 border border-green-500"
                    : report.status === "dismissed"
                    ? "bg-gray-500/20 text-gray-700 border border-gray-500"
                    : report.status === "reviewed"
                    ? "bg-blue-500/20 text-blue-700 border border-blue-500"
                    : "bg-yellow-400/20 text-yellow-700 border border-yellow-400"
                }
              />
            </Info>
            <Info label="Submitted" value={new Date(report.createdAt).toLocaleString()} />
            {report.resolvedAt && (
              <Info label="Resolved At" value={new Date(report.resolvedAt).toLocaleString()} />
            )}
            {report.adminNotes && (
              <Info label="Previous Admin Notes" value={report.adminNotes} />
            )}
          </Section>

          {/* Reporter */}
          <Section title="Reported By">
            <Info label="Name" value={report.reporter.fullName} />
            <Info label="Email" value={report.reporter.email} />
            <Info label="Username" value={report.reporter.username || "—"} />
          </Section>

          {/* Reported User */}
          {report.reportedUser && (
            <Section title="Reported User">
              <Info label="Name" value={report.reportedUser.fullName} />
              <Info label="Email" value={report.reportedUser.email} />
              <Info label="Username" value={report.reportedUser.username || "—"} />
              <Info label="Account Status">
                <StatusBadge
                  type="status"
                  value={report.reportedUser.isActive ? "active" : "cancelled"}
                />
              </Info>
            </Section>
          )}

          {/* Admin Actions */}
          {isPending && (
            <Section title="Admin Action">
              <div className="py-3 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-semibold text-app-secondary-text">
                    Update Status
                  </Label>
                  <Select
                    value={status}
                    onValueChange={(val) =>
                      setStatus(val as "reviewed" | "resolved" | "dismissed")
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[280px] bg-white">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reviewed">Mark as Reviewed</SelectItem>
                      <SelectItem value="resolved">Resolve</SelectItem>
                      <SelectItem value="dismissed">Dismiss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {report.reportedUser && (
                  <div className="flex items-center gap-3 p-3.5 rounded-lg bg-red-50/80 border border-red-100 transition-colors hover:bg-red-50">
                    <input
                      type="checkbox"
                      id="block-user"
                      checked={blockUser}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBlockUser(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer accent-red-600 bg-white"
                    />
                    <Label
                      htmlFor="block-user"
                      className="text-sm font-semibold text-red-700 cursor-pointer select-none flex-1"
                    >
                      Block & Deactivate Reported User
                    </Label>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-semibold text-app-secondary-text">
                    Admin Notes (Optional)
                  </Label>
                  <Textarea
                    placeholder="Add notes for this decision..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </Section>
          )}
        </div>

        {isPending && (
          <DialogFooter className="pt-2">
            <Button
              className="bg-app-primary-color hover:bg-app-primary-hover-color text-white"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Saving..." : "Submit Action"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* Reusable sub-components */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border border-app-background rounded-lg p-4">
    <h3 className="font-semibold text-app-primary-color mb-3">{title}</h3>
    <div className="divide-y divide-app-background">{children}</div>
  </div>
);

const Info = ({
  label,
  value,
  highlight,
  children,
}: {
  label: string;
  value?: string | number | null;
  highlight?: boolean;
  children?: React.ReactNode;
}) => (
  <div className="py-2 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-3 items-start text-sm">
    <span className="font-semibold text-app-secondary-text">{label}:</span>
    <span
      className={`sm:col-span-3 break-words ${
        highlight ? "font-medium text-app-primary-color capitalize" : ""
      }`}
    >
      {children || value}
    </span>
  </div>
);

import { StatusBadge } from "@/components/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import React from "react";
import { AttachmentsCarousel } from "./AttachmentsCarousel";
import type { AlertType } from "@/types/Alerts";

type AlertsDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: AlertType;
};

export const AlertDetailsDialog: React.FC<AlertsDetailsDialogProps> = ({
  open,
  onOpenChange,
  alert,
}) => {
  if (!alert) return null;

  const { poster } = alert;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl bg-[#020617] border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] text-white p-0 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white tracking-tight">
              {alert.title}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-white/50">
              Comprehensive details for this community alert.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-3 custom-scrollbar">
          {/* ===== Alert Information ===== */}
          <Section title="Alert Information">
            <Info
              label="Description"
              value={alert.description || "No description"}
            />
            <Info label="Category" value={alert.category} />
            <Info label="Urgency" value={alert.urgencyLevel} highlight />
            <Info label="Status">
              <StatusBadge type="status" value={alert.status} />
            </Info>
            <Info
              label="Location"
              value={`${alert.locationLat ?? "—"}, ${alert.locationLng ?? "—"}`}
            />
            <Info
              label="Acknowledgements"
              value={alert.acknowledgementsCount}
            />
            <Info label="Distance" value={alert.distance ?? "—"} />

            {alert.attachments?.length > 0 && (
              <Info label="Attachments">
                <AttachmentsCarousel attachments={alert.attachments} />
              </Info>
            )}
          </Section>

          {/* ===== Poster Details ===== */}
          {poster && (
            <Section title="Posted By">
              <Info label="Full Name" value={poster.fullName || "N/A"} />
              <Info label="Email" value={poster.email || "N/A"} />
              <Info label="Username" value={poster.username || "—"} />
              {poster.profilePictureUrl && (
                <Info label="Profile Picture">
                  <img
                    src={poster.profilePictureUrl}
                    alt="Poster"
                    className="h-20 w-20 rounded-xl object-cover border border-white/10 shadow-lg"
                  />
                </Info>
              )}
            </Section>
          )}

          {/* ===== System Info ===== */}
          <Section title="System Information">
            <Info label="Moderation">
              <StatusBadge type="moderation" value={alert.moderationStatus} />
            </Info>

            <Info
              label="Created At"
              value={new Date(alert.createdAt).toLocaleString()}
            />
            <Info
              label="Updated At"
              value={new Date(alert.updatedAt).toLocaleString()}
            />
            <Info
              label="Expiry Time"
              value={
                alert.expiryTime
                  ? new Date(alert.expiryTime).toLocaleString()
                  : "—"
              }
            />
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ===== Reusable Components ===== */
type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="border border-white/10 rounded-2xl p-5 bg-white/5 shadow-sm">
    <h3 className="font-bold text-white tracking-wide mb-4 text-[13px] uppercase opacity-70">
      {title}
    </h3>
    <div className="divide-y divide-white/5">{children}</div>
  </div>
);

type InfoProps = {
  label: string;
  value?: string | number | React.ReactNode | null;
  highlight?: boolean;
  children?: React.ReactNode;
};

const Info: React.FC<InfoProps> = ({
  label,
  value,
  highlight = false,
  children,
}) => (
  <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-3 items-start text-sm">
    <span className="font-medium text-white/40">{label}:</span>
    <span
      className={`sm:col-span-2 break-words font-semibold text-white/90 ${
        highlight ? "text-indigo-400 capitalize" : ""
      }`}
    >
      {children || value}
    </span>
  </div>
);

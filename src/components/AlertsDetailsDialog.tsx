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
      <DialogContent className="max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-app-primary-color">
            {alert.title}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-app-secondary-text">
            Detailed information about this alert.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 ">
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
              <Info label="User ID" value={poster.id} />
              {poster.profilePictureUrl && (
                <Info label="Profile Picture">
                  <img
                    src={poster.profilePictureUrl}
                    alt="Poster"
                    className="h-20 w-20 rounded-lg object-cover border"
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
  <div className="border border-app-background rounded-lg p-4">
    <h3 className="font-semibold text-app-primary-color mb-3">{title}</h3>
    <div className="divide-y divide-app-background">{children}</div>
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
  <div className="py-2 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-3 items-start text-sm sm:text-base">
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

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import type { OfferType_ } from "@/types/Offers";
import { StatusBadge } from "@/components/StatusBadge";
import { AttachmentsCarousel } from "./AttachmentsCarousel";

type OfferDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: OfferType_;
};

export const OfferDetailsDialog: React.FC<OfferDetailsDialogProps> = ({
  open,
  onOpenChange,
  offer,
}) => {
  if (!offer) return null;

  const { volunteer } = offer;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-app-primary-color">
            {offer.title}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-app-secondary-text">
            Detailed information about this offer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* ===== Offer Information ===== */}
          <Section title="Offer Information">
            <Info label="Description" value={offer.description || "No description"} />
            <Info label="Category" value={offer.category} />
            <Info label="Type" value={offer.type} highlight />
            <Info label="Status">
              <StatusBadge type="status" value={offer.status} />
            </Info>
            <Info label="Moderation">
              <StatusBadge type="moderation" value={offer.moderationStatus} />
            </Info>
            <Info
              label="Location"
              value={`${offer.locationLat ?? "—"}, ${offer.locationLng ?? "—"}`}
            />
            {offer.attachments && offer.attachments.length > 0 && (
              <Info label="Attachments">
                <AttachmentsCarousel attachments={offer.attachments} />
              </Info>
            )}
          </Section>

          {/* ===== Resource-specific Fields ===== */}
          {offer.type === "resource" && (
            <Section title="Resource Details">
              <Info label="Total Quantity" value={offer.totalQuantity ?? "—"} />
              <Info label="Remaining Quantity" value={offer.remainingQuantity ?? "—"} />
              <Info label="Unit" value={offer.unit || "—"} />
            </Section>
          )}

          {/* ===== Service-specific Fields ===== */}
          {offer.type === "service" && (
            <Section title="Service Details">
              <Info label="Availability" value={offer.availability || "—"} />
              <Info label="Experience" value={offer.experienceDesc || "—"} />
            </Section>
          )}

          {/* ===== Volunteer Details ===== */}
          {volunteer && (
            <Section title="Posted By">
              <Info label="Full Name" value={volunteer.fullName || "N/A"} />
              <Info label="Email" value={volunteer.email || "N/A"} />
              <Info label="Username" value={volunteer.username || "—"} />
              {volunteer.profilePictureUrl && (
                <Info label="Profile Picture">
                  <img
                    src={volunteer.profilePictureUrl}
                    alt="Volunteer"
                    className="h-20 w-20 rounded-lg object-cover border"
                  />
                </Info>
              )}
            </Section>
          )}

          {/* ===== System Info ===== */}
          <Section title="System Information">
            <Info label="Interactions" value={offer.interactionsCount ?? 0} />
            <Info
              label="Created At"
              value={offer.createdAt ? new Date(offer.createdAt).toLocaleString() : "N/A"}
            />
            <Info
              label="Updated At"
              value={offer.updatedAt ? new Date(offer.updatedAt).toLocaleString() : "N/A"}
            />
            <Info
              label="Expires At"
              value={offer.expiresAt ? new Date(offer.expiresAt).toLocaleString() : "—"}
            />
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ===== Reusable Sub-components ===== */
type SectionProps = { title: string; children: React.ReactNode };
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
const Info: React.FC<InfoProps> = ({ label, value, highlight = false, children }) => (
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

import { StatusBadge } from "@/components/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import type { RequestType } from "@/types/Requests";
import React from "react";
import { Button } from "@/components/ui/button";
import { AttachmentsCarousel } from "./AttachmentsCarousel";

type RequestDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: RequestType;
};

export const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({
  open,
  onOpenChange,
  request,
}) => {
  if (!request) return null;

  const { requester } = request;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-app-primary-color">
            {request.title}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-app-secondary-text">
            Detailed information about this request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 ">
          {/* ===== Request Information ===== */}
          <Section title="Request Information">
            <Info
              label="Description"
              value={request.description || "No description"}
            />
            <Info label="Category" value={request.category} />
            <Info label="Urgency" value={request.urgencyLevel} highlight />
            <Info label="Status">
              <StatusBadge type="status" value={request.status} />
            </Info>
            <Info
              label="Location"
              value={`${request.locationLat ?? "—"}, ${
                request.locationLng ?? "—"
              }`}
            />
            <Info label="Max Helpers" value={request.maxHelpers} />
            <Info label="Priority Score" value={request.priorityScore} />
            {request.attachments?.length ? (
              <Info label="Attachments">
                <AttachmentsCarousel attachments={request.attachments} />
              </Info>
            ) : null}
          </Section>

          {/* ===== Visibility & Privacy ===== */}
          <Section title="Visibility & Privacy">
            <Info
              label="Post Anonymously"
              value={request.postAnonymously ? "Yes" : "No"}
            />
            <Info
              label="Verified Users Only"
              value={request.visibilityVerifiedOnly ? "Yes" : "No"}
            />
            <Info
              label="Women Only"
              value={request.visibilityWomenOnly ? "Yes" : "No"}
            />
          </Section>

          {/* ===== Requester Details ===== */}
          {requester && (
            <Section title="Requester Information">
              <Info label="Full Name" value={requester.fullName || "N/A"} />
              <Info label="Email" value={requester.email || "N/A"} />
              <Info label="Username" value={requester.username || "—"} />
              <Info label="Requester ID" value={requester.id} />
              {requester.profilePictureUrl && (
                <Info label="Profile Picture">
                  <img
                    src={requester.profilePictureUrl}
                    alt="Requester"
                    className="h-20 w-20 rounded-lg object-cover border"
                  />
                </Info>
              )}
            </Section>
          )}

          {/* ===== System Info ===== */}
          <Section title="System Information">
            <Info label="Moderation">
              <StatusBadge type="moderation" value={request.moderationStatus} />
            </Info>
            <Info
              label="Created At"
              value={
                request.createdAt
                  ? new Date(request.createdAt).toLocaleString()
                  : "N/A"
              }
            />
            <Info
              label="Updated At"
              value={
                request.updatedAt
                  ? new Date(request.updatedAt).toLocaleString()
                  : "N/A"
              }
            />
            <Info
              label="Expires At"
              value={
                request.expiresAt
                  ? new Date(request.expiresAt).toLocaleString()
                  : "—"
              }
            />
            {request.completedAt && (
              <Info
                label="Completed At"
                value={new Date(request.completedAt).toLocaleString()}
              />
            )}
            <Info label="Participants Count">
              <div className="flex items-center justify-between">
                <span>{request.participantsCount}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log("View participants clicked")}
                >
                  View All
                </Button>
              </div>
            </Info>
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

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
import { EnlargeableImage } from "@/components/EnlargeableImage";

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
      <DialogContent className="max-h-[90vh] max-w-2xl bg-[#020617] border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] text-white p-0 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white tracking-tight">
              {request.title}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-white/50">
              Comprehensive details for this community request.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-3 custom-scrollbar">
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
                  <EnlargeableImage
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
            <Info label="Participants">
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-indigo-400">
                  {request.participantsCount}
                </span>
                <Button
                  variant="outline"
                  className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-indigo-300 h-9 text-xs font-bold"
                  size="sm"
                  onClick={() => console.log("View participants clicked")}
                >
                  View Details
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
  <div className="border border-white/10 rounded-2xl p-5 bg-white/5 shadow-sm">
    <h3 className="font-semibold text-white tracking-wide mb-4">{title}</h3>
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
      className={`sm:col-span-2 break-words font-medium text-white/90 ${
        highlight ? "text-indigo-400 capitalize" : ""
      }`}
    >
      {children || value}
    </span>
  </div>
);

import { StatusBadge } from "@/components/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import type { RequestType } from "@/types/Requests";

type RequestDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: RequestType;
};

export const RequestDetailsDialog = ({
  open,
  onOpenChange,
  request,
}: RequestDetailsDialogProps) => {
  if (!request) return null;

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

        <div className="divide-y divide-app-background border-t border-app-background mt-1">
          {[
            ["Description", request.description || "No description"],
            ["Category", request.category],
            [
              "Urgency",
              <span
                key="urgency"
                className="font-medium text-app-primary-color capitalize"
              >
                {request.urgencyLevel}
              </span>,
            ],
            ["Status", <StatusBadge type="status" value={request.status} />],
            [
              "Location",
              `${request.locationLat ?? "—"}, ${request.locationLng ?? "—"}`,
            ],
            ["Anonymous", request.postAnonymously ? "Yes" : "No"],
            ["Verified Only", request.visibilityVerifiedOnly ? "Yes" : "No"],
            ["Women Only", request.visibilityWomenOnly ? "Yes" : "No"],
            ["Priority Score", request.priorityScore],
            ["Max Helpers", request.maxHelpers],
            [
              "Moderation",
              <StatusBadge
                type="moderation"
                value={request.moderationStatus}
              />,
            ],
            [
              "Created",
              request.createdAt
                ? new Date(request.createdAt).toLocaleString()
                : "N/A",
            ],
            [
              "Expires",
              request.expiresAt
                ? new Date(request.expiresAt).toLocaleString()
                : "—",
            ],
            request.completedAt && [
              "Completed",
              new Date(request.completedAt).toLocaleString(),
            ],
          ]
            .filter(Boolean)
            .map(([label, value], index) => (
              <div
                key={index}
                className="
                  py-2 sm:py-2.5
                  grid grid-cols-1 sm:grid-cols-3
                  gap-1.5 sm:gap-3
                  items-start
                  text-sm sm:text-base
                "
              >
                <span className="font-semibold text-app-secondary-text">
                  {label}:
                </span>
                <span className="sm:col-span-2 text-app-primary-text break-words">
                  {value}
                </span>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

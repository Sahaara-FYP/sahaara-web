import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RequestType } from "@/types/Requests";

interface DetailedRequestProps {
  viewDetailsToggle: boolean;
  setViewDetailsToggle: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRequest: RequestType | null;
}

const DetailedRequest = ({
  viewDetailsToggle,
  setViewDetailsToggle,
  selectedRequest,
}: DetailedRequestProps) => {
  return (
    <Dialog open={viewDetailsToggle} onOpenChange={setViewDetailsToggle}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
          <DialogDescription>
            Detailed view of the selected help request.
          </DialogDescription>
        </DialogHeader>

        {selectedRequest ? (
          <div className="space-y-6 mt-4 text-sm">
            {/* Requester Info */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-muted-foreground">
                Requester Info
              </h3>
              <dl className="grid grid-cols-2 gap-2">
                <dt className="font-medium">Full Name</dt>
                <dd className="capitalize">
                  {selectedRequest.users?.full_name || "-"}
                </dd>

                <dt className="font-medium">Email</dt>
                <dd>{selectedRequest.users?.email || "-"}</dd>

                <dt className="font-medium">Gender</dt>
                <dd className="capitalize">
                  {selectedRequest.users?.gender || "-"}
                </dd>

                <dt className="font-medium">Verified</dt>
                <dd className="capitalize">
                  {selectedRequest.users?.is_verified ? "Yes" : "No"}
                </dd>
              </dl>
            </div>

            {/* Request Info */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-muted-foreground">
                Request Info
              </h3>
              <dl className="grid grid-cols-2 gap-2">
                <dt className="font-medium">Text</dt>
                <dd className="capitalize">{selectedRequest.request_text}</dd>

                <dt className="font-medium">Category</dt>
                <dd className="capitalize">{selectedRequest.category}</dd>

                <dt className="font-medium">Status</dt>
                <dd className="capitalize">{selectedRequest.status}</dd>

                <dt className="font-medium">Urgent</dt>
                <dd className="capitalize">
                  {selectedRequest.is_urgent ? "Yes" : "No"}
                </dd>

                <dt className="font-medium">Willing to Pay</dt>
                <dd className="capitalize">
                  {selectedRequest.willing_to_pay ? "Yes" : "No"}
                </dd>

                <dt className="font-medium">Reveal Identity</dt>
                <dd className="capitalize">
                  {selectedRequest.reveal_identity ? "Yes" : "No"}
                </dd>

                <dt className="font-medium">Female Only</dt>
                <dd className="capitalize">
                  {selectedRequest.female_only ? "Yes" : "No"}
                </dd>
              </dl>
            </div>

            {/* Metadata */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-muted-foreground">
                Metadata
              </h3>
              <dl className="grid grid-cols-2 gap-2">
                <dt className="font-medium">Latitude</dt>
                <dd className="capitalize">{selectedRequest.latitude}</dd>

                <dt className="font-medium">Longitude</dt>
                <dd className="capitalize">{selectedRequest.longitude}</dd>

                <dt className="font-medium">Created At</dt>
                <dd className="capitalize">
                  {new Date(selectedRequest.created_at).toLocaleString()}
                </dd>

                <dt className="font-medium">Fulfilled At</dt>
                <dd className="capitalize">
                  {selectedRequest.fulfilled_at
                    ? new Date(selectedRequest.fulfilled_at).toLocaleString()
                    : "-"}
                </dd>
              </dl>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No request selected.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetailedRequest;

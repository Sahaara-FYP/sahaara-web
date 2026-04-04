import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import type { VerificationType } from "@/types/Verifications";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

type VerificationDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verification: VerificationType;
};

export const VerificationDetailsDialog: React.FC<VerificationDetailsDialogProps> = ({
  open,
  onOpenChange,
  verification,
}) => {
  if (!verification) return null;

  const [adminNotes, setAdminNotes] = useState(verification.adminNotes || "");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const kycImages = [
    { src: verification.cnicFrontUrl, label: "CNIC Front" },
    { src: verification.cnicBackUrl, label: "CNIC Back" },
    { src: verification.selfieWithCnicUrl, label: "Selfie with CNIC" },
  ];

  const handleAction = async (status: "verified" | "rejected" | "pending") => {
    try {
      setLoadingAction(status);
      await api.patch(`/users/admin/verifications/${verification.id}/status`, {
        status,
        adminNotes,
      });
      toast.success(`Verification ${status} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["verifications"] });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Action failed");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setLoadingAction("save_notes");
      await api.patch(`/users/admin/verifications/${verification.id}/status`, {
        status: verification.status,
        adminNotes,
      });
      toast.success("Notes updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["verifications"] });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update notes");
    } finally {
      setLoadingAction(null);
    }
  }

  const { user } = verification;
  const isLoading = loadingAction !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-app-primary-color">
            KYC Verification
          </DialogTitle>
          <DialogDescription className="text-sm text-app-secondary-text">
            Review submitted documents and take action.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <Section title="User Information">
            <div className="flex items-center gap-4 py-2">
              {user.profilePictureUrl && (
                <img
                  src={user.profilePictureUrl}
                  alt="User"
                  className="h-16 w-16 rounded-full object-cover border"
                />
              )}
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-app-primary-text">{user.fullName}</p>
                <p className="text-sm text-app-secondary-text">{user.email}</p>
                {user.username && (
                  <p className="text-sm text-app-secondary-text">@{user.username}</p>
                )}
              </div>
            </div>
            <Info label="Phone" value={user.phoneNumber || "—"} />
            <Info label="CNIC Number" value={user.cnicNumber || "—"} />
            <Info label="Gender" value={user.gender || "—"} />
            <Info label="Date of Birth" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "—"} />
            <Info label="Account Status">
              <StatusBadge type="status" value={user.isActive ? "active" : "cancelled"} />
            </Info>
          </Section>

          {/* Verification Status */}
          <Section title="Verification Status">
            <Info label="Status">
              <StatusBadge
                type="default"
                value={verification.status}
                className={
                  verification.status === "verified"
                    ? "bg-green-500/20 text-green-700 border border-green-500"
                    : verification.status === "rejected"
                    ? "bg-red-500/20 text-red-700 border border-red-500"
                    : "bg-yellow-400/20 text-yellow-700 border border-yellow-400"
                }
              />
            </Info>
            <Info label="Submitted" value={new Date(verification.createdAt).toLocaleString()} />
            {verification.verifiedAt && (
              <Info label="Verified At" value={new Date(verification.verifiedAt).toLocaleString()} />
            )}
            {verification.adminNotes && (
              <Info label="Previous Notes" value={verification.adminNotes} />
            )}
          </Section>

          {/* KYC Documents */}
          <Section title="KYC Documents">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-2">
              {kycImages.map((img, idx) => (
                <KYCImage
                  key={idx}
                  src={img.src}
                  label={img.label}
                  onClick={() => setActiveImageIndex(idx)}
                />
              ))}
            </div>
          </Section>

          {/* Admin Notes */}
          <div className="grid gap-2">
            <Label className="font-semibold text-app-secondary-text">
              Admin Notes ({verification.status === "pending" ? "Optional" : "Update"})
            </Label>
            <Textarea
              placeholder="Add notes for this verification decision..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-2 border-t mt-4">
          {verification.status !== "pending" && (
            <Button
              variant="ghost"
              className="text-app-secondary-text mr-auto hover:bg-gray-100"
              disabled={isLoading}
              onClick={() => handleAction("pending")}
            >
              {loadingAction === "pending" ? "Resetting..." : "Reset to Pending"}
            </Button>
          )}

          {verification.status !== "rejected" && (
            <Button
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
              disabled={isLoading}
              onClick={() => handleAction("rejected")}
            >
              {loadingAction === "rejected" ? "Rejecting..." : "Reject"}
            </Button>
          )}

          {verification.status !== "verified" && (
            <Button
              className="bg-app-primary-color hover:bg-app-primary-hover-color text-white"
              disabled={isLoading}
              onClick={() => handleAction("verified")}
            >
              {loadingAction === "verified" ? "Verifying..." : "Verify User"}
            </Button>
          )}

          {verification.status !== "pending" && adminNotes !== (verification.adminNotes || "") && (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
              onClick={handleSaveNotes}
            >
              {loadingAction === "save_notes" ? "Saving..." : "Save Notes Only"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>

      {/* Full-screen Carousel Overlay (Nested Dialog) */}
      <Dialog 
        open={activeImageIndex !== null} 
        onOpenChange={(isOpen) => {
          if (!isOpen) setActiveImageIndex(null);
        }}
      >
        <DialogContent 
          showCloseButton={false}
          className="max-w-none w-screen h-screen border-none bg-black/95 shadow-none p-0 m-0 flex flex-col items-center justify-center z-[200] sm:max-w-none rounded-none"
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-[201]"
            onClick={() => setActiveImageIndex(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {activeImageIndex !== null && activeImageIndex > 0 && (
            <button
              className="absolute left-4 text-white hover:text-gray-300 p-4 z-[201]"
              onClick={() => setActiveImageIndex(prev => prev! - 1)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {activeImageIndex !== null && (
            <div className="flex flex-col items-center max-w-[90vw] max-h-[90vh]">
              <p className="text-white text-lg font-semibold mb-4 bg-black/50 px-4 py-2 rounded-full">
                {kycImages[activeImageIndex].label}
              </p>
              <img
                src={kycImages[activeImageIndex].src}
                alt={kycImages[activeImageIndex].label}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-gray-700"
              />
              <p className="text-gray-400 text-sm mt-4">
                {activeImageIndex + 1} / {kycImages.length}
              </p>
            </div>
          )}

          {activeImageIndex !== null && activeImageIndex < kycImages.length - 1 && (
            <button
              className="absolute right-4 text-white hover:text-gray-300 p-4 z-[201]"
              onClick={() => setActiveImageIndex(prev => prev! + 1)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

/* KYC Image component */
const KYCImage = ({ src, label, onClick }: { src: string; label: string, onClick: () => void }) => (
  <div className="flex flex-col items-center gap-1">
    <p className="text-xs font-semibold text-app-secondary-text">{label}</p>
    <div onClick={onClick} className="w-full cursor-pointer relative group">
      <img
        src={src}
        alt={label}
        className="h-28 w-full object-cover rounded-lg border transition duration-200 group-hover:opacity-75"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
        <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">View</span>
      </div>
    </div>
  </div>
);

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
  children,
}: {
  label: string;
  value?: string | number | null;
  children?: React.ReactNode;
}) => (
  <div className="py-2 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-3 items-start text-sm">
    <span className="font-semibold text-app-secondary-text">{label}:</span>
    <span className="sm:col-span-3 break-words">{children || value}</span>
  </div>
);

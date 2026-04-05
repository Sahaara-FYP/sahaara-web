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

export const VerificationDetailsDialog: React.FC<
  VerificationDetailsDialogProps
> = ({ open, onOpenChange, verification }) => {
  const [adminNotes, setAdminNotes] = useState(verification?.adminNotes || "");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const queryClient = useQueryClient();

  if (!verification) return null;

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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Action failed";
      toast.error(errorMessage);
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
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update notes";
      toast.error(errorMessage);
    } finally {
      setLoadingAction(null);
    }
  };

  const { user } = verification;
  const isLoading = loadingAction !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl bg-[#020617] border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] text-white p-0 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white tracking-tight">
              Verification Review
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-white/40">
              Audit submitted documentation and determine account validity.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* User Info */}
          <Section title="Identity Profile">
            <div className="flex items-center gap-6 py-4">
              {user.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt="User"
                  className="h-20 w-20 rounded-2xl object-cover border border-white/10 shadow-2xl ring-4 ring-white/5"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-[#020617] border border-white/10 flex items-center justify-center text-xl font-black text-white/20 shadow-inner">
                  {user.fullName?.[0] || "?"}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <p className="text-lg font-bold text-white tracking-tight leading-none">
                  {user.fullName}
                </p>
                <p className="text-sm font-bold text-white/40">{user.email}</p>
                {user.username && (
                  <p className="text-xs font-black uppercase tracking-widest text-indigo-400">
                    @{user.username}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8">
              <Info label="Phone" value={user.phoneNumber || "—"} />
              <Info label="Identification" value={user.cnicNumber || "—"} />
              <Info label="Gender" value={user.gender || "—"} />
              <Info
                label="Birth Date"
                value={
                  user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString()
                    : "—"
                }
              />
            </div>
            <Info label="Account">
              <StatusBadge
                type="status"
                value={user.isActive ? "active" : "cancelled"}
              />
            </Info>
          </Section>

          {/* Verification Status */}
          <Section title="Submission Audit">
            <Info label="Status">
              <StatusBadge
                type="default"
                value={verification.status}
                className={
                  verification.status === "verified"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : verification.status === "rejected"
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }
              />
            </Info>
            <Info
              label="Submitted"
              value={new Date(verification.createdAt).toLocaleString()}
            />
            {verification.verifiedAt && (
              <Info
                label="Reviewed"
                value={new Date(verification.verifiedAt).toLocaleString()}
              />
            )}
            {verification.adminNotes && (
              <Info label="History" value={verification.adminNotes} />
            )}
          </Section>

          {/* KYC Documents */}
          <Section title="Document Gallery">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4">
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
          <div className="grid gap-3 pt-4">
            <Label className="text-[11px] font-black uppercase tracking-widest text-white/30">
              Internal Admin Notes (
              {verification.status === "pending" ? "Optional" : "Audit Update"})
            </Label>
            <Textarea
              placeholder="Record findings or reasons for the decision..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              className="bg-[#020617]/50 border-white/10 focus:border-indigo-500/50 rounded-2xl resize-none font-medium placeholder:text-white/10"
            />
          </div>
        </div>

        <DialogFooter className="p-8 border-t border-white/5 bg-white/[0.02] flex gap-3 flex-shrink-0">
          {verification.status !== "pending" && (
            <Button
              variant="ghost"
              className="text-white/40 mr-auto hover:bg-white/5 hover:text-white rounded-xl h-12 px-6 font-bold"
              disabled={isLoading}
              onClick={() => handleAction("pending")}
            >
              {loadingAction === "pending" ? "Resetting..." : "Reset Queue"}
            </Button>
          )}

          {verification.status !== "rejected" && (
            <Button
              variant="outline"
              className="border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl h-12 px-8 font-black uppercase tracking-wider transition-all disabled:opacity-50"
              disabled={isLoading}
              onClick={() => handleAction("rejected")}
            >
              {loadingAction === "rejected" ? "Rejecting..." : "Reject"}
            </Button>
          )}

          {verification.status !== "verified" && (
            <Button
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-12 px-10 font-black uppercase tracking-wider shadow-lg shadow-indigo-500/20 transition-all disabled:scale-95"
              disabled={isLoading}
              onClick={() => handleAction("verified")}
            >
              {loadingAction === "verified" ? "Verifying..." : "Approve User"}
            </Button>
          )}

          {verification.status !== "pending" &&
            adminNotes !== (verification.adminNotes || "") && (
              <Button
                className="bg-white/10 hover:bg-white/20 text-white rounded-xl h-12 px-8 font-bold border border-white/10"
                disabled={isLoading}
                onClick={handleSaveNotes}
              >
                {loadingAction === "save_notes" ? "Saving..." : "Save Notes"}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {activeImageIndex !== null && activeImageIndex > 0 && (
            <button
              className="absolute left-4 text-white hover:text-gray-300 p-4 z-[201]"
              onClick={() => setActiveImageIndex((prev) => prev! - 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
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

          {activeImageIndex !== null &&
            activeImageIndex < kycImages.length - 1 && (
              <button
                className="absolute right-4 text-white hover:text-gray-300 p-4 z-[201]"
                onClick={() => setActiveImageIndex((prev) => prev! + 1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

/* KYC Image component */
const KYCImage = ({
  src,
  label,
  onClick,
}: {
  src: string;
  label: string;
  onClick: () => void;
}) => (
  <div className="flex flex-col items-center gap-3">
    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
      {label}
    </p>
    <div onClick={onClick} className="w-full cursor-pointer relative group">
      <img
        src={src}
        alt={label}
        className="h-32 w-full object-cover rounded-2xl border border-white/10 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-indigo-500 shadow-lg"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl backdrop-blur-[2px]">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-indigo-600 px-4 py-2 rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform">
          Enlarge
        </span>
      </div>
    </div>
  </div>
);

/* Reusable sub-components */
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.03] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.5)]">
    <h3 className="font-black text-white/30 mb-6 text-[11px] uppercase tracking-[0.2em]">
      {title}
    </h3>
    <div className="divide-y divide-white/5 space-y-4">{children}</div>
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
  <div className="py-2 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-4 items-start text-sm">
    <span className="font-medium text-white/40">{label}:</span>
    <span className="sm:col-span-2 break-words font-bold text-white/90">
      {children || value}
    </span>
  </div>
);

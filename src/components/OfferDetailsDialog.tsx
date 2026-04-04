import React, { useState } from "react";
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
import { EnlargeableImage } from "@/components/EnlargeableImage";
import { useAuthContext } from "@/contexts/AuthContext";
import { useFetchOfferById } from "@/hooks/useFetchOffers";
import { ChevronDown, ChevronUp, Loader2, MessageSquare, User } from "lucide-react";

type OfferDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: OfferType_;
};

export const OfferDetailsDialog: React.FC<OfferDetailsDialogProps> = ({
  open,
  onOpenChange,
  offer: initialOffer,
}) => {
  const [isInteractionsOpen, setIsInteractionsOpen] = useState(false);
  const { adminDetails } = useAuthContext();
  const isAdmin = adminDetails?.role === "admin";

  const { data: fullOffer, isLoading: isLoadingDetails } = useFetchOfferById(
    open && isAdmin ? initialOffer.id : undefined
  );

  if (!initialOffer) return null;

  const offer = fullOffer || initialOffer;
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
                  <EnlargeableImage
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
            <Info label="Interactions" value={offer.interactions?.length ?? offer.interactionsCount ?? 0} />
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

          {/* ===== Admin: Offer Interactions ===== */}
          {isAdmin && (
            <div className="border border-app-background rounded-lg overflow-hidden bg-app-background/5">
              <button
                onClick={() => setIsInteractionsOpen(!isInteractionsOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-app-background/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-app-primary-color" />
                  <h3 className="font-semibold text-app-primary-color">
                    User Interactions ({offer.interactions?.length ?? offer.interactionsCount ?? 0})
                  </h3>
                </div>
                {isInteractionsOpen ? (
                  <ChevronUp size={20} className="text-app-secondary-text" />
                ) : (
                  <ChevronDown size={20} className="text-app-secondary-text" />
                )}
              </button>

              {isInteractionsOpen && (
                <div className="p-4 pt-0 space-y-4 max-h-[400px] overflow-y-auto divide-y divide-app-background/20">
                  {isLoadingDetails ? (
                    <div className="flex flex-col items-center justify-center py-8 text-app-secondary-text">
                      <Loader2 className="h-8 w-8 animate-spin mb-2" />
                      <p className="text-sm">Fetching interaction history...</p>
                    </div>
                  ) : offer.interactions && offer.interactions.length > 0 ? (
                    offer.interactions.map((interaction) => (
                      <div key={interaction.id} className="py-4 first:pt-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {interaction.user.profilePictureUrl ? (
                              <EnlargeableImage
                                src={interaction.user.profilePictureUrl}
                                alt={interaction.user.fullName}
                                className="h-10 w-10 rounded-full object-cover border bg-app-background"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-app-background border flex items-center justify-center text-gray-400 flex-shrink-0">
                                <User size={20} />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-app-primary-text text-sm">
                                {interaction.user.fullName}
                              </p>
                              <p className="text-xs text-app-secondary-text">
                                {interaction.user.email}
                              </p>
                              <p className="text-[10px] text-app-secondary-text/70 mt-0.5">
                                @{interaction.user.username || "no-username"}
                              </p>
                            </div>
                          </div>
                          <StatusBadge type="status" value={interaction.status} className="text-[10px] min-w-0" />
                        </div>

                        <div className="mt-3 bg-white/50 p-3 rounded-md border border-app-background/10 shadow-sm">
                          {offer.type === "resource" ? (
                            <div className="flex items-center gap-2 text-sm text-app-primary-text">
                              <span className="font-semibold">Requested:</span>
                              <span className="bg-app-primary-color/10 text-app-primary-color px-2 py-0.5 rounded text-xs font-mono">
                                {interaction.requestedQuantity} {offer.unit}
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-app-secondary-text uppercase tracking-wider">
                                Inquiry Message:
                              </p>
                              <p className="text-sm text-app-primary-text italic leading-relaxed">
                                "{interaction.message || "No message provided."}"
                              </p>
                            </div>
                          )}
                          <div className="mt-2 flex items-center gap-1 text-[10px] text-app-secondary-text/80 justify-end">
                            <span>Interacted at:</span>
                            <span>{new Date(interaction.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-app-secondary-text bg-white/30 rounded-lg">
                      <User size={32} className="opacity-20 mb-2" />
                      <p className="text-sm italic">No users have interacted with this offer yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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

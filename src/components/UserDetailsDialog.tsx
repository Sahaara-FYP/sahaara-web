import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import type { AdminUserType } from "@/types/AdminUsers";
import { Button } from "./ui/button";
import { toast } from "sonner";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "./ui/label";
import { UserIcon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EnlargeableImage } from "./EnlargeableImage";

type UserDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUserType;
};

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  open,
  onOpenChange,
  user,
}) => {
  if (!user) return null;

  const [isActive, setIsActive] = useState(user.isActive);
  const [isVerified, setIsVerified] = useState(user.isVerified);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.patch(`/users/admin/users/${user.id}`, {
        isActive,
        isVerified,
      });
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      queryClient.invalidateQueries({ queryKey: ["verifications"] });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = 
    isActive !== user.isActive || 
    isVerified !== user.isVerified;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-app-primary-color flex items-center gap-2">
            User Details
            {user.role === 'admin' && (
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full border border-amber-200">
                Admin
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="text-sm text-app-secondary-text">
            Review user information and manage account permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Profile Overview */}
          <Section title="Profile Overview">
            <div className="flex items-center gap-4 py-2 mb-4">
              {user.profilePictureUrl ? (
                <EnlargeableImage
                  src={user.profilePictureUrl}
                  alt={user.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-app-background text-gray-400 flex items-center justify-center border-2">
                  <UserIcon size={32} />
                </div>
              )}
              <div>
                <h4 className="text-lg font-bold text-app-primary-text">{user.fullName}</h4>
                <p className="text-sm text-app-secondary-text">@{user.username || "—"}</p>
                {user.bio && <p className="text-sm text-gray-600 mt-1 italic">"{user.bio}"</p>}
              </div>
            </div>

            <Info label="User ID" value={user.id} />
            <Info label="Email" value={user.email} />
            <Info label="Phone" value={user.phoneNumber || "Not provided"} />
            <Info label="Gender" value={user.gender || "—"} capitalize />
            <Info label="Joined" value={new Date(user.createdAt).toLocaleString()} />
          </Section>

          {user.role === 'admin' ? (
            <Section title="Administrative Information">
              <div className="space-y-1">
                <Info label="System Privilege" value="Full Read & Write Access" />
                <Info label="Managed Entity" value="Sahaara Platform Core" />
                <Info label="Account Type" value="System Administrator" />
                <Info label="Security Clearance" value="Maximum Level" />
              </div>
            </Section>
          ) : (
            <>
              {/* Activity Metrics */}
              <Section title="Platform Activity">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-2">
                  <MetricItem label="Requests" value={user._count.requests} />
                  <MetricItem label="Offers" value={user._count.offers} />
                  <MetricItem label="Alerts" value={user._count.alerts} />
                  <MetricItem label="Reports Made" value={user._count.reportsMade} />
                  <MetricItem label="Reports Received" value={user._count.reportsReceived} alert={user._count.reportsReceived > 0} />
                </div>
              </Section>

              {/* Admin Action */}
              <Section title="Admin Controls">
                <div className="py-3 flex flex-col gap-6">

                  {/* Verification Toggle */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/40 border border-blue-100 transition-colors relative">
                    <input
                      type="checkbox"
                      id="verify-user"
                      checked={isVerified}
                      onChange={(e) => setIsVerified(e.target.checked)}
                      disabled={!user.verifications?.length}
                      className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="flex-1">
                      <Label htmlFor="verify-user" className="text-sm font-semibold text-app-primary-text cursor-pointer select-none block">
                        Verify User (KYC Approval)
                      </Label>
                      <span className="text-xs text-app-secondary-text mt-1 block">
                        Allows the user to interact with verified-only requests.
                      </span>
                      
                      {!user.verifications?.length && (
                        <span className="text-xs font-medium text-red-500 mt-2 block bg-red-50 p-2 rounded border border-red-100">
                          Disabled because the user has not submitted a verification request.
                        </span>
                      )}
                      
                      {(user.verifications?.length ?? 0) > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate("/admin/verifications", { state: { targetUserId: user.id } })}
                          className="mt-3 text-xs border-blue-200 text-blue-700 bg-white hover:bg-blue-50 hover:text-blue-800 h-8"
                        >
                          Review Verification Request Details
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Account Status Toggle (Deactivate) */}
                  <div className={`flex items-center gap-3 p-3.5 rounded-lg border transition-colors ${!isActive ? 'bg-red-50/80 border-red-200' : 'bg-gray-50/50 border-gray-200'}`}>
                    <input
                      type="checkbox"
                      id="active-user"
                      checked={!isActive}
                      onChange={(e) => setIsActive(!e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer accent-red-600 bg-white"
                    />
                    <div className="flex-1">
                      <Label htmlFor="active-user" className={`text-sm font-semibold cursor-pointer select-none block ${!isActive ? 'text-red-700' : 'text-app-primary-text'}`}>
                        Deactivate Account
                      </Label>
                      <span className="text-xs text-gray-500 mt-0.5 block">
                        Suspends the user's ability to login and hides their content.
                      </span>
                    </div>
                  </div>

                </div>
              </Section>
            </>
          )}
        </div>

        <DialogFooter className="pt-2">
          {user.role !== 'admin' && (
            <Button
              className="bg-app-primary-color hover:bg-app-primary-hover-color text-white gap-2"
              disabled={loading || !hasChanges}
              onClick={handleSubmit}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* Reusable sub-components */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border border-app-background rounded-lg p-4 bg-white">
    <h3 className="font-semibold text-app-primary-color mb-3">{title}</h3>
    <div className="divide-y divide-app-background">{children}</div>
  </div>
);

const Info = ({
  label,
  value,
  capitalize,
}: {
  label: string;
  value?: string | number | null;
  capitalize?: boolean;
}) => (
  <div className="py-2 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-3 items-start text-sm">
    <span className="font-semibold text-app-secondary-text">{label}:</span>
    <span className={`sm:col-span-2 break-words text-app-primary-text ${capitalize ? "capitalize" : ""}`}>
      {value}
    </span>
  </div>
);

const MetricItem = ({ label, value, alert }: { label: string; value: number; alert?: boolean }) => (
  <div className={`flex flex-col items-center justify-center p-3 rounded-lg border ${alert ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
    <span className={`text-2xl font-bold ${alert ? 'text-red-600' : 'text-app-primary-color'}`}>
      {value}
    </span>
    <span className="text-xs font-semibold text-gray-500 mt-1 text-center">
      {label}
    </span>
  </div>
);

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
  const [isActive, setIsActive] = useState(user?.isActive);
  const [isVerified, setIsVerified] = useState(user?.isVerified);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  if (!user) return null;

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
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update user";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges =
    isActive !== user.isActive || isVerified !== user.isVerified;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl bg-[#020617] border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
            User Details
            {user.role === "admin" && (
              <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Admin
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-white/50">
            Review user information and manage account permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Profile Overview */}
          <Section title="Profile Overview">
            <div className="flex items-center gap-5 py-2 mb-4">
              {user.profilePictureUrl ? (
                <EnlargeableImage
                  src={user.profilePictureUrl}
                  alt={user.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/10 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/5 text-white/30 flex items-center justify-center border border-white/10">
                  <UserIcon size={30} strokeWidth={1.5} />
                </div>
              )}
              <div>
                <h4 className="text-xl font-bold text-white tracking-tight">
                  {user.fullName}
                </h4>
                <p className="text-sm text-white/50 font-medium">
                  @{user.username || "anonymous"}
                </p>
                {user.bio && (
                  <p className="text-[13px] text-white/40 mt-1 italic">
                    "{user.bio}"
                  </p>
                )}
              </div>
            </div>

            <Info label="User ID" value={user.id} />
            <Info label="Email" value={user.email} />
            <Info label="Phone" value={user.phoneNumber || "Not provided"} />
            <Info label="Gender" value={user.gender || "—"} capitalize />
            <Info
              label="Joined"
              value={new Date(user.createdAt).toLocaleString()}
            />
          </Section>

          {user.role === "admin" ? (
            <Section title="Admin Account Details">
              <div className="space-y-1">
                <Info label="Access Level" value="Full Administrative Access" />
                <Info label="Account Type" value="System Administrator" />
                <Info label="System Role" value="Super Admin" />
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
                  <MetricItem
                    label="Reports Made"
                    value={user._count.reportsMade}
                  />
                  <MetricItem
                    label="Reports Received"
                    value={user._count.reportsReceived}
                    alert={user._count.reportsReceived > 0}
                  />
                </div>
              </Section>

              {/* Admin Action */}
              <Section title="Admin Controls">
                <div className="py-3 flex flex-col gap-6">
                  {/* Verification Toggle */}
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 transition-colors relative">
                    <input
                      type="checkbox"
                      id="verify-user"
                      checked={isVerified}
                      onChange={(e) => setIsVerified(e.target.checked)}
                      disabled={!user.verifications?.length}
                      className="w-5 h-5 mt-0.5 rounded border-white/20 text-indigo-500 focus:ring-indigo-500/50 cursor-pointer accent-indigo-500 bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="verify-user"
                        className="text-sm font-semibold text-white cursor-pointer select-none block"
                      >
                        Verify User
                      </Label>
                      <span className="text-[13px] text-white/50 font-medium mt-1 block">
                        Mark this user as verified to enable specific platform
                        privileges.
                      </span>

                      {!user.verifications?.length && (
                        <span className="text-xs font-medium text-amber-400 mt-3 block bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 leading-relaxed">
                          Action locked: The user has not submitted a
                          verification request.
                        </span>
                      )}

                      {(user.verifications?.length ?? 0) > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate("/admin/verifications", {
                              state: { targetUserId: user.id },
                            })
                          }
                          className="mt-4 text-xs font-semibold tracking-wide border-indigo-500/30 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-indigo-300 h-9"
                        >
                          Review Verification Documents
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Account Status Toggle (Deactivate) */}
                  <div
                    className={`flex items-center gap-4 p-5 rounded-2xl border transition-colors ${!isActive ? "bg-rose-500/10 border-rose-500/30" : "bg-white/5 border-white/10"}`}
                  >
                    <input
                      type="checkbox"
                      id="active-user"
                      checked={!isActive}
                      onChange={(e) => setIsActive(!e.target.checked)}
                      className="w-5 h-5 rounded border-white/20 text-rose-500 focus:ring-rose-500/50 cursor-pointer accent-rose-500 bg-white/5"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="active-user"
                        className={`text-sm font-semibold cursor-pointer select-none block ${!isActive ? "text-rose-400" : "text-white"}`}
                      >
                        Deactivate Account
                      </Label>
                      <span
                        className={`text-[13px] font-medium mt-1 block ${!isActive ? "text-rose-400/70" : "text-white/50"}`}
                      >
                        Suspends the user's ability to login and hides their
                        content.
                      </span>
                    </div>
                  </div>
                </div>
              </Section>
            </>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-white/5 mt-2">
          {user.role !== "admin" && (
            <Button
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl h-11 px-8 shadow-lg shadow-indigo-500/20 transition-all gap-2"
              disabled={loading || !hasChanges}
              onClick={handleSubmit}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Processing..." : "Save Changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border border-white/10 rounded-2xl p-5 bg-white/5 shadow-sm">
    <h3 className="font-semibold text-white tracking-wide mb-4">{title}</h3>
    <div className="divide-y divide-white/5">{children}</div>
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
  <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-3 items-start text-sm">
    <span className="font-medium text-white/40">{label}:</span>
    <span
      className={`sm:col-span-2 break-words font-medium text-white/90 ${capitalize ? "capitalize" : ""}`}
    >
      {value}
    </span>
  </div>
);

const MetricItem = ({
  label,
  value,
  alert,
}: {
  label: string;
  value: number;
  alert?: boolean;
}) => (
  <div
    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-colors ${alert ? "bg-rose-500/10 border-rose-500/20" : "bg-white/5 border-white/10"}`}
  >
    <span
      className={`text-2xl font-bold ${alert ? "text-rose-400" : "text-indigo-400"}`}
    >
      {value}
    </span>
    <span className="text-[11px] font-semibold text-white/40 mt-1 text-center uppercase tracking-wide">
      {label}
    </span>
  </div>
);

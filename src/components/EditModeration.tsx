import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { ModerationStatus } from "@/types/Requests"; // enum

// ------------------------------------
// TYPE DEFINITIONS
// ------------------------------------
type EditModerationProps<T> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  /** Either RequestType, AlertType, or OfferType_ */
  item: T;

  /** "request" | "alert" | "offer" */
  type: "request" | "alert" | "offer";

  /** API endpoint */
  endpoint: string;

  /** react-query key to invalidate */
  queryKey: string;
};

type BaseModerationItem = {
  id: string;
  title: string;
  moderationStatus: ModerationStatus;
};

// ------------------------------------
// COMPONENT
// ------------------------------------
export function EditModeration<T extends BaseModerationItem>({
  open,
  onOpenChange,
  item,
  type,
  endpoint,
  queryKey,
}: EditModerationProps<T>) {
  // Fix enum typing with Object.values()
  const moderationOptions = Object.values(
    ModerationStatus,
  ) as ModerationStatus[];

  const [selectedStatus, setSelectedStatus] = useState<ModerationStatus>(
    item?.moderationStatus as ModerationStatus,
  );

  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  if (!item) return null;

  const remainingOptions = moderationOptions.filter(
    (s) => s !== item.moderationStatus,
  ) as ModerationStatus[];

  // ------------------------------------
  // SUBMIT HANDLER
  // ------------------------------------
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStatus === item.moderationStatus) {
      toast.error(`Status is already '${item.moderationStatus}'`);
      return;
    }

    try {
      setLoading(true);

      // Strongly typed payload
      const payload =
        type === "request"
          ? { requestId: item.id, moderationStatus: selectedStatus }
          : type === "offer"
            ? { offerId: item.id, moderationStatus: selectedStatus }
            : { alertId: item.id, moderationStatus: selectedStatus };

      const response = await api.patch(endpoint, payload);

      toast.success(response.data.message || "Updated successfully!");

      queryClient.invalidateQueries({ queryKey: [queryKey] });

      onOpenChange(false);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Update failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // UI
  // ------------------------------------
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-[#020617] border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] text-white">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white tracking-tight">
              Edit Moderation Status
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-white/50">
              Update the moderation state for this {type}.
            </DialogDescription>
          </DialogHeader>

          {/* Title */}
          <div className="grid gap-2">
            <Label className="text-white/40 font-semibold tracking-wide ml-1">
              Title
            </Label>
            <Input
              disabled
              defaultValue={item.title}
              className="bg-white/5 border-white/10 text-white font-medium h-12 rounded-xl"
            />
          </div>

          {/* Status Dropdown */}
          <div className="grid gap-2 mb-4">
            <Label className="text-white/40 font-semibold tracking-wide ml-1">
              Moderation Status
            </Label>

            <Select
              value={selectedStatus}
              onValueChange={(v) => setSelectedStatus(v as ModerationStatus)}
            >
              <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl font-semibold">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent className="bg-[#020617] border border-white/10 text-white rounded-xl shadow-2xl">
                {/* Disabled current status */}
                <SelectItem
                  value={item.moderationStatus}
                  disabled
                  className="font-semibold text-white/30"
                >
                  {item.moderationStatus} (Current)
                </SelectItem>

                {/* Other statuses */}
                {remainingOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-white/5">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="text-white/40 hover:text-white hover:bg-white/5 rounded-xl font-bold h-11 px-6 transition-all"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              disabled={loading}
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl h-11 px-8 shadow-lg shadow-indigo-500/20 transition-all gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Processing..." : "Save Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
} from "@/components/ui/dialog";
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

  /** Either RequestType or AlertType */
  item: T;

  /** "request" | "alert" */
  type: "request" | "alert";

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
  if (!item) return null;

  // Fix enum typing with Object.values()
  const moderationOptions = Object.values(
    ModerationStatus
  ) as ModerationStatus[];

  const [selectedStatus, setSelectedStatus] = useState<ModerationStatus>(
    item.moderationStatus
  );

  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const remainingOptions = moderationOptions.filter(
    (s) => s !== item.moderationStatus
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
          : { alertId: item.id, moderationStatus: selectedStatus };

      const response = await api.patch(endpoint, payload);

      toast.success(response.data.message || "Updated successfully!");

      queryClient.invalidateQueries({ queryKey: [queryKey] });

      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // UI
  // ------------------------------------
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-auto">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Moderation Status</DialogTitle>
            <DialogDescription>
              Change the moderation status for this {type}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input disabled defaultValue={item.title} />
            </div>

            {/* Status Dropdown */}
            <div className="grid gap-2 mb-4">
              <Label>Moderation Status</Label>

              <Select
                value={selectedStatus}
                onValueChange={(v) => setSelectedStatus(v as ModerationStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select moderation status" />
                </SelectTrigger>

                <SelectContent>
                  {/* Disabled current status */}
                  <SelectItem value={item.moderationStatus} disabled>
                    {item.moderationStatus}
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
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button disabled={loading} type="submit">
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

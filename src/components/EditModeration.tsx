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

export function EditModeration({
  request,
  open,
  onOpenChange,
}: {
  request: any | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  const moderationOptions = ["clean", "flagged", "reviewed", "blocked"];
  const remainingOptions = moderationOptions.filter(
    (status) => status !== request?.moderationStatus
  );

  const [selectedStatus, setSelectedStatus] = useState(
    request.moderationStatus
  );
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.patch("/requests/moderation-status", {
        requestId: request.id,
        moderationStatus: selectedStatus,
      });

      toast.success(
        response.data.message || "Moderation status updated successfully!"
      );
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update moderation status"
      );
    } finally {
      setLoading(false);
    }
  };
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Moderation Status</DialogTitle>
            <DialogDescription>
              Make changes to the request moderation status here. Click save
              when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={request.title}
                disabled
              />
            </div>

            <div className="grid gap-2 mb-4">
              <Label htmlFor="moderation">Moderation Status</Label>
              <Select
                name="moderation"
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger id="moderation">
                  <SelectValue placeholder="Select moderation status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem
                    value={request.moderationStatus}
                    disabled
                    className="opacity-60 italic capitalize"
                  >
                    {request.moderationStatus.charAt(0).toUpperCase() +
                      request.moderationStatus.slice(1)}
                  </SelectItem>

                  {remainingOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

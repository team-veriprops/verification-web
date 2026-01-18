import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@3rdparty/ui/dialog";
import { Button } from "@3rdparty/ui/button";
import { Label } from "@3rdparty/ui/label";
import { RadioGroup, RadioGroupItem } from "@3rdparty/ui/radio-group";
import { Textarea } from "@3rdparty/ui/textarea";
import { useTaskStore } from "../../libs/useTaskStore";

interface DeclineDialogProps {
  onConfirm: (reason: string) => void;
}

const declineReasons = [
  { value: "busy", label: "Too busy with other tasks" },
  { value: "jurisdiction", label: "Out of my jurisdiction" },
  { value: "conflict", label: "Conflict of interest" },
  { value: "other", label: "Other (please specify)" },
];

export function DeclineDialog({ onConfirm }: DeclineDialogProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const { viewTaskDeclineDialog, setViewTaskDeclineDialog } =
    useTaskStore();

  const handleConfirm = () => {
    if (!selectedReason) {
      //   toast.error('Please select a reason for declining');
      return;
    }

    if (selectedReason === "other" && !otherReason.trim()) {
      //   toast.error('Please provide a reason');
      return;
    }

    const finalReason =
      selectedReason === "other"
        ? otherReason
        : declineReasons.find((r) => r.value === selectedReason)?.label ||
          selectedReason;

    onConfirm(finalReason);
    // toast.info('Task declined and marked for reassignment');
    setViewTaskDeclineDialog(false);
  };

  return (
    <Dialog
      open={viewTaskDeclineDialog}
      onOpenChange={setViewTaskDeclineDialog}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Decline Task</DialogTitle>
          <DialogDescription>
            {"No worries — tell us why and we'll reassign this task to another verifier."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            {declineReasons.map((reason) => (
              <div key={reason.value} className="flex items-center space-x-2">
                <RadioGroupItem value={reason.value} id={reason.value} />
                <Label
                  htmlFor={reason.value}
                  className="font-normal cursor-pointer"
                >
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedReason === "other" && (
            <Textarea
              placeholder="Please provide a reason..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              rows={3}
            />
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={setViewTaskDeclineDialog.bind(null, false)}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Decline</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

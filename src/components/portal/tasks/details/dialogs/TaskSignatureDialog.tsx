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
import { Input } from "@3rdparty/ui/input";
import { Label } from "@3rdparty/ui/label";
import { toast } from "sonner";
import { Fingerprint, Loader2 } from "lucide-react";
import { useTaskStore } from "../../libs/useTaskStore";

interface SignatureDialogProps {
  onConfirm: (signature: object) => void;
}

export function SignatureDialog({ onConfirm }: SignatureDialogProps) {
  const [pin, setPin] = useState("");
  const [signing, setSigning] = useState(false);
  const {
    viewTaskSignatureDialog,
    setViewTaskSignatureDialog,
  } = useTaskStore();

  const handleSign = async () => {
    if (pin.length !== 4) {
      toast.error("Please enter a 4-digit PIN");
      return;
    }

    setSigning(true);

    // Simulate signing process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const signature = {
      signedAt: new Date().toISOString(),
      pin: pin,
      signatureMock: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    onConfirm(signature);
    toast.success("Task submitted successfully! 🎉", {
      description: "Thank you for being thorough with your verification",
    });

    setSigning(false);
    setPin("");
  };

  return (
    <Dialog
      open={viewTaskSignatureDialog}
      onOpenChange={setViewTaskSignatureDialog}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-primary" />
            Digital Sign-off
          </DialogTitle>
          <DialogDescription>
            Enter your 4-digit PIN to digitally sign and submit this
            verification.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pin">Verification PIN</Label>
            <Input
              id="pin"
              type="password"
              maxLength={4}
              placeholder="****"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-widest"
              disabled={signing}
            />
            <p className="text-xs text-muted-foreground">
              For demo purposes, any 4-digit PIN will work
            </p>
          </div>

          {signing && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground animate-pulse-soft">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing verification...</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={setViewTaskSignatureDialog.bind(null, false)}
            disabled={signing}
          >
            Cancel
          </Button>
          <Button onClick={handleSign} disabled={signing || pin.length !== 4}>
            {signing ? "Signing..." : "Sign & Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

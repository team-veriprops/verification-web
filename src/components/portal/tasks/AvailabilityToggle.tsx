import { Switch } from "@3rdparty/ui/switch";
import { Label } from "@3rdparty/ui/label";
import { useState } from "react";
import { toast } from "@components/3rdparty/ui/use-toast";

export function AvailabilityToggle() {
  const [isAvailable, setIsAvailable] = useState(false);

  const handleToggle = (checked: boolean) => {
    setIsAvailable(checked);

    if (checked) {
      toast({ title: "Available", description: "You're now available for new tasks! 🎉" });
    } else {
      toast({ title: "Unavailable", description: "You're not available for new tasks!", variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border-border bg-secondary/50 px-3 py-1.5">
      <Switch
        id="availability"
        checked={isAvailable}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-success"
      />
      <Label
        htmlFor="availability"
        className="text-sm font-medium cursor-pointer"
      >
        {isAvailable ? "Available" : "Unavailable"}
      </Label>
    </div>
  );
}

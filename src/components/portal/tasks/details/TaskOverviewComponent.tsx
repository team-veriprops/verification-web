import { Badge } from "@components/3rdparty/ui/badge";
import { Card, CardContent } from "@components/3rdparty/ui/card";
import { formatMeasurement } from "@lib/utils";
import { FileText } from "lucide-react";
import { useTaskStore } from "../libs/useTaskStore";

export default function TaskOverviewComponent() {
  const { currentTask } = useTaskStore();

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Property Details</h4>
          <div className="grid gap-2 text-sm">
            {currentTask?.property_parcel_id && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Parcel ID:</span>
                <span className="font-medium">
                  {currentTask.property_parcel_id}
                </span>
              </div>
            )}
            {currentTask?.plot_size && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">
                  {" "}
                  {formatMeasurement(currentTask.plot_size)}
                </span>
              </div>
            )}
            {currentTask?.location && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Coordinates:</span>
                <span className="font-mono text-xs">
                  {currentTask.location.coordinates?.lat.toFixed(4)},{" "}
                  {currentTask.location.coordinates?.lng.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div >
          <h4 className="text-sm font-medium mb-2">Verification Focus</h4>
          <ul className="space-y-1">
            {currentTask?.verification_focus.map((focus, key) => (
              <li key={key} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-0.5">•</span>
                <span>{focus}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Required Evidence</h4>
          <div className="flex flex-wrap gap-2">
            {currentTask?.required_response.map((req, key) => (
              <Badge key={key} variant="outline">
                <FileText className="mr-1 h-3 w-3" />
                {req.title.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

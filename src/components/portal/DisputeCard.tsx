import Link  from "next/link";
import { MapPin, Calendar, Users } from "lucide-react";
import { Badge } from "@components/3rdparty/ui/badge";
import { Button } from "@components/3rdparty/ui/button";
import { cn } from "@lib/utils";
import { Dispute, formatDate, getStatusBadgeColor, getDisputeTypeBadgeColor, getDisputeTypeLabel } from "@data/portalMockData";

interface DisputeCardProps {
  dispute: Dispute;
}

const DisputeCard = ({ dispute }: DisputeCardProps) => {
  const partyCount = 2 + dispute.parties.thirdParties.length;

  return (
    <div className="bg-card border border-border rounded-xl p-4 lg:p-5 hover:shadow-soft transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <span className="font-mono text-xs text-muted-foreground">{dispute.id}</span>
            <h3 className="font-display font-semibold text-foreground">
              {dispute.title}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className={cn("text-xs", getDisputeTypeBadgeColor(dispute.type))}>
              {getDisputeTypeLabel(dispute.type)}
            </Badge>
            <Badge className={cn("capitalize", getStatusBadgeColor(dispute.status))}>
              {dispute.status === "under_review" ? "Under Review" : dispute.status}
              {dispute.status === "active" && (
                <span className="ml-1.5 h-2 w-2 rounded-full bg-current animate-pulse" />
              )}
            </Badge>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{dispute.propertyLocation}</span>
        </div>

        {/* Linked Verification */}
        <Link 
          href={`/portal/verifications/${dispute.verificationId}`}
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          {dispute.verificationId}
        </Link>

        {/* Parties & Dates */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{partyCount} parties involved</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Filed: {formatDate(dispute.filedDate)}</span>
            </div>
          </div>
        </div>

        {/* Resolution Status */}
        {dispute.resolution && (
          <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
            <p className="text-sm font-medium text-success">
              Resolved: {dispute.resolution.outcome}
            </p>
          </div>
        )}

        {/* View Button */}
        <Button asChild size="sm" variant="outline" className="w-full mt-2">
          <Link href={`/portal/disputes/${dispute.id}`}>
            View Details
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DisputeCard;

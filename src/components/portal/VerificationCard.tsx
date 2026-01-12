import Link from "next/link";
import { MapPin, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@components/3rdparty/ui/badge";
import { Button } from "@components/3rdparty/ui/button";
import { cn } from "@lib/utils";
import { Verification, formatDate, getStatusBadgeColor } from "@data/portalMockData";

interface VerificationCardProps {
  verification: Verification;
}

const VerificationCard = ({ verification }: VerificationCardProps) => {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      land: "Land",
      residential: "Residential",
      commercial: "Commercial"
    };
    return labels[type] || type;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4" />;
      case "flagged":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score === 0) return "text-muted-foreground";
    if (score <= 30) return "text-success";
    if (score <= 60) return "text-warning";
    return "text-danger";
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 lg:p-5 hover:shadow-soft transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left side */}
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display font-semibold text-foreground">
              {verification.id}
            </span>
            <Badge variant="outline" className="capitalize">
              {getTypeLabel(verification.type)}
            </Badge>
            <Badge className={cn("capitalize", getStatusBadgeColor(verification.status))}>
              {getStatusIcon(verification.status)}
              <span className="ml-1">{verification.status}</span>
            </Badge>
          </div>
          
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{verification.location}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Submitted: {formatDate(verification.submittedDate)}</span>
            </div>
            {verification.riskScore > 0 && (
              <div className={cn("font-medium", getRiskColor(verification.riskScore))}>
                Risk Score: {verification.riskScore}%
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex sm:flex-col gap-2 sm:items-end">
          <Button asChild size="sm">
            <Link href={`/portal/verifications/${verification.id}`}>
              View Report
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationCard;

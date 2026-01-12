"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link"
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  MapPin, 
  User, 
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Ruler,
  Navigation
} from "lucide-react";
import { Button } from "@components/3rdparty/ui/button";
import { Badge } from "@components/3rdparty/ui/badge";
import { cn } from "@lib/utils";
import { 
  mockVerifications, 
  mockTasks,
  mockDisputes,
  formatDate, 
  getStatusBadgeColor 
} from "@data/portalMockData";
import { useToast } from "@hooks/use-toast";

export default function TaskDetailsComponentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;

  const verification = mockVerifications.find(v => v.id === id);

  if (!verification) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Verification not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/portal/verifications")}>
          Back to Verifications
        </Button>
      </div>
    );
  }

  const relatedTasks = mockTasks.filter(t => t.verificationId === verification.id);
  const relatedDisputes = mockDisputes.filter(d => d.verificationId === verification.id);

  const handleDownloadPDF = () => {
    toast({
      title: "Preparing Report",
      description: "Your PDF report will download shortly...",
    });
    setTimeout(() => window.print(), 500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Share Link Copied",
      description: "Report link has been copied to clipboard",
    });
  };

  const getDocStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "flagged":
        return <AlertCircle className="h-4 w-4 text-danger" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return "text-success bg-success/10";
    if (score <= 60) return "text-warning bg-warning/10";
    return "text-danger bg-danger/10";
  };

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      land: "Land",
      residential: "Residential",
      commercial: "Commercial"
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6 max-w-4xl print:max-w-none">
      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <Button variant="ghost" onClick={() => router.push("/portal/verifications")} className="w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Verifications
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div className="print-area space-y-6">
        {/* Property Header */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-display font-bold text-foreground">
                  {verification.id}
                </h1>
                <Badge variant="outline" className="capitalize">
                  {getTypeLabel(verification.type)}
                </Badge>
                <Badge className={cn("capitalize", getStatusBadgeColor(verification.status))}>
                  {verification.status}
                </Badge>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 mt-1" />
                <span>{verification.location}</span>
              </div>
            </div>

            {verification.riskScore > 0 && (
              <div className={cn(
                "px-4 py-2 rounded-xl font-display text-center",
                getRiskColor(verification.riskScore)
              )}>
                <div className="text-3xl font-bold">{verification.riskScore}%</div>
                <div className="text-xs">Risk Score</div>
              </div>
            )}
          </div>
        </div>

        {/* Property Overview */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg text-foreground">Property Overview</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Location</div>
                <div className="text-sm font-medium">{verification.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Ruler className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Size</div>
                <div className="text-sm font-medium">{verification.size}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Navigation className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Coordinates</div>
                <div className="text-sm font-medium">{verification.coordinates}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Property Type</div>
                <div className="text-sm font-medium capitalize">{getTypeLabel(verification.type)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ownership Verification */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg text-foreground">Ownership Verification</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Current Owner</div>
                <div className="text-sm font-medium">{verification.owner}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Title Status</div>
                <div className="text-sm font-medium">{verification.titleStatus}</div>
              </div>
            </div>

            {verification.encumbrances.length > 0 && (
              <div className="p-3 bg-danger/5 border border-danger/20 rounded-lg">
                <div className="text-xs text-danger font-medium mb-2">Encumbrances Found</div>
                <ul className="list-disc list-inside text-sm text-danger">
                  {verification.encumbrances.map((enc, i) => (
                    <li key={i}>{enc}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Document Verification */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg text-foreground">Document Verification</h2>
          <div className="space-y-2">
            {verification.documents.map((doc, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getDocStatusIcon(doc.status)}
                  <span className="text-sm font-medium">{doc.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("capitalize text-xs", getStatusBadgeColor(doc.status))}>
                    {doc.status}
                  </Badge>
                  {doc.verifiedDate && (
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {formatDate(doc.verifiedDate)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg text-foreground">Verification Timeline</h2>
          <div className="space-y-0">
            {verification.timeline.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  {index < verification.timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border my-1" />
                  )}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{formatDate(event.date)}</span>
                  </div>
                  <div className="font-medium text-foreground">{event.event}</div>
                  <div className="text-sm text-muted-foreground">{event.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tasks */}
        {relatedTasks.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4 no-print">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-foreground">Related Tasks</h2>
              <Button variant="ghost" size="sm">
                <Link href="/portal/tasks">View All</Link>
              </Button>
            </div>
            <div className="space-y-2">
              {relatedTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/portal/tasks/${task.id}`}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <div className="font-medium text-sm">{task.title}</div>
                    <div className="text-xs text-muted-foreground">{task.id}</div>
                  </div>
                  <Badge className={cn("capitalize text-xs", getStatusBadgeColor(task.status))}>
                    {task.status === "in_progress" ? "In Progress" : task.status}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Disputes */}
        {relatedDisputes.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4 no-print">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-foreground">Related Disputes</h2>
              <Button variant="ghost" size="sm">
                <Link href="/portal/disputes">View All</Link>
              </Button>
            </div>
            <div className="space-y-2">
              {relatedDisputes.map((dispute) => (
                <Link
                  key={dispute.id}
                  href={`/portal/disputes/${dispute.id}`}
                  className="flex items-center justify-between p-3 bg-danger/5 border border-danger/20 rounded-lg hover:bg-danger/10 transition-colors"
                >
                  <div>
                    <div className="font-medium text-sm">{dispute.title}</div>
                    <div className="text-xs text-muted-foreground">{dispute.id}</div>
                  </div>
                  <Badge className={cn("capitalize text-xs", getStatusBadgeColor(dispute.status))}>
                    {dispute.status === "under_review" ? "Under Review" : dispute.status}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useVerificationStore } from "../libs/useVerificationStore";
import { Button } from "@components/3rdparty/ui/button";
import {
  Download,
  FileText,
  MapPin,
  Ruler,
  Navigation,
  X,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Share2,
} from "lucide-react";
import { Badge } from "@components/3rdparty/ui/badge";
import { getVerificationStatusColor, getVerificationStatusIcon } from "../VerificationsTable";
import { useVerificationQueries } from "../libs/useVerificationQueries";
import { AnimatePresence, motion } from "framer-motion";
import MobileNavigationBottomPadding from "@components/ui/MobileNavigationBottomPadding";
import { CopyText } from "@components/ui/CopyText";
import { Progress } from "@components/3rdparty/ui/progress";
import { cn, formatLocationCoordinates, formatMeasurement, getStatusBadgeColor } from "@lib/utils";
import { useBodyOverflowHidden } from "@hooks/useBodyOverflowHidden";
import { formatDate } from "@lib/time";
import { toast } from "@components/3rdparty/ui/use-toast";

export default function VerificationDetailComponent() {
  const {
    viewVerificationDetail,
    setViewVerificationDetail,
    currentVerification,
    setCurrentVerification,
  } = useVerificationStore();

  const { useGetVerificationDetail } = useVerificationQueries();

  const {
    data: verificationDetail,
    isLoading,
    isError,
  } = useGetVerificationDetail(currentVerification?.id ?? "");

  const onOpenChange = (open: boolean) => {
    setViewVerificationDetail(false);
    if (!open) {
      // Delay clearing until AFTER exit animation finishes
      setTimeout(() => setCurrentVerification(null), 300);
    }
  };

    // Lock body scroll when modal is open
  useBodyOverflowHidden(viewVerificationDetail);

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

  const handleDownloadPDF = () => {
    toast({
      title: "Preparing Report",
      description: "Your PDF report will download shortly...",
    });
    // Trigger print dialog for PDF
    setTimeout(() => window.print(), 500);
  };

  const handleShare = () => {
    toast({
      title: "Share Link Copied",
      description: "Report link has been copied to clipboard",
    });
  };

  return (
       <AnimatePresence>
      {viewVerificationDetail && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(viewVerificationDetail)}
            className="fixed inset-0 w-full h-full bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={
              "fixed right-0 top-0 h-full w-full bg-card border-l border-border shadow-2xl z-50 overflow-y-auto sm:max-w-212.5"
            }
          >
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2
                    id="dispute-title"
                    className="text-lg font-semibold text-foreground"
                  >
                    {"Verification Details"}
                  </h2>
                  <CopyText text={currentVerification?.ref_id ?? ""} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size={"sm"} onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                    <Button  size={"sm"} onClick={handleDownloadPDF}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                    </Button>
                    </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenChange(viewVerificationDetail)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Risk Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Risk score:{" "}
                    {currentVerification?.risk_score ?? "N/A"}%
                  </span>
                  <Badge
                    variant="outline"
                    className={`${getVerificationStatusColor(currentVerification?.status)} flex items-center gap-1 w-fit`}
                  >
                    {getVerificationStatusIcon(currentVerification?.status)}
                    <span className="capitalize">{currentVerification?.status}</span>
                  </Badge>
                </div>
                {currentVerification?.risk_score && <Progress value={100 - currentVerification?.risk_score} className="h-2 bg-danger" />}
              </div>
            </div>

            {/* Property Overview */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 mx-6 my-6">
            <h2 className="font-display font-semibold text-lg text-foreground">Property Overview</h2>
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                    <div className="text-xs text-muted-foreground">Location</div>
                    <div className="text-sm font-medium">{currentVerification?.location.address}</div>
                </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Ruler className="h-5 w-5 text-muted-foreground" />
                <div>
                    <div className="text-xs text-muted-foreground">Size</div>
                    <div className="text-sm font-medium">{formatMeasurement(currentVerification?.property_plot_size)}</div>
                </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Navigation className="h-5 w-5 text-muted-foreground" />
                <div>
                    <div className="text-xs text-muted-foreground">Coordinates</div>
                    <div className="text-sm font-medium">{formatLocationCoordinates(currentVerification?.location.coordinates)}</div>
                </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                    <div className="text-xs text-muted-foreground">Property Type</div>
                    <div className="text-sm font-medium capitalize">{currentVerification?.property_type}</div>
                </div>
                </div>
            </div>
            </div>

            {/* Ownership Verification */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 mx-6 my-6">
            <h2 className="font-display font-semibold text-lg text-foreground">Ownership Verification</h2>
            <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                    <div className="text-xs text-muted-foreground">Current Owner</div>
                    <div className="text-sm font-medium">{currentVerification?.owner_fullname}</div>
                </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                    <div className="text-xs text-muted-foreground">Title Status</div>
                    <div className="text-sm font-medium">{verificationDetail?.title_status}</div>
                </div>
                </div>
                {(verificationDetail?.encumbrances.length ?? 0) > 0 && (
                <div className="p-3 bg-danger/5 border border-danger/20 rounded-lg">
                    <div className="text-xs text-danger font-medium mb-2">Encumbrances Found</div>
                    <ul className="list-disc list-inside text-sm text-danger">
                    {verificationDetail?.encumbrances.map((enc, i) => (
                        <li key={i}>{enc}</li>
                    ))}
                    </ul>
                </div>
                )}
            </div>
            </div>

            {/* Document Verification */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 mx-6 my-6">
            <h2 className="font-display font-semibold text-lg text-foreground">Document Verification</h2>
            <div className="space-y-2">
                {currentVerification?.documents.map((doc, index) => (
                <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                    <div className="flex items-center gap-3">
                    {getDocStatusIcon(doc.status)}
                    <span className="text-sm font-medium">{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                    <Badge className={cn("capitalize text-xs", getStatusBadgeColor(doc.status.toLowerCase()))}>
                        {doc.status}
                    </Badge>
                    {doc.verified_date && (
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                        {formatDate(doc.verified_date)}
                        </span>
                    )}
                    </div>
                </div>
                ))}
            </div>
            </div>

            {/* Timeline */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 mx-6 my-6">
            <h2 className="font-display font-semibold text-lg text-foreground">Verification Timeline</h2>
            <div className="space-y-0">
                {verificationDetail?.timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    {index < verificationDetail?.timeline.length - 1 && (
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

            <MobileNavigationBottomPadding />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

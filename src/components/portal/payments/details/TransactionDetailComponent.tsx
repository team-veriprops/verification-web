import DetailDrawer, { DetailDrawerWidth } from "@components/ui/DetailDrawer";
import { usePaymentStore } from "../libs/usePaymentStore";
import DisputeFormComponent from "@components/ui/DisputeFormComponent";
import { Card } from "@components/3rdparty/ui/card";
import { Button } from "@components/3rdparty/ui/button";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";
import { Separator } from "@components/3rdparty/ui/separator";
import { Badge } from "@components/3rdparty/ui/badge";
import { getStatusColor, getStatusIcon } from "../PaymentsTable";
import { toast } from "sonner";
import { format } from "date-fns";
import { formatMoney } from "@lib/utils";
import { AsyncStateComponent } from "@components/ui/AsyncStateComponent";
import { usePaymentQueries } from "../libs/usePaymentQueries";

export default function PaymentDetailComponent() {
  const {
    viewPaymentDetail,
    setViewPaymentDetail,
    currentPayment,
    setCurrentPayment,
  } = usePaymentStore();

  const { useGetPaymentDetail } = usePaymentQueries();

  const {
    data: paymentDetail,
    isLoading,
    isError,
  } = useGetPaymentDetail(currentPayment?.id ?? "");

  const statusTimeline = [
    { status: "Initiated", completed: true, date: currentPayment?.date_created },
    {
      status: "Processing",
      completed: currentPayment?.status !== "failed",
      date: currentPayment?.date_created,
    },
    {
      status:
        currentPayment?.status === "completed"
          ? "Completed"
          : currentPayment?.status === "failed"
            ? "Failed"
            : "In Progress",
      completed: currentPayment?.status === "completed",
      date:
        currentPayment?.status === "completed"
          ? currentPayment?.date_created
          : null,
    },
  ];

  const handleDownloadReceipt = () => {
    toast.success(`Downloading receipt for ${currentPayment?.ref_id}`, {
      icon: <Download className="h-4 w-4" />,
    });
    console.log("Download receipt:", currentPayment);
  };

  const handleDownloadEscrowCertificate = () => {
    toast.success("Downloading escrow certificate", {
      icon: <ShieldCheck className="h-4 w-4" />,
    });
    console.log("Download escrow certificate:", currentPayment);
  };

  return (
    <DetailDrawer
      open={viewPaymentDetail}
      onOpenChange={(open) => {
        setViewPaymentDetail(false);
        if (!open) {
          // Delay clearing until AFTER exit animation finishes
          setTimeout(() => setCurrentPayment(null), 300);
        }
      }}
      title="Payment details"
      reference={currentPayment?.ref_id ?? ""}
      drawerWidth={DetailDrawerWidth.SMALL}
    >
      <AsyncStateComponent
        isLoading={isLoading}
        isError={isError}
        data={paymentDetail}
        loadingText="Loading payment details..."
        errorText="Failed to load payment details, please try again later."
        emptyText="No payment details found."
      >
        {() => (
          <div className="p-6 space-y-6">
            {/* Status and Amount */}
            <Card className="p-6 bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <Badge
                  variant="outline"
                  className={`${getStatusColor(currentPayment?.status)} flex items-center gap-2 px-3 py-1.5 text-sm`}
                >
                  {getStatusIcon(currentPayment?.status)}
                  <span className="capitalize font-semibold">
                    {currentPayment?.status}
                  </span>
                </Badge>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-3xl font-bold">
                    {formatMoney(currentPayment?.amount!)}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-3 mt-6">
                {statusTimeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.completed
                          ? "bg-success text-success-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${item.completed ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {item.status}
                      </p>
                      {item.date && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Payment Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Payment Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">
                    {currentPayment?.type}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {format(new Date(currentPayment?.date_created!), "PPP")}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference ID</span>
                  <span className="font-mono text-xs">
                    {currentPayment?.ref_id}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Channel</span>
                  <span className="font-medium">
                    {paymentDetail?.payment_channel}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Gateway Response
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-success/10 text-success"
                  >
                    {paymentDetail?.gateway_response}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wallet Impact</span>
                  <Badge variant="outline">
                    {paymentDetail?.wallet_impact}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleDownloadReceipt}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                {currentPayment?.type === "escrow" && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleDownloadEscrowCertificate}
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Download Escrow Certificate
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      View Contract
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Go to Property
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {/* Raise Dispute */}
            <DisputeFormComponent />
          </div>
        )}
      </AsyncStateComponent>
    </DetailDrawer>
  );
}

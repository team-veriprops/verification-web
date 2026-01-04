import DetailDrawer, { DetailDrawerWidth } from "@components/ui/DetailDrawer";
import { useTransactionStore } from "../libs/useTransactionStore";
import { useBodyOverflowHidden } from "@hooks/useBodyOverflowHidden";
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
  Loader2,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";
import { Separator } from "@components/3rdparty/ui/separator";
import { Badge } from "@components/3rdparty/ui/badge";
import { getStatusColor, getStatusIcon } from "../TransactionTable";
import { useTransactionDetailQueries } from "./libs/useTransactionDetailQueries";
import { toast } from "sonner";
import { format } from "date-fns";
import { formatMoney } from "@lib/utils";
import MobileNavigationBottomPadding from "@components/ui/MobileNavigationBottomPadding";
import { AsyncStateComponent } from "@components/ui/AsyncStateComponent";

export default function TransactionDetailComponent() {
  const {
    viewTransactionDetail,
    setViewTransactionDetail,
    currentTransaction,
    setCurrentTransaction,
  } = useTransactionStore();

  const { useGetTransactionDetail } = useTransactionDetailQueries();

  const {
    data: transactionDetail,
    isLoading,
    isError,
  } = useGetTransactionDetail(currentTransaction?.id!);

  const statusTimeline = [
    { status: "Initiated", completed: true, date: currentTransaction?.date_created },
    {
      status: "Processing",
      completed: currentTransaction?.status !== "failed",
      date: currentTransaction?.date_created,
    },
    {
      status:
        currentTransaction?.status === "completed"
          ? "Completed"
          : currentTransaction?.status === "failed"
            ? "Failed"
            : "In Progress",
      completed: currentTransaction?.status === "completed",
      date:
        currentTransaction?.status === "completed"
          ? currentTransaction?.date_created
          : null,
    },
  ];

  const handleDownloadReceipt = () => {
    toast.success(`Downloading receipt for ${currentTransaction?.ref_id}`, {
      icon: <Download className="h-4 w-4" />,
    });
    console.log("Download receipt:", currentTransaction);
  };

  const handleDownloadEscrowCertificate = () => {
    toast.success("Downloading escrow certificate", {
      icon: <ShieldCheck className="h-4 w-4" />,
    });
    console.log("Download escrow certificate:", currentTransaction);
  };

  return (
    <DetailDrawer
      open={viewTransactionDetail}
      onOpenChange={(open) => {
        setViewTransactionDetail(false);
        if (!open) {
          // Delay clearing until AFTER exit animation finishes
          setTimeout(() => setCurrentTransaction(null), 300);
        }
      }}
      title="Transaction details"
      reference={currentTransaction?.ref_id!}
      drawerWidth={DetailDrawerWidth.SMALL}
    >
      <AsyncStateComponent
        isLoading={isLoading}
        isError={isError}
        data={transactionDetail}
        loadingText="Loading transaction details..."
        errorText="Failed to load transaction details, please try again later."
        emptyText="No transaction details found."
      >
        {() => (
          <div className="p-6 space-y-6">
            {/* Status and Amount */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <Badge
                  variant="outline"
                  className={`${getStatusColor(currentTransaction?.status!)} flex items-center gap-2 px-3 py-1.5 text-sm`}
                >
                  {getStatusIcon(currentTransaction?.status!)}
                  <span className="capitalize font-semibold">
                    {currentTransaction?.status}
                  </span>
                </Badge>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-3xl font-bold">
                    {formatMoney(currentTransaction?.amount!)}
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

            {/* Transaction Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Transaction Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">
                    {currentTransaction?.type}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {format(new Date(currentTransaction?.date_created!), "PPP")}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference ID</span>
                  <span className="font-mono text-xs">
                    {currentTransaction?.ref_id}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Channel</span>
                  <span className="font-medium">
                    {transactionDetail?.payment_channel}
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
                    {transactionDetail?.gateway_response}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wallet Impact</span>
                  <Badge variant="outline">
                    {transactionDetail?.wallet_impact}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Escrow Details (if applicable) */}
            {currentTransaction?.type === "escrow" &&
              transactionDetail?.escrow_id && (
                <Card className="p-6 bg-gradient-to-br from-success/5 to-success/10 border-success/20">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-success" />
                    Escrow Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Escrow ID</span>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-primary"
                      >
                        {transactionDetail?.escrow_id}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                    {transactionDetail?.property_title && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">
                                {transactionDetail?.property_title}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                {transactionDetail?.property_location}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Seller:</span>
                          <span className="font-medium">
                            {transactionDetail?.seller}
                          </span>
                        </div>
                      </>
                    )}
                    <Separator />
                    <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Escrow Amount</span>
                        <span className="font-medium">
                          {formatMoney(currentTransaction?.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Escrow Fee</span>
                        <span className="font-medium">
                          {formatMoney(transactionDetail?.escrow_fee!)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatMoney(currentTransaction?.amount)}</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Estimated release:{" "}
                        {format(
                          new Date(
                            transactionDetail?.escrow_estimated_release_time!
                          ),
                          "PPP"
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

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
                {currentTransaction?.type === "escrow" && (
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

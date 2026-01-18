"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  FileDown,
  XCircle,
} from "lucide-react";
import { Badge } from "@3rdparty/ui/badge";
import { formatMoney } from "@lib/utils";
import { useGlobalSettings } from "@stores/useGlobalSettings";
import { useEffect } from "react";
import { Action, Column, DataTable } from "@components/ui/DataTable";
import { usePaymentQueries } from "./libs/usePaymentQueries";
import { usePaymentStore } from "./libs/usePaymentStore";
import {
  QueryPaymentDto,
  PaymentStatus,
} from "./models";
import { formatDate } from "@lib/time";
import PaymentDetailComponent from "./details/PaymentDetailComponent";

export const getStatusIcon = (status: PaymentStatus | undefined) => {
  switch (status) {
    case PaymentStatus.COMPLETED:
      return <CheckCircle className="h-3 w-3" />;
    case PaymentStatus.PENDING:
      return <Clock className="h-3 w-3" />;
    case PaymentStatus.FAILED:
      return <XCircle className="h-3 w-3" />;
    case PaymentStatus.CANCELLED:
      return <XCircle className="h-3 w-3" />;
    default:
      return <AlertCircle className="h-3 w-3" />;
  }
};

export const getStatusColor = (status: PaymentStatus | undefined) => {
  switch (status) {
    case PaymentStatus.COMPLETED:
      return "bg-success/10 text-success border-success/20";
    case PaymentStatus.PENDING:
      return "bg-warning/10 text-warning border-warning/20";
    case PaymentStatus.FAILED:
      return "bg-destructive/10 text-destructive border-destructive/20";
    case PaymentStatus.CANCELLED:
      return "bg-muted text-muted-foreground border-border";
    case PaymentStatus.REFUNDED:
      return "bg-accent/10 text-accent border-accent/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};
export default function PaymentsTable() {
  const { settings } = useGlobalSettings();
  const {
    filters,
    updateFilters,
    setCurrentPayment,
    setViewPaymentDetail,
  } = usePaymentStore();

  const { useSearchPaymentPage } = usePaymentQueries();
  const { data, isLoading, isError, error } = useSearchPaymentPage();

  useEffect(() => {
    updateFilters({ page_size: settings.rowsPerPage });
  }, [settings.rowsPerPage, updateFilters]);

  const columns: Column<QueryPaymentDto>[] = [
    {
      key: "ref_id",
      label: "Invoice ID",
      sortable: true,
      render: (value) => value,
    },
    {
      key: "date_created",
      label: "Date",
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      render: (value) => value,
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (value) => formatMoney(value),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      filterable: true,
      render: (value) => (
        <Badge
          variant="outline"
          className={`${getStatusColor(value)} flex items-center gap-1 w-fit`}
        >
          {getStatusIcon(value)}
          <span className="capitalize">{value}</span>
        </Badge>
      ),
    },
  ];

  const actions: Action<QueryPaymentDto>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: (payment) => handleViewDetails(payment),
    },
    {
      label: "Download Receipt",
      icon: FileDown,
      shown: (payment) => payment.status === PaymentStatus.COMPLETED,
      onClick: (payment) => {
        console.log("Receipt", payment.id);
      },
    },
    {
      label: "Download Invoice",
      icon: FileDown,
      shown: (payment) => payment.status === PaymentStatus.PENDING,
      onClick: (payment) => {
        console.log("Receipt", payment.id);
      },
    },
    {
      label: "Cancel",
      icon: XCircle,
      shown: (payment) => payment.status === PaymentStatus.PENDING,
      onClick: (payment) => {
        console.log("Receipt", payment.id);
      },
    }
  ];

  const handleViewDetails = (payment: QueryPaymentDto) => {
    setCurrentPayment(payment);
    setViewPaymentDetail(true);
  };

  return (
    <>
      <DataTable
        columns={columns}
        actions={actions}
        dataPage={data!}
        isLoading={isLoading}
        isError={isError}
        error={error}
        currentPage={filters.page!}
        updateFilters={updateFilters}
        isRowClickable={true}
        onRowClick={(payment) => handleViewDetails(payment)}
      />

      <PaymentDetailComponent />
    </>
  );
}

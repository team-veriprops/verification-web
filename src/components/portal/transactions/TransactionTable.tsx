"use client";

import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  FileDown,
  MessageCircle,
  Receipt,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";
import { Badge } from "@3rdparty/ui/badge";
import { format } from "date-fns";
import { formatMoney } from "@lib/utils";
import { useGlobalSettings } from "@stores/useGlobalSettings";
import { useEffect } from "react";
import { Action, Column, DataTable } from "@components/ui/DataTable";
import TransactionDetailComponent from "./details/TransactionDetailComponent";
import { useTransactionQueries } from "./libs/useTransactionQueries";
import { useTransactionStore } from "./libs/useTransactionStore";
import {
  QueryTransactionDto,
  TransactionStatus,
  TransactionType,
} from "./models";
import { formatDate } from "@lib/time";

export const getTypeIcon = (type: TransactionType) => {
  switch (type) {
    case TransactionType.DEPOSIT:
      return <Wallet className="h-4 w-4 text-primary" />;
    case TransactionType.ESCROW:
      return <ShieldCheck className="h-4 w-4 text-success" />;
    case TransactionType.WITHDRAWAL:
      return <ArrowUpRight className="h-4 w-4 text-warning" />;
    case TransactionType.FEE:
      return <Receipt className="h-4 w-4 text-muted-foreground" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
};

export const getStatusIcon = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.COMPLETED:
      return <CheckCircle2 className="h-3 w-3" />;
    case TransactionStatus.PENDING:
      return <Clock className="h-3 w-3" />;
    case TransactionStatus.FAILED:
      return <XCircle className="h-3 w-3" />;
    case TransactionStatus.CANCELLED:
      return <XCircle className="h-3 w-3" />;
    default:
      return <AlertCircle className="h-3 w-3" />;
  }
};

export const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.COMPLETED:
      return "bg-success/10 text-success border-success/20";
    case TransactionStatus.PENDING:
      return "bg-warning/10 text-warning border-warning/20";
    case TransactionStatus.FAILED:
      return "bg-destructive/10 text-destructive border-destructive/20";
    case TransactionStatus.CANCELLED:
      return "bg-muted text-muted-foreground border-border";
    case TransactionStatus.REFUNDED:
      return "bg-accent/10 text-accent border-accent/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};
export default function TransactionTable() {
  const { settings } = useGlobalSettings();
  const {
    filters,
    updateFilters,
    setCurrentTransaction,
    setViewTransactionDetail,
  } = useTransactionStore();

  const { useSearchTransactionPage } = useTransactionQueries();
  const { data, isLoading, isError, error } = useSearchTransactionPage();

  useEffect(() => {
    updateFilters({ page_size: settings.rowsPerPage });
  }, [settings.rowsPerPage, updateFilters]);

  const renderStatus = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return <Badge variant="default">Completed</Badge>;
      case TransactionStatus.PENDING:
        return <Badge variant="outline">Pending</Badge>;
      case TransactionStatus.CANCELLED:
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const columns: Column<QueryTransactionDto>[] = [
    {
      key: "date_created",
      label: "Date",
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(value)}
          <span className="text-sm capitalize">{value}</span>
        </div>
      ),
    },
    {
      key: "ref_id",
      label: "Reference ID",
      sortable: true,
      render: (value) => value,
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (value, item) => formatMoney(value),
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

  const actions: Action<QueryTransactionDto>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: (transaction) => handleViewDetails(transaction),
    },
    {
      label: "Download Receipt",
      icon: FileDown,
      onClick: (transaction) => {
        console.log("Receipt", transaction.id);
      },
    },
    {
      label: "Cancel",
      icon: XCircle,
      shown: (transaction) => transaction.status === TransactionStatus.PENDING,
      onClick: (transaction) => {
        console.log("Receipt", transaction.id);
      },
    },
    {
      label: "Contact Support",
      icon: MessageCircle,
      onClick: (transaction) => {
        console.log("Support", transaction.id);
      },
    },
  ];

  const handleViewDetails = (transaction: QueryTransactionDto) => {
    setCurrentTransaction(transaction);
    setViewTransactionDetail(true);
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
        onRowClick={(transaction) => handleViewDetails(transaction)}
      />

      <TransactionDetailComponent />
    </>
  );
}

"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  FileDown,
  MessageCircleMore,
  XCircle,
} from "lucide-react";
import { Badge } from "@3rdparty/ui/badge";
import { formatMoney } from "@lib/utils";
import { useGlobalSettings } from "@stores/useGlobalSettings";
import { useEffect } from "react";
import { Action, Column, DataTable } from "@components/ui/DataTable";
import { useVerificationQueries } from "./libs/useVerificationQueries";
import { useVerificationStore } from "./libs/useVerificationStore";
import {
  QueryVerificationDto,
  VerificationStatus,
} from "./models";
import { formatDate } from "@lib/time";
import VerificationDetailComponent from "./details/VerificationDetailComponent";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/3rdparty/ui/tooltip";
import { Progress } from "@components/3rdparty/ui/progress";

export const getVerificationStatusIcon = (status: VerificationStatus | undefined) => {
  switch (status) {
    case VerificationStatus.VERIFIED:
      return <CheckCircle className="h-3 w-3" />;
    case VerificationStatus.PENDING:
      return <Clock className="h-3 w-3" />;
    case VerificationStatus.FLAGGED:
      return <AlertCircle className="h-3 w-3" />;
    case VerificationStatus.CANCELLED:
      return <XCircle className="h-3 w-3" />;
    default:
      return <AlertCircle className="h-3 w-3" />;
  }
};

export const getVerificationStatusColor = (status: VerificationStatus | undefined) => {
  switch (status) {
    case VerificationStatus.VERIFIED:
      return "bg-success/10 text-success border-success/20";
    case VerificationStatus.PENDING:
      return "bg-warning/10 text-warning border-warning/20";
    case VerificationStatus.FLAGGED:
      return "bg-destructive/10 text-destructive border-destructive/20";
    case VerificationStatus.CANCELLED:
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};
export default function VerificationsTable() {
  const { settings } = useGlobalSettings();
  const {
    filters,
    updateFilters,
    setCurrentVerification,
    setViewVerificationDetail,
  } = useVerificationStore();

  const { useSearchVerificationPage } = useVerificationQueries();
  const { data, isLoading, isError, error } = useSearchVerificationPage();

  useEffect(() => {
    updateFilters({ page_size: settings.rowsPerPage });
  }, [settings.rowsPerPage, updateFilters]);

  const columns: Column<QueryVerificationDto>[] = [
    {
      key: "ref_id",
      label: "Reference ID",
      sortable: true,
      render: (value) => (
        <span className="font-display font-semibold text-foreground">
          {value}
        </span>
      ),
    },
    {
      key: "date_created",
      label: "Date submitted",
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: "property_type",
      label: "Property type",
      sortable: true,
      render: (value) => (
        <Badge variant="outline" className="capitalize">
          {value}
        </Badge>
      ),
    },
    {
      key: "location",
      label: "Property address",
      sortable: true,
      render: (value, item) => item.location.address,
    },
    {
      key: "property_estimated_price",
      label: "Property estimated price",
      sortable: true,
      render: (value) => formatMoney(value),
    },
    {
      key: "risk_score",
      label: "Risk score",
      sortable: true,
      render: (value, item) => item.risk_score ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded px-1">
                <Progress value={100 - item.risk_score} className="w-16 h-2 bg-danger" />
                <span className="text-sm font-medium w-8">
                  {item.risk_score}%
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Risk Score is based on verified values and reliability, the smaller the value the better.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ):
      "N/A"
      ,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      filterable: true,
      render: (value) => (
        <Badge
          variant="outline"
          className={`${getVerificationStatusColor(value)} flex items-center gap-1 w-fit`}
        >
          {getVerificationStatusIcon(value)}
          <span className="capitalize">{value}</span>
        </Badge>
      ),
    },
  ];

  const actions: Action<QueryVerificationDto>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: (verification) => handleViewDetails(verification),
    },
    {
      label: "Download Receipt",
      icon: FileDown,
      shown: (verification) => verification.paid,
      onClick: (verification) => {
        console.log("Receipt", verification.id);
      },
    },
    {
      label: "Chat",
      icon: MessageCircleMore,
      shown: (verification) => verification.status === VerificationStatus.PENDING,
      onClick: (verification) => {
        console.log("Receipt", verification.id);
      },
    },
    {
      label: "Cancel",
      icon: XCircle,
      shown: (verification) => verification.status === VerificationStatus.PENDING,
      onClick: (verification) => {
        console.log("Receipt", verification.id);
      },
    }
  ];

  const handleViewDetails = (verification: QueryVerificationDto) => {
    setCurrentVerification(verification);
    setViewVerificationDetail(true);
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
        onRowClick={(verification) => handleViewDetails(verification)}
      />

      <VerificationDetailComponent />
    </>
  );
}

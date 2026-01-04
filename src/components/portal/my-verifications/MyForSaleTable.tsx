"use client";

import { useEffect, useState } from "react";
import {
  Edit,
  Eye,
  Grid2x2Plus,
  HandPlatter,
  HousePlus,
  Trash2,
} from "lucide-react";
import { Badge } from "@3rdparty/ui/badge";
import { useGlobalSettings } from "@stores/useGlobalSettings";
import { formatMoney } from "@lib/utils";
import { PropertyStatus, QueryForSaleDto } from "./models";
import { Action, Column, DataTable } from "@components/ui/DataTable";
import { useForSaleStore } from "./libs/useForSaleStore";
import { useForSaleQueries } from "./libs/useForSaleQueries";
import { PropertyType } from "@components/website/property/models";
import { toast } from "@hooks/use-toast";
import { Button } from "@components/3rdparty/ui/button";
import { formatDate } from "@lib/time";

export function MyForSaleTable() {
  const [elementOfInterestId, setElementOfInterestId] = useState<string>();
  const { settings } = useGlobalSettings();
  const { filters, updateFilters, setCurrentForSale, setViewForSaleDetail } =
    useForSaleStore();

  const { useSearchForSalePage } = useForSaleQueries();
  const { data, isLoading, isError, error } = useSearchForSalePage();

  useEffect(() => {
    updateFilters({ page_size: settings.rowsPerPage });
  }, [settings.rowsPerPage, updateFilters]);

  const columns: Column<QueryForSaleDto>[] = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (value, for_sale) => (
        <div className="max-w-[200px]">
          <p className="truncate">{value}</p>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      render: (value, for_sale) => value,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (value, for_sale) => formatMoney(value),
    },
    {
      key: "date_updated",
      label: "Last Updated",
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      filterable: true,
      render: (value) => (
        <Badge variant={getStatusBadgeVariant(value)}>{value}</Badge>
      ),
    },
    {
      key: "views",
      label: "Views",
      sortable: true,
      render: (value, for_sale) => (
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-muted-foreground" />
          {value?.toLocaleString()}
        </div>
      ),
    },
    {
      key: "inquiries",
      label: "Inquiries",
      sortable: true,
      render: (value, for_sale) => (
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-muted-foreground" />
          {value?.toLocaleString()}
        </div>
      ),
    },
  ];

  const actions: Action<QueryForSaleDto>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: (for_sale) => handleViewDetails(for_sale),
    },
    {
      label: "Edit",
      icon: Edit,
      onClick: (for_sale) => handleEdit(for_sale.id!),
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: (for_sale) => handleDelete(for_sale.id!),
    },
  ];

  const handleViewDetails = (purchase: QueryForSaleDto) => {
    setCurrentForSale(purchase);
    setViewForSaleDetail(true);
  };

  function getStatusBadgeVariant(
    status: PropertyStatus
  ): "default" | "secondary" | "outline" | "destructive" {
    switch (status) {
      case PropertyStatus.ACTIVE:
        return "default";
      case PropertyStatus.PENDING:
        return "secondary";
      case PropertyStatus.SOLD:
        return "outline";
      case PropertyStatus.HIDDEN:
        return "destructive";
      default:
        return "default";
    }
  }

  const handleEdit = (id: string) => {
    // toast({
    //   title: "Edit Listing",
    //   description: "Edit functionality would open a form modal here.",
    // });
  };

  const handleDelete = (id: string) => {
    setElementOfInterestId(id);
    // setTimeout(() => {
    //   deleteListing(id);
    //   setDeletingId(null);
    //   toast({
    //     title: "Listing Deleted",
    //     description: "Listing has been permanently deleted.",
    //   });
    // }, 1000);
  };

  const handleAddNew = (type: PropertyType) => {
    toast({
      title: "Add New Listing",
      description: `Add new ${type.slice(0, -1)} form would open here.`,
    });
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
        onRowClick={(for_sale) => handleViewDetails(for_sale)}
        elementOfInterestId={elementOfInterestId}
      >
        <Button
          onClick={() => handleAddNew(filters.type!)}
          className="flex items-center gap-2 capitalize"
        >
          {filters.type === PropertyType.LAND && (
            <Grid2x2Plus className="h-4 w-4" />
          )}
          {filters.type === PropertyType.HOUSE && (
            <HousePlus className="h-4 w-4" />
          )}
          {filters.type === PropertyType.SERVICE && (
            <HandPlatter className="h-4 w-4" />
          )}
          Add New {filters.type}
        </Button>
      </DataTable>

      {/* <ForSaleDetailComponent /> */}
    </>
  );
}

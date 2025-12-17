'use client'

import { Tooltip } from "@radix-ui/react-tooltip";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import {
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  useMaterialReactTable,
} from "material-react-table";
import Link from "next/link";
import React, { useState } from "react";
import RecyclingIcon from "@mui/icons-material/Recycling";
import Delete from "@mui/icons-material/Delete";
import RestoreFromTrash from "@mui/icons-material/RestoreFromTrash";
import DeleteForever from "@mui/icons-material/DeleteForever";
import SaveAlt from "@mui/icons-material/SaveAlt";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import { ButtonLoading } from "../ButtonLoading";
import { toast } from "sonner";
import { download, generateCsv, mkConfig } from "export-to-csv";

const DataTable = ({
  queryKey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndPoint,
  deleteEndPoint,
  deleteType,
  trashView,
  createAction,
}) => {
  // =======================
  // Local Table State
  // =======================
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [exportLoading, setExportLoading] = useState(false);

  // =======================
  // API Query (React Query)
  // =======================
  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: [queryKey, { columnFilters, globalFilter, sorting, pagination }],

    queryFn: async () => {
      // Build API URL with query params
      const URL = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);

      // Apply table state to the backend query
      URL.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      URL.searchParams.set("size", `${pagination.pageSize}`);
      URL.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      URL.searchParams.set("globalFilter", globalFilter ?? "");
      URL.searchParams.set("sorting", JSON.stringify(sorting ?? []));

      const { data: response } = await axios.get(URL.href);
      return response;
    },

    // Keep previous table data while UI updates
    placeholderData: keepPreviousData,
  });

  const handleDelete = (ids, type) => {
    let c;
    if (deleteType === "PD") {
      c = confirm("Are you sure you want to delete the data permanently");
    } else {
      c = confirm("Are you sure you want to move the data into trash?");
    }

    if (c) {
      useDeleteMutation.mutate({ ids, deleteType });
      setRowSelection({});
    }
  };

  const handleExport = async (selectedRows) => {
    setExportLoading(true);
    try {
      const csvConfig = mkConfig({
        fieldSeparator: "",
        decimalSeparator: "",
        useKeysAsHeaders: true,
        filename: "csv-data",
      });

      let csv;
      if (Object.keys(rowSelection).length > 0) {
        const rowData = selectedRows.map((row) => row.original);
        csv = generateCsv(csvConfig)(rowData);
      } else {
        const { data: response } = await axios.get(exportEndPoint);
        if (!response.success) {
          throw new Error(response.message);
        }
      }

      download(csvConfig)(csv);
    } catch (error) {
      console.log(error);
      toast.error("Error", error.message);
    } finally {
      setExportLoading(false);
    }
  };

  // =======================
  // Material React Table Config
  // =======================
  const table = useMaterialReactTable({
    columns: columnsConfig,
    data,

    enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    enableColumnOrdering: true,
    enableStickyFooter: true,
    enableStickyHeader: true,

    initialState: { showColumnFilters: true },

    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,

    muiToolbarAlertBannerProps: isError
      ? { color: "error", children: "Error loading data" }
      : undefined,

    // Sync table UI updates with local state
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setSelectedRows,

    rowCount: meta?.totalRowCount ?? 0,

    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
      rowSelection,
    },
    getRowId: (originalRow) => originalRow._id,
    renderToolbarInternalActions: ({ table }) => (
      <>
        {/* Bulit in action  button */}
        <MRT_ToggleFiltersButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />

        {deleteType !== "PD" && (
          <Tooltip title="Recyle Bin">
            <Link href={trashView}>
              <IconButton>
                <RecyclingIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}

        {deleteType === "PD" && (
          <Tooltip title="Recyle Bin">
            <Link href={trashView}>
              <IconButton>
                <RecyclingIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}

        {deleteType === "SD" && (
          <Tooltip title="Delete All">
            <IconButton
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              onClick={() =>
                handleDelete(Object.keys(rowSelection), deleteType)
              }
            >
              <Delete />
            </IconButton>
          </Tooltip>
        )}

        {deleteType === "PD" && (
          <>
            (
            <Tooltip title="Restore Data">
              <IconButton
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                onClick={() => handleDelete(Object.keys(rowSelection), "RSD")}
              >
                <RestoreFromTrash />
              </IconButton>
            </Tooltip>
            ) (
            <Tooltip title="Permanently Delete Data">
              <IconButton
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                onClick={() =>
                  handleDelete(Object.keys(rowSelection), deleteType)
                }
              >
                <DeleteForever />
              </IconButton>
            </Tooltip>
            )
          </>
        )}
      </>
    ),
    enableRowActions: true,
    positionActionsColumn: last,
    renderRowActionMenuItems: ({ row }) =>
      createAction(row, deleteType, handleDelete),

    renderTopToolbarCustomActions: ({ table }) => (
      <Tooltip>
        <ButtonLoading
          loading={exportLoading}
          onClick={() => handleExport(table.getSelectedRowModel().rows)}
        >
          <SaveAlt /> Export
        </ButtonLoading>
      </Tooltip>
    ),
  });

  // =======================
  // Render
  // =======================
  return <div></div>;
};

export default DataTable;

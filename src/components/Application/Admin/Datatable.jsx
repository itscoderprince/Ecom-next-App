'use client'

import { Tooltip, IconButton } from "@mui/material";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deletePayload, setDeletePayload] = useState(null);

  const deleteMutation = useDeleteMutation(queryKey, deleteEndPoint);

  // =======================
  // API Query (React Query)
  // =======================
  const {
    data: { data = [], meta } = {},
    isError,
    error,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: [queryKey, { columnFilters, globalFilter, sorting, pagination }],

    queryFn: async () => {
      const apiUrl = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);

      apiUrl.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      apiUrl.searchParams.set("size", `${pagination.pageSize}`);
      apiUrl.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      apiUrl.searchParams.set("globalFilter", globalFilter ?? "");
      apiUrl.searchParams.set("sorting", JSON.stringify(sorting ?? []));
      apiUrl.searchParams.set("deleteType", deleteType);

      const { data: response } = await axios.get(apiUrl.href);
      return response;
    },

    placeholderData: keepPreviousData,
  });

  const handleDelete = (ids, type) => {
    setDeletePayload({ ids, type });
    setOpenDialog(true);
  };

  const onConfirmDelete = () => {
    if (deletePayload) {
      deleteMutation.mutate({
        ids: deletePayload.ids,
        deleteType: deletePayload.type,
      });
      setRowSelection({});
      setOpenDialog(false);
      setDeletePayload(null);
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
        csv = generateCsv(csvConfig)(response.data);
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
    enableGlobalFilter: true, // Explicitly enable global filter
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
      ? { color: "error", children: error?.message || "Error loading data" }
      : undefined,

    // Sync table UI updates with local state
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,

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
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ToggleFiltersButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />

        {trashView && deleteType !== "PD" && (
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
          </>
        )}
      </>
    ),
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => (
      <div className="flex items-center gap-2">
        {createAction(row, deleteType, handleDelete)}
      </div>
    ),

    renderTopToolbarCustomActions: ({ table }) => (
      <Tooltip title="Export Data">
        <ButtonLoading
          loading={exportLoading}
          text={<> <SaveAlt fontSize="24" /> Export</>}
          onClick={() => handleExport(table.getSelectedRowModel().rows)}
        />

      </Tooltip>
    ),
  });

  // =======================
  // Render
  // =======================
  return (
    <>
      <MaterialReactTable table={table} />
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <DeleteForever /> Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deletePayload?.type === "PD" ? (
                <span>
                  This action cannot be undone. This will <b>permanently delete</b> the selected data from our servers.
                </span>
              ) : (
                <span>
                  This action will move the selected data to the <b>trash bin</b>. You can restore it later if needed.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DataTable;

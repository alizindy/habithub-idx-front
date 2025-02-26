"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useQuery } from "@tanstack/react-query";
import { viewModuleFunction } from "@/lib/view_get_all_campaign";

interface Campaign {
  campaign_id: string;
  name: string;
  max_participant: number;
  reward_per_submit: number;
  reward_pool: number;
}

// ✅ **Define Columns for TanStack Table (Converted from DataGrid)**
const columns: ColumnDef<Campaign>[] = [
  { accessorKey: "campaign_id", header: "ID", cell: (info) => info.getValue() },
  { accessorKey: "name", header: "Campaign Name", cell: (info) => info.getValue() },
  { accessorKey: "max_participant", header: "Max Participants", cell: (info) => info.getValue() },
  { accessorKey: "reward_per_submit", header: "Reward/Submit", cell: (info) => info.getValue() },
  { accessorKey: "reward_pool", header: "Reward Pool", cell: (info) => info.getValue() },
];

export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "campaign_id", desc: false },
  ]);
  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // ✅ **Fetch campaign data from API**
  const fetchCampaignData = async (): Promise<Campaign[]> => {
    try {
      const data = await viewModuleFunction(); // Fetch campaign data
      return data?.length > 0 ? data[0] : [];
    } catch (error) {
      console.error("Error fetching campaign data:", error);
      return [];
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["campaigns", pageIndex, pageSize, sorting],
    queryFn: fetchCampaignData,
  });

  const pagination = React.useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: data || [],
    columns,
    state: { sorting, pagination },
    pageCount: Math.ceil((data?.length || 0) / pageSize),
    enableRowSelection: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} totalItems={data?.length || 0} />
    </div>
  );
}

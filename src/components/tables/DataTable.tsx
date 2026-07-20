import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import type { Column } from "@/types/common";
import { cn } from "@/lib/utils";

export interface DataTableProps<TRow> {
  columns: Column<TRow>[];
  rows: TRow[];
  loading?: boolean;
  getRowKey: (row: TRow) => string | number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

export function DataTable<TRow>({
  columns,
  rows,
  loading,
  getRowKey,
  emptyTitle,
  emptyDescription,
  emptyAction,
}: DataTableProps<TRow>) {
  if (loading) {
    return <LoadingSkeleton rows={6} />;
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? "No results found"}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key} className={c.headerClassName}>
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowKey(row)}>
              {columns.map((c) => (
                <TableCell key={c.key} className={cn(c.cellClassName)}>
                  {c.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

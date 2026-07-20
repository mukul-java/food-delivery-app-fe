import type { ReactNode } from "react";

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface TableQueryParams<TStatus extends string = string> extends PaginationParams {
  search: string;
  status: TStatus | "ALL";
}

export interface Column<TRow> {
  key: string;
  header: ReactNode;
  cell: (row: TRow) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

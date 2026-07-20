import { useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/constants";

export function usePagination(initialPage = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(initialPage);
  return { page, setPage, pageSize };
}

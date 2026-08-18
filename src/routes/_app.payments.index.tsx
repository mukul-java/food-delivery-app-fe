import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { paymentsService } from "@/services/paymentsService";
import type { PaymentResponse, PaymentStatus } from "@/types/payment";
import { PageHeader } from "@/components/PageHeader";
import { FilterPanel } from "@/components/common/FilterPanel";
import { DataPagination } from "@/components/DataPagination";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  DEFAULT_PAGE_SIZE,
  PAYMENT_STATUS_OPTIONS,
} from "@/constants/tables";
import { formatDateTime } from "@/utils/formatDate";

export const Route = createFileRoute("/_app/payments/")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const [items, setItems] = useState<PaymentResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PaymentStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await paymentsService.list({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      search,
      status,
    });
    setItems(res.data);
    setTotal(res.total);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div>
      <PageHeader title="Payments" description="All transactions across the platform" />
      <Card>
        <CardContent className="p-6">
          <FilterPanel
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search payment, order, user..."
            statusValue={status}
            onStatusChange={(v) => setStatus(v as PaymentStatus | "ALL")}
            statusOptions={PAYMENT_STATUS_OPTIONS}
          />

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">Payment ID</TableHead>
                    <TableHead scope="col">Order ID</TableHead>
                    <TableHead scope="col">User ID</TableHead>
                    <TableHead scope="col">Amount</TableHead>
                    <TableHead scope="col">Currency</TableHead>
                    <TableHead scope="col">Method</TableHead>
                    <TableHead scope="col">Gateway</TableHead>
                    <TableHead scope="col">Status</TableHead>
                    <TableHead scope="col">Created</TableHead>
                    <TableHead scope="col" className="text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No payments found
                      </TableCell>
                    </TableRow>
                  )}
                  {items.map((p) => (
                    <TableRow key={p.paymentId}>
                      <TableCell className="font-medium">{p.paymentId}</TableCell>
                      <TableCell>{p.orderId}</TableCell>
                      <TableCell className="font-mono text-xs">{p.userId}</TableCell>
                      <TableCell>{p.amount.toFixed(2)}</TableCell>
                      <TableCell>{p.paymentMethod}</TableCell>
                      <TableCell>
                        <StatusBadge status={p.paymentStatus || p.status || "COMPLETED"} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(p.transactionTimestamp)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link to="/payments/$id" params={{ id: p.paymentId }}>
                            Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4">
            <DataPagination
              page={page}
              pageSize={DEFAULT_PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

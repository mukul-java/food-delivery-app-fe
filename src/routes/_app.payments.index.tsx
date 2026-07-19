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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  paymentsService,
  type PaymentResponseDto,
  type PaymentStatus,
} from "@/services/paymentsService";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { DataPagination } from "@/components/DataPagination";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export const Route = createFileRoute("/_app/payments/")({
  component: PaymentsPage,
});

const STATUS_OPTIONS: PaymentStatus[] = [
  "CREATED",
  "PENDING",
  "SUCCESS",
  "FAILED",
  "CANCELLED",
  "EXPIRED",
];

function PaymentsPage() {
  const [items, setItems] = useState<PaymentResponseDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PaymentStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await paymentsService.list({ page, pageSize: 10, search, status });
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
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search payment, order, user..."
            />
            <Select value={status} onValueChange={(v) => setStatus(v as PaymentStatus | "ALL")}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="py-8 text-center text-muted-foreground">
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
                      <TableCell>{p.currency}</TableCell>
                      <TableCell>{p.paymentMethod}</TableCell>
                      <TableCell>{p.gateway}</TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(p.createdAt).toLocaleString()}
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
            <DataPagination page={page} pageSize={10} total={total} onPageChange={setPage} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

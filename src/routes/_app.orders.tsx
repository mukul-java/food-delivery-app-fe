import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { ordersService, type OrderResponse, type OrderStatus } from "@/services/ordersService";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { DataPagination } from "@/components/DataPagination";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export const Route = createFileRoute("/_app/orders")({
  component: OrdersPage,
});

const STATUS_OPTIONS: OrderStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await ordersService.list({ page, pageSize: 10, search, status });
    setOrders(res.data);
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

  const handleCancel = async () => {
    if (confirmId == null) return;
    await ordersService.cancel(confirmId);
    toast.success(`Order #${confirmId} cancelled`);
    setConfirmId(null);
    load();
  };

  return (
    <div>
      <PageHeader title="Orders" description="Track and manage customer orders" />

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search order #, user, restaurant..."
            />
            <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus | "ALL")}>
              <SelectTrigger className="w-full sm:w-52">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace(/_/g, " ")}
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
                    <TableHead>Order #</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order Time</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Payment ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="py-8 text-center text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                  {orders.map((o) => (
                    <TableRow key={o.orderNumber}>
                      <TableCell className="font-medium">#{o.orderNumber}</TableCell>
                      <TableCell>{o.restaurantName}</TableCell>
                      <TableCell>{o.userName}</TableCell>
                      <TableCell>{o.orderItems.length}</TableCell>
                      <TableCell>${o.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <StatusBadge status={o.orderStatus} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(o.orderTime).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(o.expectedDeliveryTime).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{o.paymentId}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={
                            o.orderStatus === "CANCELLED" || o.orderStatus === "DELIVERED"
                          }
                          onClick={() => setConfirmId(o.orderNumber)}
                        >
                          Cancel
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

      <ConfirmDialog
        open={confirmId != null}
        onOpenChange={(o) => !o && setConfirmId(null)}
        title="Cancel this order?"
        description={`Order #${confirmId} will be marked as cancelled. This cannot be undone.`}
        confirmText="Yes, cancel order"
        onConfirm={handleCancel}
        destructive
      />
    </div>
  );
}

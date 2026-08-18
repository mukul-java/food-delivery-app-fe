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
import { Button } from "@/components/ui/button";
import { ordersService } from "@/services/ordersService";
import type { OrderResponse, OrderStatus } from "@/types/order";
import { PageHeader } from "@/components/PageHeader";
import { FilterPanel } from "@/components/common/FilterPanel";
import { DataPagination } from "@/components/DataPagination";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { DEFAULT_PAGE_SIZE, ORDER_STATUS_OPTIONS } from "@/constants/tables";
import { currency } from "@/utils/currency";
import { formatDateTime } from "@/utils/formatDate";

export const Route = createFileRoute("/_app/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await ordersService.list({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      search,
      status,
    });
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
    if (!confirmId) return;
    await ordersService.cancel(confirmId);
    toast.success(`Order ${confirmId} cancelled`);
    setConfirmId(null);
    load();
  };

  return (
    <div>
      <PageHeader title="Orders" description="Track and manage customer orders" />

      <Card>
        <CardContent className="p-6">
          <FilterPanel
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search order ID, user, restaurant..."
            statusValue={status}
            onStatusChange={(v) => setStatus(v as OrderStatus | "ALL")}
            statusOptions={ORDER_STATUS_OPTIONS}
          />

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">Order ID</TableHead>
                    <TableHead scope="col">Restaurant</TableHead>
                    <TableHead scope="col">User ID</TableHead>
                    <TableHead scope="col">Items</TableHead>
                    <TableHead scope="col">Total</TableHead>
                    <TableHead scope="col">Status</TableHead>
                    <TableHead scope="col">Order Time</TableHead>
                    <TableHead scope="col" className="text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                  {orders.map((o) => (
                    <TableRow key={o.orderId}>
                      <TableCell className="font-medium">
                        {o.orderId}
                      </TableCell>
                      <TableCell>{o.restaurantId}</TableCell>
                      <TableCell>{o.userId}</TableCell>
                      <TableCell>{o.items?.length ?? "—"}</TableCell>
                      <TableCell>{currency(o.totalAmount)}</TableCell>
                      <TableCell>
                        <StatusBadge status={o.orderStatus} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(o.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={
                            o.orderStatus === "CANCELLED" ||
                            o.orderStatus === "DELIVERED"
                          }
                          onClick={() => setConfirmId(o.orderId)}
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
            <DataPagination
              page={page}
              pageSize={DEFAULT_PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmId != null}
        onOpenChange={(o) => !o && setConfirmId(null)}
        title="Cancel this order?"
        description={`Order ${confirmId} will be marked as cancelled. This cannot be undone.`}
        confirmText="Yes, cancel order"
        onConfirm={handleCancel}
        destructive
      />
    </div>
  );
}

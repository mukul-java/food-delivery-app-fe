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
import { Input } from "@/components/ui/input";
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
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/constants/roles";

export const Route = createFileRoute("/_app/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const { user } = useAuth();
  const userRole = user?.role || user?.userRole;
  const isCustomer = userRole === ROLES.CUSTOMER;

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterUserId, setFilterUserId] = useState<string>("");
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      // Determine target user ID filter:
      // If logged in user is a CUSTOMER, restrict automatically to their user ID.
      // If ADMIN / STAFF / OWNER, allow filtering by explicit filterUserId if provided.
      const targetUserId = isCustomer ? user?.id : (filterUserId ? filterUserId : undefined);

      let res;
      if (isCustomer && user?.id) {
        // Call GET /api/v1/order/user/{userId}?status={status}&page=0&pageSize=10
        res = await ordersService.getUserOrders(user.id, {
          page,
          pageSize: DEFAULT_PAGE_SIZE,
          status,
        });
      } else {
        // Call GET /api/v1/order?userId={userId}&status={status}&page=0&pageSize=10
        res = await ordersService.list({
          userId: targetUserId,
          page,
          pageSize: DEFAULT_PAGE_SIZE,
          search,
          status,
        });
      }

      setOrders(res.data);
      setTotal(res.total);
    } catch (err) {
      toast.error((err as Error).message || "Failed to load orders");
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, filterUserId]);

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
    try {
      await ordersService.cancel(confirmId);
      toast.success(`Order ${confirmId} cancelled`);
      setConfirmId(null);
      load();
    } catch (err) {
      toast.error((err as Error).message || "Failed to cancel order");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isCustomer ? "My Orders" : "Orders Management"}
        description={
          isCustomer
            ? "View and track your order history"
            : "Filter orders by customer User ID and status progression"
        }
      />

      <Card className="shadow-xs border-border/80">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <FilterPanel
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search order ID or restaurant..."
              statusValue={status}
              onStatusChange={(v) => {
                setPage(1);
                setStatus(v as OrderStatus | "ALL");
              }}
              statusOptions={ORDER_STATUS_OPTIONS}
            />

            {!isCustomer && (
              <div className="flex items-center gap-2 min-w-[200px]">
                <Input
                  type="text"
                  placeholder="Filter by User ID..."
                  value={filterUserId}
                  onChange={(e) => {
                    setPage(1);
                    setFilterUserId(e.target.value);
                  }}
                  className="h-10 text-sm"
                />
              </div>
            )}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead scope="col" className="font-semibold">Order ID</TableHead>
                    <TableHead scope="col" className="font-semibold">Restaurant ID</TableHead>
                    <TableHead scope="col" className="font-semibold">User ID</TableHead>
                    <TableHead scope="col" className="font-semibold">Items</TableHead>
                    <TableHead scope="col" className="font-semibold">Total Amount</TableHead>
                    <TableHead scope="col" className="font-semibold">Status</TableHead>
                    <TableHead scope="col" className="font-semibold">Order Time</TableHead>
                    <TableHead scope="col" className="text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-12 text-center text-muted-foreground"
                      >
                        No orders found matching the filter criteria.
                      </TableCell>
                    </TableRow>
                  )}
                  {orders.map((o) => {
                    const orderTimestamp = o.orderTime || o.createdAt;
                    return (
                      <TableRow key={o.orderId} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono font-medium text-xs">
                          {o.orderId}
                        </TableCell>
                        <TableCell className="font-medium text-xs">
                          Restaurant #{o.restaurantId}
                        </TableCell>
                        <TableCell className="font-medium text-xs">
                          User #{o.userId}
                        </TableCell>
                        <TableCell>{o.items?.length ?? 1} item(s)</TableCell>
                        <TableCell className="font-semibold">{currency(o.totalAmount)}</TableCell>
                        <TableCell>
                          <StatusBadge status={o.orderStatus} />
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {orderTimestamp ? formatDateTime(orderTimestamp) : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                            disabled={
                              o.orderStatus === "CANCELLED" ||
                              o.orderStatus === "DELIVERED" ||
                              o.orderStatus === "COMPLETED"
                            }
                            onClick={() => setConfirmId(o.orderId)}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="pt-2">
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
        description={`Order ${confirmId} will be marked as CANCELLED. This action cannot be undone.`}
        confirmText="Yes, cancel order"
        onConfirm={handleCancel}
        destructive
      />
    </div>
  );
}

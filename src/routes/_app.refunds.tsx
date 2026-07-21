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
import { refundsService, type Refund, type RefundStatus } from "@/services/refundsService";
import { PageHeader } from "@/components/PageHeader";
import { FilterPanel } from "@/components/common/FilterPanel";
import { DataPagination } from "@/components/DataPagination";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  DEFAULT_PAGE_SIZE,
  REFUND_STATUS_OPTIONS,
} from "@/constants/tables";
import { currency } from "@/utils/currency";

export const Route = createFileRoute("/_app/refunds")({
  component: RefundsPage,
});

type Action = { type: "approve" | "reject"; id: string } | null;

function RefundsPage() {
  const [items, setItems] = useState<Refund[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RefundStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<Action>(null);

  const load = async () => {
    setLoading(true);
    const res = await refundsService.list({
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

  const handleAction = async () => {
    if (!action) return;
    if (action.type === "approve") {
      await refundsService.approve(action.id);
      toast.success(`Refund ${action.id} approved`);
    } else {
      await refundsService.reject(action.id);
      toast.success(`Refund ${action.id} rejected`);
    }
    setAction(null);
    load();
  };

  return (
    <div>
      <PageHeader title="Refunds" description="Review and process refund requests" />
      <Card>
        <CardContent className="p-6">
          <FilterPanel
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search refunds..."
            statusValue={status}
            onStatusChange={(v) => setStatus(v as RefundStatus | "ALL")}
            statusOptions={REFUND_STATUS_OPTIONS}
          />

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">Refund ID</TableHead>
                    <TableHead scope="col">Payment</TableHead>
                    <TableHead scope="col">Order</TableHead>
                    <TableHead scope="col">Customer</TableHead>
                    <TableHead scope="col">Amount</TableHead>
                    <TableHead scope="col">Reason</TableHead>
                    <TableHead scope="col">Status</TableHead>
                    <TableHead scope="col" className="text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No refunds found
                      </TableCell>
                    </TableRow>
                  )}
                  {items.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.id}</TableCell>
                      <TableCell>{r.paymentId}</TableCell>
                      <TableCell>{r.orderId}</TableCell>
                      <TableCell>{r.customer}</TableCell>
                      <TableCell>{currency(r.amount)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {r.reason}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={r.status !== "REQUESTED"}
                            onClick={() =>
                              setAction({ type: "approve", id: r.id })
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={r.status !== "REQUESTED"}
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              setAction({ type: "reject", id: r.id })
                            }
                          >
                            Reject
                          </Button>
                        </div>
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
        open={!!action}
        onOpenChange={(o) => !o && setAction(null)}
        title={action?.type === "approve" ? "Approve refund?" : "Reject refund?"}
        description={
          action
            ? `Refund ${action.id} will be ${
                action.type === "approve" ? "approved" : "rejected"
              }.`
            : ""
        }
        confirmText={action?.type === "approve" ? "Approve" : "Reject"}
        destructive={action?.type === "reject"}
        onConfirm={handleAction}
      />
    </div>
  );
}

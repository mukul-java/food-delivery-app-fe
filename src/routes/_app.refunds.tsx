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
import { refundsService, type Refund, type RefundStatus } from "@/services/refundsService";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { DataPagination } from "@/components/DataPagination";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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
    const res = await refundsService.list({ page, pageSize: 10, search, status });
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
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar value={search} onChange={setSearch} placeholder="Search refunds..." />
            <Select value={status} onValueChange={(v) => setStatus(v as RefundStatus | "ALL")}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="REQUESTED">Requested</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
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
                    <TableHead>Refund ID</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
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
                      <TableCell>${r.amount.toFixed(2)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{r.reason}</TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={r.status !== "REQUESTED"}
                            onClick={() => setAction({ type: "approve", id: r.id })}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={r.status !== "REQUESTED"}
                            className="text-destructive hover:text-destructive"
                            onClick={() => setAction({ type: "reject", id: r.id })}
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
            <DataPagination page={page} pageSize={10} total={total} onPageChange={setPage} />
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!action}
        onOpenChange={(o) => !o && setAction(null)}
        title={action?.type === "approve" ? "Approve refund?" : "Reject refund?"}
        description={
          action
            ? `Refund ${action.id} will be ${action.type === "approve" ? "approved" : "rejected"}.`
            : ""
        }
        confirmText={action?.type === "approve" ? "Approve" : "Reject"}
        destructive={action?.type === "reject"}
        onConfirm={handleAction}
      />
    </div>
  );
}

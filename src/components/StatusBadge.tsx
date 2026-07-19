import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MAP: Record<string, string> = {
  // Orders
  PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  PREPARING: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  DELIVERED: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  CANCELLED: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  // Payments
  SUCCESS: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  FAILED: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  REFUNDED: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  // Refunds
  REQUESTED: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  APPROVED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  REJECTED: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  COMPLETED: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="secondary" className={cn("font-medium", MAP[status] ?? "")}>
      {status}
    </Badge>
  );
}

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MAP: Record<string, string> = {
  // Orders & Common
  PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  ACCEPTED: "bg-teal-100 text-teal-800 hover:bg-teal-100",
  PLACED: "bg-slate-100 text-slate-800 hover:bg-slate-100",
  CONFIRMED: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  PREPARING: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  OUT_FOR_DELIVERY: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
  DELIVERED: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  CANCELLED: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  // Payments
  CREATED: "bg-slate-100 text-slate-800 hover:bg-slate-100",
  SUCCESS: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  FAILED: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  EXPIRED: "bg-zinc-200 text-zinc-800 hover:bg-zinc-200",
  REFUNDED: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  // Refunds
  REQUESTED: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  APPROVED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  REJECTED: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  COMPLETED: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="secondary" className={cn("whitespace-nowrap font-medium", MAP[status] ?? "")}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

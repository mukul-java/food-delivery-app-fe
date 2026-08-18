import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
}) {
  return (
    <Card className="card-hover border-border/80 shadow-xs overflow-hidden">
      <CardContent className="flex items-center justify-between p-6">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl p-2.5 shadow-xs",
            iconClassName?.includes("bg-")
              ? ""
              : "bg-amber-500/10 text-amber-600"
          )}
        >
          <Icon className={cn("h-6 w-6 shrink-0", iconClassName)} aria-hidden />
        </div>
      </CardContent>
    </Card>
  );
}

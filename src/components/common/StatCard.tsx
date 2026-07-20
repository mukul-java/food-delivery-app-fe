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
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
        <Icon className={cn("h-8 w-8 shrink-0", iconClassName)} aria-hidden />
      </CardContent>
    </Card>
  );
}

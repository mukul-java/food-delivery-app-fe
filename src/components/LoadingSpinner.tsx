import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingSpinner({
  className,
  size = 24,
  label,
}: {
  className?: string;
  size?: number;
  label?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center gap-2 py-6 text-muted-foreground", className)}>
      <Loader2 className="animate-spin" size={size} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

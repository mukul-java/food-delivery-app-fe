import { Link, useRouterState } from "@tanstack/react-router";
import { UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV } from "@/constants/navigation";
import { APP_LABELS } from "@/constants/labels";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      aria-label="Primary"
      className="flex h-full w-64 flex-col border-r bg-sidebar"
    >
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <UtensilsCrossed className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">
            {APP_LABELS.APP_NAME}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {APP_LABELS.APP_TAGLINE}
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {PRIMARY_NAV.map((item) => {
          const active =
            pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4 text-xs text-muted-foreground">
        {APP_LABELS.COPYRIGHT}
      </div>
    </aside>
  );
}

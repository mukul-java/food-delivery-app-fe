import { Link, useRouterState } from "@tanstack/react-router";
import { UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV, RESTAURANT_OWNER_NAV } from "@/constants/navigation";
import { useAuth } from "@/context/AuthContext";
import { APP_LABELS } from "@/constants/labels";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  
  const navItems = user?.role === "RESTAURANT_OWNER" ? RESTAURANT_OWNER_NAV : PRIMARY_NAV;

  return (
    <aside
      aria-label="Primary"
      className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar shadow-xs"
    >
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-xs">
          <UtensilsCrossed className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-bold tracking-tight text-sidebar-foreground">
            {APP_LABELS.APP_NAME}
          </p>
          <p className="truncate text-[10px] text-muted-foreground font-medium">Food & Delivery</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1.5 p-3">
        {navItems.map((item) => {
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
                "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-xs"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className={cn("h-4.5 w-4.5 shrink-0", active ? "text-sidebar-primary-foreground" : "text-muted-foreground")} aria-hidden />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4 text-xs text-sidebar-foreground/50">
        {APP_LABELS.COPYRIGHT}
      </div>
    </aside>
  );
}

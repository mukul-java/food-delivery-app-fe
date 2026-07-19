import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/refunds", label: "Refunds", icon: RotateCcw },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <UtensilsCrossed className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground">FoodDash</p>
          <p className="text-xs text-muted-foreground">Admin Console</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} FoodDash
      </div>
    </aside>
  );
}

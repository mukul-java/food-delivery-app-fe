import {
  createFileRoute,
  Outlet,
  useNavigate,
  Link,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { ShoppingCart, MapPin, Package, LogOut, UtensilsCrossed } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/_shop")({
  component: ShopLayout,
});

function ShopLayout() {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate({ to: ROUTES.LOGIN });
  }, [isAuthenticated, loading, navigate]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <LoadingSpinner label="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-orange-50 via-amber-50 to-white">
      <TopNav
        username={user?.username ?? "Guest"}
        onLogout={() => {
          logout();
          navigate({ to: ROUTES.LOGIN });
        }}
      />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-orange-100 bg-white/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FoodDash — hungry? we got you.
      </footer>
    </div>
  );
}

function TopNav({ username, onLogout }: { username: string; onLogout: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { count } = useCart();

  const links = [
    { to: "/restaurants", label: "Restaurants", icon: UtensilsCrossed },
    { to: "/track", label: "Track Order", icon: Package },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-orange-100 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/restaurants" className="flex items-center gap-2 font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <UtensilsCrossed className="h-5 w-5" aria-hidden />
          </div>
          <span className="text-lg tracking-tight">FoodDash</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-white/25" : "hover:bg-white/15",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/cart"
            className="relative flex h-10 items-center gap-2 rounded-md bg-white/20 px-3 text-sm font-medium hover:bg-white/30"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <Badge className="ml-1 bg-white text-orange-600 hover:bg-white">
                {count}
              </Badge>
            )}
          </Link>
          <div className="hidden items-center gap-1 rounded-md bg-white/15 px-2 py-1 text-xs sm:flex">
            <MapPin className="h-3 w-3" aria-hidden />
            <span>{username}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onLogout}
            className="h-9 gap-1 text-white hover:bg-white/20 hover:text-white"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

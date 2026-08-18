import { Menu, LogOut, Bell, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { initials as toInitials } from "@/utils/string";
import { ROUTES } from "@/constants/routes";

export function Header({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { user, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate({ to: ROUTES.LOGIN });
  };

  const userInitials = toInitials(user?.username);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 backdrop-blur-md px-4 sm:px-6 shadow-xs">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenSidebar}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </Button>

      <div className="flex-1" />

      <ThemeToggle />

      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-accent transition-colors"
        onClick={openCart}
        aria-label="Shopping Cart"
      >
        <ShoppingCart className="h-5 w-5 text-foreground" aria-hidden />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Button>

      <Button variant="ghost" size="icon" aria-label="Notifications" className="hover:bg-accent">
        <Bell className="h-5 w-5 text-foreground" aria-hidden />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2 hover:bg-accent"
            aria-label="Account menu"
          >
            <Avatar className="h-8 w-8 ring-2 ring-border">
              <AvatarFallback className="bg-muted text-foreground font-bold">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="hidden min-w-0 text-left sm:block">
              <p className="truncate text-sm font-medium leading-none">
                {user?.username}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {(user?.role || user?.userRole || "").replace("ROLE_", "").replace("_", " ")}
              </p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <p className="truncate text-sm font-semibold">{user?.username}</p>
            {user?.email && <p className="truncate text-xs text-muted-foreground font-normal">{user.email}</p>}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={ROUTES.PROFILE}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" aria-hidden />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

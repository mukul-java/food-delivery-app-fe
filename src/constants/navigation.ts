import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  User,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { to: ROUTES.ORDERS, label: "Orders", icon: ShoppingBag },
  { to: ROUTES.PAYMENTS, label: "Payments", icon: CreditCard },
  { to: ROUTES.REFUNDS, label: "Refunds", icon: RotateCcw },
  { to: ROUTES.PROFILE, label: "Profile", icon: User },
] as const;

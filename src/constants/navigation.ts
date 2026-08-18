import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  User,
  Store,
  Truck,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes";
import { ROLES, Role } from "./roles";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const CUSTOMER_NAV: readonly NavItem[] = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { to: ROUTES.RESTAURANTS, label: "Explore Food", icon: Store },
  { to: ROUTES.ORDERS, label: "My Orders", icon: ShoppingBag },
  { to: ROUTES.PAYMENTS, label: "Payments", icon: CreditCard },
  { to: ROUTES.REFUNDS, label: "Refunds", icon: RotateCcw },
  { to: ROUTES.PROFILE, label: "Profile", icon: User },
] as const;

export const RESTAURANT_OWNER_NAV: readonly NavItem[] = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { to: ROUTES.MY_RESTAURANTS, label: "My Restaurants", icon: Store },
  { to: ROUTES.ORDERS, label: "Kitchen Orders", icon: ShoppingBag },
  { to: ROUTES.PAYMENTS, label: "Payments", icon: CreditCard },
  { to: ROUTES.PROFILE, label: "Profile", icon: User },
] as const;

export const DELIVERY_AGENT_NAV: readonly NavItem[] = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { to: ROUTES.ORDERS, label: "Deliveries Queue", icon: Truck },
  { to: ROUTES.PROFILE, label: "Profile", icon: User },
] as const;

export const ADMIN_NAV: readonly NavItem[] = [
  { to: ROUTES.DASHBOARD, label: "Admin Dashboard", icon: LayoutDashboard },
  { to: ROUTES.RESTAURANTS, label: "All Restaurants", icon: Store },
  { to: ROUTES.MY_RESTAURANTS, label: "Manage Restaurants", icon: Store },
  { to: ROUTES.ORDERS, label: "All Orders", icon: ShoppingBag },
  { to: ROUTES.PAYMENTS, label: "All Payments", icon: CreditCard },
  { to: ROUTES.REFUNDS, label: "Refund Requests", icon: RotateCcw },
  { to: ROUTES.PROFILE, label: "Profile", icon: User },
] as const;

export const PRIMARY_NAV = CUSTOMER_NAV;

export function getNavForRole(role?: string | null): readonly NavItem[] {
  if (!role) return CUSTOMER_NAV;
  const cleanRole = role.startsWith("ROLE_") ? role.substring(5) : role;
  switch (cleanRole) {
    case ROLES.ADMIN:
      return ADMIN_NAV;
    case ROLES.RESTAURANT_OWNER:
      return RESTAURANT_OWNER_NAV;
    case ROLES.DELIVERY_AGENT:
    case ROLES.DELIVERY_PARTNER:
      return DELIVERY_AGENT_NAV;
    case ROLES.CUSTOMER:
    default:
      return CUSTOMER_NAV;
  }
}

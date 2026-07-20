export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  ORDERS: "/orders",
  PAYMENTS: "/payments",
  PAYMENT_DETAILS: "/payments/$id",
  REFUNDS: "/refunds",
  PROFILE: "/profile",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

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
  RESTAURANTS: "/restaurants",
  RESTAURANTS_DETAILS: "/restaurants/$id",
  CHECKOUT: "/checkout",
  MY_RESTAURANTS: "/my-restaurants",
  MY_RESTAURANTS_DETAILS: "/my-restaurants/$id",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

import type { OrderStatus } from "@/services/ordersService";
import type { PaymentStatus } from "@/services/paymentsService";
import type { RefundStatus } from "@/services/refundsService";

export const DEFAULT_PAGE_SIZE = 10;

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = [
  "CREATED",
  "PENDING",
  "SUCCESS",
  "FAILED",
  "CANCELLED",
  "EXPIRED",
];

export const REFUND_STATUS_OPTIONS: RefundStatus[] = [
  "REQUESTED",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
];

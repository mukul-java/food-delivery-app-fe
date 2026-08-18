import { Address } from "./auth";

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PLACED"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  foodItemId: number;
  foodName: string;
  quantity: number;
  price: number;
}

export interface OrderRequest {
  userId: number;
  restaurantId: number;
  deliveryAddress: Address;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod?: string;
}

export interface OrderResponse {
  orderId: string;
  userId: number;
  restaurantId: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  createdAt?: string;
  orderTime?: string;
  deliveryAddress?: Address;
  items?: OrderItem[];
}

export interface OrderStats {
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

// Backend Spring paginated response shape
export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast?: boolean;
}

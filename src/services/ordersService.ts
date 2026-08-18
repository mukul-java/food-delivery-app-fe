import api from "./api";
import type { OrderRequest, OrderResponse, OrderStats, OrderStatus, PagedResponse } from "@/types/order";

// Adapter: converts backend PagedResponse → internal Paginated shape used by the UI
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type { OrderStatus, OrderResponse, OrderRequest };

function adaptPaged<T>(res: PagedResponse<T>, page: number, pageSize: number): Paginated<T> {
  return {
    data: res.content,
    total: res.totalElements,
    page,
    pageSize,
  };
}

export const ordersService = {
  async list(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: OrderStatus | "ALL";
  }): Promise<Paginated<OrderResponse>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const response = await api.get<PagedResponse<OrderResponse>>("/order", {
      params: {
        page,
        pageSize,
        search: params.search || undefined,
        status: params.status !== "ALL" ? params.status : undefined,
      },
    });
    return adaptPaged(response.data, page, pageSize);
  },

  async get(orderId: string): Promise<OrderResponse> {
    const response = await api.get<OrderResponse>(`/order/${orderId}`);
    return response.data;
  },

  async create(orderData: OrderRequest): Promise<OrderResponse> {
    const response = await api.post<OrderResponse>("/order", orderData);
    return response.data;
  },

  async checkout(checkoutData: { userId: string | number; address: any }): Promise<OrderResponse> {
    const response = await api.post<OrderResponse | { success: boolean; data: OrderResponse }>(
      "/order/checkout",
      checkoutData
    );
    const data = "data" in response.data && (response.data as { data: OrderResponse }).data
      ? (response.data as { data: OrderResponse }).data
      : (response.data as OrderResponse);
    return data;
  },

  async updateStatus(orderId: string, orderStatus: OrderStatus): Promise<void> {
    await api.put("/order/status", null, {
      params: { orderId, orderStatus },
    });
  },

  async cancel(orderId: string): Promise<void> {
    await api.put("/order/status", null, {
      params: { orderId, orderStatus: "CANCELLED" },
    });
  },

  async stats(): Promise<{
    total: number;
    delivered: number;
    pending: number;
    revenue: number;
  }> {
    const response = await api.get<OrderStats>("/order/stats");
    const s = response.data;
    return {
      total: s.totalOrders,
      delivered: s.deliveredOrders,
      pending: s.pendingOrders,
      revenue: s.totalRevenue,
    };
  },

  _api: api,
};

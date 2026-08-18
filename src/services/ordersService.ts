import api from "./api";
import type { OrderRequest, OrderResponse, OrderStats, OrderStatus, PagedResponse } from "@/types/order";

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type { OrderStatus, OrderResponse, OrderRequest };

function adaptPaged<T>(res: PagedResponse<T> | T[], page: number, pageSize: number): Paginated<T> {
  if (Array.isArray(res)) {
    return {
      data: res,
      total: res.length,
      page,
      pageSize,
    };
  }
  return {
    data: res?.content || [],
    total: res?.totalElements ?? (res?.content?.length || 0),
    page,
    pageSize,
  };
}

export const ordersService = {
  /**
   * Fetches paginated orders with optional userId and status filter.
   * GET /api/v1/order?userId={userId}&status={status}&page=0&pageSize=10
   */
  async list(params: {
    userId?: string | number;
    status?: OrderStatus | "ALL";
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<Paginated<OrderResponse>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const backendPage = Math.max(0, page - 1);

    const response = await api.get<PagedResponse<OrderResponse>>("/order", {
      params: {
        userId: params.userId || undefined,
        status: params.status && params.status !== "ALL" ? params.status : undefined,
        page: backendPage,
        pageSize,
        search: params.search || undefined,
      },
    });
    return adaptPaged(response.data, page, pageSize);
  },

  /**
   * Fetches paginated orders for a specific user.
   * GET /api/v1/order/user/{userId}?status={status}&page=0&pageSize=10
   */
  async getUserOrders(
    userId: string | number,
    params?: {
      status?: OrderStatus | "ALL";
      page?: number;
      pageSize?: number;
    }
  ): Promise<Paginated<OrderResponse>> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const backendPage = Math.max(0, page - 1);

    const response = await api.get<PagedResponse<OrderResponse>>(`/order/user/${userId}`, {
      params: {
        status: params?.status && params?.status !== "ALL" ? params.status : undefined,
        page: backendPage,
        pageSize,
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
    const data =
      "data" in response.data && (response.data as { data: OrderResponse }).data
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

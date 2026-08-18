import api from "./api";
import type { PagedResponse } from "@/types/order";
import type { Paginated } from "./ordersService";

export type RefundStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "REQUESTED";

export interface Refund {
  refundId: string;
  orderId: string;
  userId: number;
  amount: number;
  reason: string;
  status: RefundStatus;
  requestedAt: string;
}

export interface RefundActionResponse {
  success: boolean;
  message: string;
  refundId: string;
  orderId: string;
  amount?: number;
  status: RefundStatus;
  processedAt: string;
}

function adaptPaged<T>(res: PagedResponse<T>, page: number, pageSize: number): Paginated<T> {
  return {
    data: res.content,
    total: res.totalElements,
    page,
    pageSize,
  };
}

export const refundsService = {
  async list(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: RefundStatus | "ALL";
  }): Promise<Paginated<Refund>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const response = await api.get<PagedResponse<Refund>>("/refunds", {
      params: {
        page,
        pageSize,
        search: params.search || undefined,
        status: params.status !== "ALL" ? params.status : undefined,
      },
    });
    return adaptPaged(response.data, page, pageSize);
  },

  async approve(id: string): Promise<RefundActionResponse> {
    const response = await api.post<RefundActionResponse>(`/refunds/${id}/approve`);
    return response.data;
  },

  async reject(id: string): Promise<RefundActionResponse> {
    const response = await api.post<RefundActionResponse>(`/refunds/${id}/reject`);
    return response.data;
  },

  _api: api,
};

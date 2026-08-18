import api from "./api";
import type { PaymentRequest, PaymentResponse, PaymentStatus } from "@/types/payment";
import type { PagedResponse } from "@/types/order";
import type { Paginated } from "./ordersService";

export type { PaymentStatus, PaymentResponse, PaymentRequest };

// Keep old alias so payment detail page import still works
export type PaymentResponseDto = PaymentResponse;

function adaptPaged<T>(res: PagedResponse<T>, page: number, pageSize: number): Paginated<T> {
  return {
    data: res.content,
    total: res.totalElements,
    page,
    pageSize,
  };
}

export const paymentsService = {
  async list(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: PaymentStatus | "ALL";
  }): Promise<Paginated<PaymentResponse>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const response = await api.get<PagedResponse<PaymentResponse>>("/payment", {
      params: {
        page,
        pageSize,
        search: params.search || undefined,
        status: params.status !== "ALL" ? params.status : undefined,
      },
    });
    return adaptPaged(response.data, page, pageSize);
  },

  async get(id: string): Promise<PaymentResponse> {
    const response = await api.get<PaymentResponse>(`/payment/${id}`);
    return response.data;
  },

  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await api.post<PaymentResponse | { success: boolean; data: PaymentResponse }>(
        "/payments",
        paymentData
      );
      const data = "data" in response.data && (response.data as { data: PaymentResponse }).data
        ? (response.data as { data: PaymentResponse }).data
        : (response.data as PaymentResponse);
      return data;
    } catch {
      // Fallback to /payment endpoint if /payments gateway route differs
      const response = await api.post<PaymentResponse | { success: boolean; data: PaymentResponse }>(
        "/payment",
        paymentData
      );
      const data = "data" in response.data && (response.data as { data: PaymentResponse }).data
        ? (response.data as { data: PaymentResponse }).data
        : (response.data as PaymentResponse);
      return data;
    }
  },

  _api: api,
};

import api from "./api";
import type { Paginated } from "./ordersService";

export type PaymentStatus = "CREATED" | "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "EXPIRED";
export type PaymentMethod = "CARD" | "UPI" | "NET_BANKING" | "WALLET" | "CASH";
export type PaymentGateway = "RAZORPAY" | "STRIPE" | "PAYPAL" | "PAYTM";
export type Currency = "USD" | "INR" | "EUR" | "GBP";

export interface PaymentResponseDto {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  gateway: PaymentGateway;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

const METHODS: PaymentMethod[] = ["CARD", "UPI", "NET_BANKING", "WALLET", "CASH"];
const GATEWAYS: PaymentGateway[] = ["RAZORPAY", "STRIPE", "PAYPAL", "PAYTM"];
const CURRENCIES: Currency[] = ["USD", "INR", "EUR", "GBP"];
const STATUSES: PaymentStatus[] = ["CREATED", "PENDING", "SUCCESS", "FAILED", "CANCELLED", "EXPIRED"];

const MOCK_PAYMENTS: PaymentResponseDto[] = Array.from({ length: 64 }, (_, i) => {
  const created = new Date(Date.now() - i * 5400_000);
  return {
    paymentId: `PAY-${2000 + i}`,
    orderId: String(100000 + i),
    userId: `user_${100 + (i % 12)}`,
    amount: Number(((i % 40) + 15.5).toFixed(2)),
    currency: CURRENCIES[i % CURRENCIES.length],
    paymentMethod: METHODS[i % METHODS.length],
    gateway: GATEWAYS[i % GATEWAYS.length],
    status: STATUSES[i % STATUSES.length],
    createdAt: created.toISOString(),
    updatedAt: new Date(created.getTime() + 5 * 60_000).toISOString(),
  };
});

export const paymentsService = {
  async list(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: PaymentStatus | "ALL";
  }): Promise<Paginated<PaymentResponseDto>> {
    await new Promise((r) => setTimeout(r, 300));
    const { page = 1, pageSize = 10, search = "", status = "ALL" } = params;
    let filtered = MOCK_PAYMENTS;
    if (status !== "ALL") filtered = filtered.filter((p) => p.status === status);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.paymentId.toLowerCase().includes(s) ||
          p.orderId.toLowerCase().includes(s) ||
          p.userId.toLowerCase().includes(s),
      );
    }
    const start = (page - 1) * pageSize;
    return {
      data: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  },

  async get(id: string): Promise<PaymentResponseDto | undefined> {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_PAYMENTS.find((p) => p.paymentId === id);
  },

  _api: api,
};

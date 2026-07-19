import api from "./api";
import type { Paginated } from "./ordersService";

export type PaymentStatus = "SUCCESS" | "PENDING" | "FAILED" | "REFUNDED";
export type PaymentMethod = "CARD" | "UPI" | "WALLET" | "CASH";

export interface Payment {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
  transactionRef: string;
  cardLast4?: string;
}

const METHODS: PaymentMethod[] = ["CARD", "UPI", "WALLET", "CASH"];
const STATUSES: PaymentStatus[] = ["SUCCESS", "PENDING", "FAILED", "REFUNDED"];

const MOCK_PAYMENTS: Payment[] = Array.from({ length: 64 }, (_, i) => ({
  id: `PAY-${(2000 + i).toString()}`,
  orderId: `ORD-${(1000 + i).toString()}`,
  customer: ["Alice Chen", "Bob Smith", "Carla Diaz", "Dave Kim"][i % 4],
  amount: Number(((i % 40) + 15.5).toFixed(2)),
  method: METHODS[i % METHODS.length],
  status: STATUSES[i % STATUSES.length],
  createdAt: new Date(Date.now() - i * 5400_000).toISOString(),
  transactionRef: `TXN${100000 + i}`,
  cardLast4: i % 4 === 0 ? String(1000 + (i % 9000)).padStart(4, "0") : undefined,
}));

export const paymentsService = {
  async list(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: PaymentStatus | "ALL";
  }): Promise<Paginated<Payment>> {
    await new Promise((r) => setTimeout(r, 300));
    const { page = 1, pageSize = 10, search = "", status = "ALL" } = params;
    let filtered = MOCK_PAYMENTS;
    if (status !== "ALL") filtered = filtered.filter((p) => p.status === status);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.id.toLowerCase().includes(s) ||
          p.orderId.toLowerCase().includes(s) ||
          p.customer.toLowerCase().includes(s),
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

  async get(id: string): Promise<Payment | undefined> {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_PAYMENTS.find((p) => p.id === id);
  },

  _api: api,
};

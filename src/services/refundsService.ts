import api from "./api";
import type { Paginated } from "./ordersService";

export type RefundStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "COMPLETED";

export interface Refund {
  id: string;
  paymentId: string;
  orderId: string;
  customer: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  createdAt: string;
}

const STATUSES: RefundStatus[] = ["REQUESTED", "APPROVED", "REJECTED", "COMPLETED"];
const REASONS = [
  "Wrong item delivered",
  "Order cancelled",
  "Late delivery",
  "Food quality issue",
  "Duplicate charge",
];

const MOCK_REFUNDS: Refund[] = Array.from({ length: 32 }, (_, i) => ({
  id: `REF-${(3000 + i).toString()}`,
  paymentId: `PAY-${(2000 + i).toString()}`,
  orderId: `ORD-${(1000 + i).toString()}`,
  customer: ["Alice Chen", "Bob Smith", "Carla Diaz", "Dave Kim"][i % 4],
  amount: Number(((i % 30) + 10.5).toFixed(2)),
  reason: REASONS[i % REASONS.length],
  status: STATUSES[i % STATUSES.length],
  createdAt: new Date(Date.now() - i * 7200_000).toISOString(),
}));

export const refundsService = {
  async list(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: RefundStatus | "ALL";
  }): Promise<Paginated<Refund>> {
    await new Promise((r) => setTimeout(r, 300));
    const { page = 1, pageSize = 10, search = "", status = "ALL" } = params;
    let filtered = MOCK_REFUNDS;
    if (status !== "ALL") filtered = filtered.filter((r) => r.status === status);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.id.toLowerCase().includes(s) ||
          r.orderId.toLowerCase().includes(s) ||
          r.customer.toLowerCase().includes(s),
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

  async approve(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    const r = MOCK_REFUNDS.find((x) => x.id === id);
    if (r) r.status = "APPROVED";
  },

  async reject(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    const r = MOCK_REFUNDS.find((x) => x.id === id);
    if (r) r.status = "REJECTED";
  },

  _api: api,
};

import api from "./api";

export type OrderStatus = "PENDING" | "PREPARING" | "DELIVERED" | "CANCELLED";

export interface Order {
  id: string;
  customer: string;
  restaurant: string;
  items: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

const RESTAURANTS = ["Pizza Palace", "Burger Barn", "Sushi Spot", "Taco Town", "Curry Corner"];
const CUSTOMERS = ["Alice Chen", "Bob Smith", "Carla Diaz", "Dave Kim", "Eve Johnson", "Frank Lee"];
const STATUSES: OrderStatus[] = ["PENDING", "PREPARING", "DELIVERED", "CANCELLED"];

const MOCK_ORDERS: Order[] = Array.from({ length: 87 }, (_, i) => ({
  id: `ORD-${(1000 + i).toString()}`,
  customer: CUSTOMERS[i % CUSTOMERS.length],
  restaurant: RESTAURANTS[i % RESTAURANTS.length],
  items: (i % 5) + 1,
  total: Number(((i % 40) + 12.5 + (i % 7) * 1.75).toFixed(2)),
  status: STATUSES[i % STATUSES.length],
  createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
}));

export const ordersService = {
  async list(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: OrderStatus | "ALL";
  }): Promise<Paginated<Order>> {
    await new Promise((r) => setTimeout(r, 300));
    const { page = 1, pageSize = 10, search = "", status = "ALL" } = params;
    let filtered = MOCK_ORDERS;
    if (status !== "ALL") filtered = filtered.filter((o) => o.status === status);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(s) ||
          o.customer.toLowerCase().includes(s) ||
          o.restaurant.toLowerCase().includes(s),
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

  async get(id: string): Promise<Order | undefined> {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_ORDERS.find((o) => o.id === id);
  },

  async cancel(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    const o = MOCK_ORDERS.find((x) => x.id === id);
    if (o) o.status = "CANCELLED";
  },

  async stats() {
    await new Promise((r) => setTimeout(r, 200));
    const total = MOCK_ORDERS.length;
    const delivered = MOCK_ORDERS.filter((o) => o.status === "DELIVERED").length;
    const pending = MOCK_ORDERS.filter((o) => o.status === "PENDING").length;
    const revenue = MOCK_ORDERS.filter((o) => o.status === "DELIVERED").reduce(
      (s, o) => s + o.total,
      0,
    );
    return { total, delivered, pending, revenue };
  },

  _api: api,
};

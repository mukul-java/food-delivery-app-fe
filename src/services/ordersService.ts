import api from "./api";

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItemDto {
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderResponse {
  orderNumber: number;
  restaurantName: string;
  userName: string;
  orderItems: OrderItemDto[];
  totalAmount: number;
  orderTime: string;
  orderStatus: OrderStatus;
  expectedDeliveryTime: string;
  address: Address;
  paymentId: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

const RESTAURANTS = ["Pizza Palace", "Burger Barn", "Sushi Spot", "Taco Town", "Curry Corner"];
const USERS = ["alice.chen", "bob.smith", "carla.diaz", "dave.kim", "eve.j", "frank.lee"];
const STATUSES: OrderStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const MOCK_ORDERS: OrderResponse[] = Array.from({ length: 87 }, (_, i) => {
  const created = new Date(Date.now() - i * 3600_000);
  return {
    orderNumber: 100000 + i,
    restaurantName: RESTAURANTS[i % RESTAURANTS.length],
    userName: USERS[i % USERS.length],
    orderItems: Array.from({ length: (i % 3) + 1 }, (_, j) => ({
      foodItemId: `FI-${i}-${j}`,
      name: ["Margherita", "Cheeseburger", "California Roll", "Al Pastor Taco", "Tikka Masala"][
        (i + j) % 5
      ],
      price: Number((6.5 + ((i + j) % 8)).toFixed(2)),
      quantity: (j % 2) + 1,
    })),
    totalAmount: Number(((i % 40) + 12.5 + (i % 7) * 1.75).toFixed(2)),
    orderTime: created.toISOString(),
    orderStatus: STATUSES[i % STATUSES.length],
    expectedDeliveryTime: new Date(created.getTime() + 45 * 60_000).toISOString(),
    address: {
      street: `${100 + i} Main St`,
      city: "Springfield",
      state: "CA",
      zipCode: "90001",
      country: "USA",
    },
    paymentId: `PAY-${2000 + i}`,
  };
});

export const ordersService = {
  async list(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: OrderStatus | "ALL";
  }): Promise<Paginated<OrderResponse>> {
    await new Promise((r) => setTimeout(r, 300));
    const { page = 1, pageSize = 10, search = "", status = "ALL" } = params;
    let filtered = MOCK_ORDERS;
    if (status !== "ALL") filtered = filtered.filter((o) => o.orderStatus === status);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          String(o.orderNumber).includes(s) ||
          o.userName.toLowerCase().includes(s) ||
          o.restaurantName.toLowerCase().includes(s),
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

  async get(orderNumber: number): Promise<OrderResponse | undefined> {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_ORDERS.find((o) => o.orderNumber === orderNumber);
  },

  async cancel(orderNumber: number): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    const o = MOCK_ORDERS.find((x) => x.orderNumber === orderNumber);
    if (o) o.orderStatus = "CANCELLED";
  },

  async stats() {
    await new Promise((r) => setTimeout(r, 200));
    const total = MOCK_ORDERS.length;
    const delivered = MOCK_ORDERS.filter((o) => o.orderStatus === "DELIVERED").length;
    const pending = MOCK_ORDERS.filter((o) =>
      ["PLACED", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY"].includes(o.orderStatus),
    ).length;
    const revenue = MOCK_ORDERS.filter((o) => o.orderStatus === "DELIVERED").reduce(
      (s, o) => s + o.totalAmount,
      0,
    );
    return { total, delivered, pending, revenue };
  },

  _api: api,
};

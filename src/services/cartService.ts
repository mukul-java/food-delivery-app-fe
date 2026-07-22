import type { FoodItem } from "@/types/restaurant";

export interface CartItem {
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

const KEY = "customer_cart";
const EVENT = "cart:changed";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as CartItem[];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export const cartService = {
  EVENT,
  getAll: read,

  add(item: FoodItem, restaurantName: string, quantity = 1) {
    const items = read();
    const first = items[0];
    if (first && first.restaurantId !== item.restaurantId) {
      // enforce single-restaurant cart
      if (
        !confirm(
          "Your cart contains items from another restaurant. Clear it and add this item?",
        )
      ) {
        return;
      }
      items.length = 0;
    }
    const existing = items.find((i) => i.foodItemId === item.id);
    if (existing) existing.quantity += quantity;
    else
      items.push({
        foodItemId: item.id,
        name: item.name,
        price: item.price,
        quantity,
        restaurantId: item.restaurantId,
        restaurantName,
      });
    write(items);
  },

  setQuantity(foodItemId: string, quantity: number) {
    let items = read();
    if (quantity <= 0) items = items.filter((i) => i.foodItemId !== foodItemId);
    else
      items = items.map((i) =>
        i.foodItemId === foodItemId ? { ...i, quantity } : i,
      );
    write(items);
  },

  remove(foodItemId: string) {
    write(read().filter((i) => i.foodItemId !== foodItemId));
  },

  clear() {
    write([]);
  },

  totals() {
    const items = read();
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = items.length ? 2.99 : 0;
    const tax = Number((subtotal * 0.08).toFixed(2));
    const total = Number((subtotal + deliveryFee + tax).toFixed(2));
    return { subtotal: Number(subtotal.toFixed(2)), deliveryFee, tax, total };
  },
};

import { useEffect, useState, useCallback } from "react";
import { cartService, type CartItem } from "@/services/cartService";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const refresh = useCallback(() => setItems(cartService.getAll()), []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener(cartService.EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(cartService.EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const totals = {
    subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
    deliveryFee: items.length ? 2.99 : 0,
    get tax() {
      return Number((this.subtotal * 0.08).toFixed(2));
    },
    get total() {
      return Number((this.subtotal + this.deliveryFee + this.tax).toFixed(2));
    },
  };

  return { items, count, totals, ...cartService };
}

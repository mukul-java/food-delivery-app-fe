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
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = items.length ? 2.99 : 0;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + deliveryFee + tax).toFixed(2));

  const totals = {
    subtotal: Number(subtotal.toFixed(2)),
    deliveryFee,
    tax,
    total,
  };

  return {
    items,
    count,
    totals,
    add: cartService.add,
    setQuantity: cartService.setQuantity,
    remove: cartService.remove,
    clear: cartService.clear,
  };
}

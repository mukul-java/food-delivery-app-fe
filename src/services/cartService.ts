import api from "./api";
import type { AddToCartRequestDto, CartDto } from "@/types/cart";

export const cartService = {
  async getCart(userId: string | number): Promise<CartDto | null> {
    try {
      const response = await api.get<CartDto | { success: boolean; data: CartDto }>(
        `/cart/${userId}`
      );
      // Handle both direct CartDto and ApiResponse enveloped CartDto
      const data = "data" in response.data && (response.data as { data: CartDto }).data 
        ? (response.data as { data: CartDto }).data 
        : (response.data as CartDto);
      return data || null;
    } catch {
      return null;
    }
  },

  async addToCart(dto: AddToCartRequestDto): Promise<CartDto> {
    const response = await api.post<CartDto | { success: boolean; data: CartDto }>(
      "/cart/add",
      dto
    );
    const data = "data" in response.data && (response.data as { data: CartDto }).data
      ? (response.data as { data: CartDto }).data
      : (response.data as CartDto);
    return data;
  },

  async removeItem(userId: string | number, foodItemId: string): Promise<CartDto | null> {
    const response = await api.delete<CartDto | { success: boolean; data: CartDto }>(
      `/cart/${userId}/item/${foodItemId}`
    );
    const data = "data" in response.data && (response.data as { data: CartDto }).data
      ? (response.data as { data: CartDto }).data
      : (response.data as CartDto);
    return data || null;
  },

  async clearCart(userId: string | number): Promise<void> {
    await api.delete(`/cart/${userId}`);
  },
};

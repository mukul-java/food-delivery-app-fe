import api from "./api";
import type { AddToCartRequestDto, CartDto } from "@/types/cart";

export const cartService = {
  async getCart(userId: number | string): Promise<CartDto | null> {
    const numId = Number(userId);
    try {
      const response = await api.get<CartDto | { success: boolean; data: CartDto }>(
        `/cart/${numId}`
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
    const payload: AddToCartRequestDto = {
      ...dto,
      userId: Number(dto.userId),
    };
    const response = await api.post<CartDto | { success: boolean; data: CartDto }>(
      "/cart/add",
      payload
    );
    const data = "data" in response.data && (response.data as { data: CartDto }).data
      ? (response.data as { data: CartDto }).data
      : (response.data as CartDto);
    return data;
  },

  async removeItem(userId: number | string, foodItemId: string): Promise<CartDto | null> {
    const numId = Number(userId);
    const response = await api.delete<CartDto | { success: boolean; data: CartDto }>(
      `/cart/${numId}/item/${foodItemId}`
    );
    const data = "data" in response.data && (response.data as { data: CartDto }).data
      ? (response.data as { data: CartDto }).data
      : (response.data as CartDto);
    return data || null;
  },

  async clearCart(userId: number | string): Promise<void> {
    const numId = Number(userId);
    await api.delete(`/cart/${numId}`);
  },
};

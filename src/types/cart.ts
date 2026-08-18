import { Address } from "./auth";

export interface CartItem {
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface CartDto {
  cartId: string;
  userId: string;
  restaurantId: string;
  items: CartItem[];
  totalAmount: number;
  updatedAt?: string;
}

export interface AddToCartRequestDto {
  userId: string;
  restaurantId: string;
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface CheckoutRequestDto {
  userId: string;
  address: Address;
}

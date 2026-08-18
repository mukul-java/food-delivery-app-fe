import { Address } from "./auth";

// ------- Restaurant -------

export interface RestaurantRequest {
  name: string;
  description?: string;
  cuisineType?: string;
  address: Address;
  ownerInfo?: {
    ownerName: string;
    email: string;
    phone: number;
  };
}

export interface RestaurantSummary {
  id: string;
  name: string;
  description?: string;
  cuisineType?: string;
  rating?: number;
  active?: boolean;
  address?: Address;
}

export interface FoodItemSummary {
  id: string;
  name: string;
  price: number;
  category?: string;
  quantity?: number;
  availableQuantity?: number;
  description?: string;
}

export interface RestaurantDetail extends RestaurantSummary {
  foodItems?: FoodItemSummary[] | null;
}

export interface RestaurantCreateResponse {
  success: boolean;
  message: string;
  data: RestaurantSummary;
}

// ------- Food Item -------

export interface FoodItemRequest {
  restaurantId: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  quantity?: number;
  availableQuantity?: number;
}

export interface FoodItemUpdateRequest extends FoodItemRequest {
  id: string;
}

export interface FoodItemCreateResponse {
  success: boolean;
  message: string;
  data: FoodItemSummary;
}

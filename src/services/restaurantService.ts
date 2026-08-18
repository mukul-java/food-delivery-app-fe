import api from "./api";
import type {
  RestaurantRequest,
  RestaurantSummary,
  RestaurantDetail,
  RestaurantCreateResponse,
  FoodItemRequest,
  FoodItemUpdateRequest,
  FoodItemSummary,
  FoodItemCreateResponse,
} from "@/types/restaurant";

export type { RestaurantSummary, RestaurantDetail, FoodItemSummary };

export const restaurantService = {
  async addRestaurant(data: RestaurantRequest): Promise<RestaurantCreateResponse> {
    const response = await api.post<RestaurantCreateResponse>("/restaurant", data);
    return response.data;
  },

  async updateRestaurant(id: string, data: RestaurantRequest): Promise<void> {
    await api.put(`/restaurant/${id}`, data);
  },

  async getAllRestaurants(): Promise<RestaurantSummary[]> {
    const response = await api.get<{ data: RestaurantSummary[] }>("/restaurant");
    return response.data.data;
  },

  async getRestaurant(id: string): Promise<RestaurantDetail> {
    const response = await api.get<{ data: RestaurantDetail }>(`/restaurant/${id}`);
    return response.data.data;
  },

  async addFoodItem(foodItem: FoodItemRequest): Promise<FoodItemCreateResponse> {
    const response = await api.post<FoodItemCreateResponse>("/fooditem", foodItem);
    return response.data;
  },

  async getFoodItems(restaurantId: string): Promise<FoodItemSummary[]> {
    const response = await api.get<{ data: FoodItemSummary[] }>(`/fooditem/${restaurantId}`);
    return response.data.data;
  },

  async updateFoodItem(foodItem: FoodItemUpdateRequest): Promise<string> {
    const response = await api.put<string>("/fooditem", foodItem);
    return response.data;
  },

  async updateFoodItemQuantity(foodItemIds: string[], orderQuantities: number[]): Promise<void> {
    await api.put("/fooditem/quantity", null, {
      params: {
        foodItemIds: foodItemIds.join(","),
        orderQuantities: orderQuantities.join(","),
      },
    });
  },
};

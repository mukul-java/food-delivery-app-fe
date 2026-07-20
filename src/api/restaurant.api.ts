import api from "./axios";
import { API } from "../constants/api";

export const getRestaurants = async () => {
  const response = await api.get(API.RESTAURANT);
  return response.data;
};

export const getRestaurant = async (id: string) => {
  const response = await api.get(`${API.RESTAURANT}/${id}`);
  return response.data;
};

export const createRestaurant = async (restaurant: unknown) => {
  const response = await api.post(API.RESTAURANT, restaurant);
  return response.data;
};
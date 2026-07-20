import api from "./axios";
import { API } from "../constants/api";

export const placeOrder = async (order: unknown) => {
  const response = await api.post(API.ORDER, order);
  return response.data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: unknown
) => {
  const response = await api.put(`${API.ORDER}/status`, status, {
    params: { orderId },
  });

  return response.data;
};
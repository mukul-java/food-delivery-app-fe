import api from "./axios";
import { API } from "../constants/api";

export const pay = async (payment: unknown) => {
  const response = await api.post(API.PAYMENT, payment);
  return response.data;
};
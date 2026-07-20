import api from "./axios";
import { API } from "../constants/api";
import { AuthRequest } from "../types/auth";

export const login = async (request: AuthRequest) => {
  const response = await api.post<string>(API.TOKEN, request);
  return response.data;
};

export const register = async (request: unknown) => {
  const response = await api.post(API.REGISTER, request);
  return response.data;
};

export const validateToken = async (token: string) => {
  const response = await api.get(API.VALIDATE, {
    params: { token },
  });

  return response.data;
};
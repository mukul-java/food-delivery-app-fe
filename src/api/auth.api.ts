import api from "./axios";
import { API_ENDPOINTS } from "@/constants/api";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

export const authApi = {

  async login(request: LoginRequest): Promise<LoginResponse> {

    const response = await api.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      request
    );

    return response.data;
  },

  async register(request: RegisterRequest): Promise<RegisterResponse> {

    const response = await api.post<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      request
    );

    return response.data;
  }

};
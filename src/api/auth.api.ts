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
    const identityValue = request.identity || request.email || request.username || "";
    const response = await api.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        identity: identityValue,
        username: request.username || identityValue,
        email: request.email || (identityValue.includes("@") ? identityValue : undefined),
        password: request.password,
      }
    );

    return response.data;
  },

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const emailValue = request.email || request.username;
    const response = await api.post<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      {
        fullName: request.fullName,
        username: request.username,
        email: emailValue,
        password: request.password,
        phoneNumber: Number(request.phoneNumber),
        address: request.address,
        userRole: request.userRole,
      }
    );

    return response.data;
  },
};
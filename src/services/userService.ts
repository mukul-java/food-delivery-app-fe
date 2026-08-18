import api from "./api";
import type { UserResponse, UpdateUserRequest, DeliveryAgent } from "@/types/auth";

export type { UserResponse, DeliveryAgent };

export const userService = {
  async getUser(id: number): Promise<UserResponse> {
    const response = await api.get<UserResponse>(`/user/${id}`);
    return response.data;
  },

  async updateUser(data: UpdateUserRequest): Promise<UserResponse> {
    const response = await api.put<UserResponse>("/user", data);
    return response.data;
  },

  async getUserRole(username: string): Promise<string> {
    const response = await api.get<string>("/user/role", {
      params: { username },
    });
    return response.data;
  },

  async getDeliveryAgents(): Promise<DeliveryAgent[]> {
    const response = await api.get<DeliveryAgent[]>("/user/delivery");
    return response.data;
  },
};

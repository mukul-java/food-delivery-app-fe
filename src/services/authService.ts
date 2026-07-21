import { authApi } from "@/api/auth.api";
import { storage } from "@/utils/storage";
import {
  LoginRequest,
  RegisterRequest,
  LoginData,
  User,
} from "@/types/auth";

class AuthService {

  async login(request: LoginRequest): Promise<LoginData> {

    const response = await authApi.login(request);

    if (!response.success) {
      throw new Error(response.message);
    }

    storage.saveToken(response.data.token);
    storage.saveUser(response.data);

    return response.data;
  }

  async register(request: RegisterRequest): Promise<User> {

    const response = await authApi.register(request);

    if (!response.success) {
      throw new Error(response.message);
    }

    return response.data;
  }

  logout() {

    storage.clearAuth();

  }

  getCurrentUser() {

    return storage.getUser();

  }

  isAuthenticated() {

    return !!storage.getToken();

  }

}

export const authService = new AuthService();
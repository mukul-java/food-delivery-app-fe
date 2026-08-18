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
      throw new Error(response.message || "Login failed");
    }

    const data = response.data;
    const roleValue = (data.role || data.userRole || "CUSTOMER") as LoginData["role"];

    const loginData: LoginData = {
      token: data.token,
      username: data.username,
      email: data.email,
      role: roleValue,
      userRole: roleValue,
      id: data.id,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      address: data.address,
    };

    storage.saveToken(loginData.token);
    storage.saveUser(loginData);

    return loginData;
  }

  async register(request: RegisterRequest): Promise<User> {
    const response = await authApi.register(request);

    if (!response.success) {
      throw new Error(response.message || "Registration failed");
    }

    return response.data;
  }

  logout(): void {
    storage.clearAuth();
  }

  getCurrentUser(): LoginData | null {
    return storage.getUser();
  }

  isAuthenticated(): boolean {
    return !!storage.getToken();
  }
}

export const authService = new AuthService();
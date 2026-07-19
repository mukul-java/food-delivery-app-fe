import api from "./api";

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}
export interface RegisterPayload {
  username: string;
  password: string;
  role?: string;
}

export interface UserProfile {
  username: string;
  role: string;
  email?: string;
  phone?: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    // Real: return api.post<AuthResponse>('/auth/login', payload).then(r => r.data);
    await new Promise((r) => setTimeout(r, 500));
    if (!payload.username || !payload.password) throw new Error("Invalid credentials");
    return { token: "mock-jwt-token", username: payload.username, role: "ADMIN" };
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    // Real: return api.post<AuthResponse>('/auth/register', payload).then(r => r.data);
    await new Promise((r) => setTimeout(r, 500));
    return { token: "mock-jwt-token", username: payload.username, role: payload.role ?? "ADMIN" };
  },

  async updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise((r) => setTimeout(r, 400));
    return {
      username: payload.username ?? "admin",
      role: payload.role ?? "ADMIN",
      email: payload.email,
      phone: payload.phone,
    };
  },

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },

  _api: api,
};

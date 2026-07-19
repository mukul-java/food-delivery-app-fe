import api from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatarUrl?: string;
}

const MOCK_USER: User = {
  id: "u_1",
  name: "Admin User",
  email: "admin@fooddash.io",
  role: "Administrator",
  phone: "+1 (555) 010-2020",
};

export const authService = {
  async login(payload: LoginPayload): Promise<{ token: string; user: User }> {
    // Mock: replace with `api.post('/auth/login', payload)`
    await new Promise((r) => setTimeout(r, 500));
    if (!payload.email || !payload.password) throw new Error("Invalid credentials");
    return { token: "mock-jwt-token", user: { ...MOCK_USER, email: payload.email } };
  },

  async register(payload: RegisterPayload): Promise<{ token: string; user: User }> {
    await new Promise((r) => setTimeout(r, 500));
    return {
      token: "mock-jwt-token",
      user: { ...MOCK_USER, name: payload.name, email: payload.email },
    };
  },

  async me(): Promise<User> {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_USER;
  },

  async updateProfile(payload: Partial<User>): Promise<User> {
    await new Promise((r) => setTimeout(r, 400));
    return { ...MOCK_USER, ...payload };
  },

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },

  // Real API examples:
  // login: (p) => api.post('/auth/login', p).then(r => r.data),
  // register: (p) => api.post('/auth/register', p).then(r => r.data),
  // me: () => api.get('/auth/me').then(r => r.data),
  _api: api,
};

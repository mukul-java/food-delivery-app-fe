import axios from "axios";
import { storage } from "@/utils/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const isAuthEndpoint =
    config.url?.includes("/auth/") ||
    config.url?.includes("/login") ||
    config.url?.includes("/register") ||
    config.url?.includes("/token");

  if (!isAuthEndpoint) {
    const token = storage.getToken();
    if (token) {
      if (typeof (config.headers as any).set === "function") {
        (config.headers as any).set("Authorization", `Bearer ${token}`);
      }
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn(`[Axios Interceptor] Warning: Sending request to ${config.url} without Authorization token.`);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clearAuth();
    }
    return Promise.reject(error);
  }
);

export default api;
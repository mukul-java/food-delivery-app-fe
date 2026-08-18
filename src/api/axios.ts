import axios from "axios";
import { storage } from "@/utils/storage";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const isAuthEndpoint =
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/register");

  if (!isAuthEndpoint) {
    const token = storage.getToken();
    if (token) {
      if (typeof (config.headers as any).set === "function") {
        (config.headers as any).set("Authorization", `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      toast.error("Session expired or invalid credentials. Please log in.");
      storage.clearAuth();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    } else if (status === 403) {
      toast.error("Access denied. You do not have permission for this action.");
    }
    return Promise.reject(error);
  }
);

export default api;
import axios from "axios";
import { storage } from "@/utils/storage";
import { toast } from "sonner";

export function extractErrorMessage(error: any): string {
  if (!error) return "An unexpected error occurred";

  // 1. If backend returned response data
  const data = error.response?.data;
  if (data) {
    if (typeof data === "string" && data.trim()) {
      return data.trim();
    }
    if (typeof data === "object") {
      // Common backend message fields
      if (typeof data.message === "string" && data.message.trim()) {
        return data.message.trim();
      }
      if (typeof data.error === "string" && data.error.trim()) {
        return data.error.trim();
      }
      if (typeof data.detail === "string" && data.detail.trim()) {
        return data.detail.trim();
      }
      if (typeof data.errorMessage === "string" && data.errorMessage.trim()) {
        return data.errorMessage.trim();
      }
      if (typeof data.title === "string" && data.title.trim()) {
        return data.title.trim();
      }
      // Array of error messages: e.g. { errors: ["Invalid email", "Password too short"] }
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors
          .map((e: any) => (typeof e === "string" ? e : e?.message || e?.defaultMessage || JSON.stringify(e)))
          .filter(Boolean)
          .join(", ");
      }
      // Validation error map: e.g. { errors: { email: "Email is required", password: "Password is required" } }
      if (typeof data.errors === "object" && data.errors !== null) {
        const msgs = Object.values(data.errors)
          .flat()
          .map((e: any) => (typeof e === "string" ? e : (e as any)?.message || (e as any)?.defaultMessage))
          .filter(Boolean);
        if (msgs.length > 0) {
          return msgs.join(", ");
        }
      }
    }
  }

  // 2. If error is an Error object with custom message (not generic Axios status message)
  if (typeof error.message === "string" && error.message.trim()) {
    if (!/^Request failed with status code \d+$/i.test(error.message.trim())) {
      return error.message.trim();
    }
  }

  // 3. Fallback based on HTTP status code
  const status = error.response?.status;
  if (status === 401) return "Invalid username or password";
  if (status === 403) return "Access denied. You do not have permission for this action.";
  if (status === 404) return "Resource not found.";
  if (status === 500) return "Internal server error. Please try again later.";
  if (status === 502 || status === 503 || status === 504) return "Service temporarily unavailable. Please try again.";

  return error.message || "An unexpected error occurred";
}

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
    const serverMessage = extractErrorMessage(error);
    if (error && typeof error === "object") {
      error.message = serverMessage;
    }

    const status = error.response?.status;
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    const isAuthPage = currentPath.includes("/login") || currentPath.includes("/register");

    if (status === 401) {
      storage.clearAuth();
      if (typeof window !== "undefined" && !isAuthPage) {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
      }
    } else if (status === 403) {
      if (typeof window !== "undefined" && !isAuthPage) {
        toast.error(serverMessage || "Access denied. You do not have permission for this action.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
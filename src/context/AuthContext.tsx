import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService, type AuthResponse, type UserProfile } from "@/services/authService";

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (u: UserProfile) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("auth_token");
    const u = localStorage.getItem("auth_user");
    if (t && u) {
      setToken(t);
      try {
        setUserState(JSON.parse(u));
      } catch {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  const persist = (res: AuthResponse) => {
    const u: UserProfile = { username: res.username, role: res.role };
    localStorage.setItem("auth_token", res.token);
    localStorage.setItem("auth_user", JSON.stringify(u));
    setToken(res.token);
    setUserState(u);
  };

  const login: AuthContextValue["login"] = async (username, password) => {
    const res = await authService.login({ username, password });
    persist(res);
  };

  const register: AuthContextValue["register"] = async (username, password) => {
    const res = await authService.register({ username, password });
    persist(res);
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUserState(null);
  };

  const setUser = (u: UserProfile) => {
    setUserState(u);
    localStorage.setItem("auth_user", JSON.stringify(u));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

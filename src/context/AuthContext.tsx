import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService, type User } from "@/services/authService";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (u: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
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

  const persist = (t: string, u: User) => {
    localStorage.setItem("auth_token", t);
    localStorage.setItem("auth_user", JSON.stringify(u));
    setToken(t);
    setUserState(u);
  };

  const login: AuthContextValue["login"] = async (email, password) => {
    const { token, user } = await authService.login({ email, password });
    persist(token, user);
  };

  const register: AuthContextValue["register"] = async (name, email, password) => {
    const { token, user } = await authService.register({ name, email, password });
    persist(token, user);
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUserState(null);
  };

  const setUser = (u: User) => {
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

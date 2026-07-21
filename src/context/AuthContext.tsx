import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authService } from "@/services/authService";
import { storage } from "@/utils/storage";
import {
  LoginData,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth";

interface AuthContextValue {
  user: LoginData | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (request: LoginRequest) => Promise<void>;

  register: (request: RegisterRequest) => Promise<User>;

  logout: () => void;

  setUser: (user: LoginData) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<LoginData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = storage.getUser();

    if (currentUser) {
      setUserState(currentUser);
    }

    setLoading(false);
  }, []);

  const login = async (request: LoginRequest) => {
    const loggedInUser = await authService.login(request);

    setUserState(loggedInUser);
  };

  const register = async (request: RegisterRequest) => {
    return await authService.register(request);
  };

  const logout = () => {
    authService.logout();

    setUserState(null);
  };

  const setUser = (user: LoginData) => {
    storage.saveUser(user);

    setUserState(user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
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
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
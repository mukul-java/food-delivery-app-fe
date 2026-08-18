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
  UserRole,
} from "@/types/auth";
import { hasPermission as checkPermission, Permission } from "@/constants/permissions";

interface AuthContextValue {
  user: LoginData | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<User>;
  logout: () => void;
  setUser: (user: LoginData) => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
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

  const setUser = (newUser: LoginData) => {
    storage.saveUser(newUser);
    setUserState(newUser);
  };

  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    const userRole = user.role || user.userRole;
    if (!userRole) return false;
    return roleList.includes(userRole as UserRole);
  };

  const userHasPermission = (permission: Permission) => {
    if (!user) return false;
    const userRole = user.role || user.userRole;
    return checkPermission(userRole, permission);
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
        hasRole,
        hasPermission: userHasPermission,
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
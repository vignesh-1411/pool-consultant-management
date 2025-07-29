// src/context/AuthContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";


type UserRole = "admin" | "consultant";

interface AuthContextType {
  token: string | null;
  userId: number | null;
  role: UserRole | null;
  login: (token: string, userId: number, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : null
  );
  const [role, setRole] = useState<UserRole | null>(
    localStorage.getItem("role") as UserRole | null
  );

  const login = (token: string, userId: number, role: UserRole) => {
    setToken(token);
    setUserId(userId);
    setRole(role);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId.toString());
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setRole(null);
    localStorage.clear();
  };

  const value = {
    token,
    userId,
    role,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

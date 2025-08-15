
"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const value = {
    user: session?.user || null,
    isAuthenticated: status === "authenticated",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

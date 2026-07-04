"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, getStoredAuth, setStoredAuth, clearStoredAuth, type StoredAuth } from "@/lib/api";

type AuthUser = {
  email: string;
  nome?: string;
  sobrenome?: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = getStoredAuth();
    if (!stored?.token) {
      return;
    }

    setUser({
      email: stored.email,
      nome: stored.nome,
      sobrenome: stored.sobrenome,
    });
    setIsAuthenticated(true);
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    try {
      const data = await apiFetch<{
        token?: string;
        access_token?: string;
        nome?: string;
        sobrenome?: string;
        email?: string;
      }>("/login", {
        method: "POST",
        body: { email, senha },
      });

      const token = data.token ?? data.access_token;
      if (!token) {
        return false;
      }

      const auth: StoredAuth = {
        token,
        email: data.email ?? email,
        nome: data.nome,
        sobrenome: data.sobrenome,
      };

      setStoredAuth(auth);
      setUser({ email: auth.email, nome: auth.nome, sobrenome: auth.sobrenome });
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    clearStoredAuth();
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, user, login, logout }),
    [isAuthenticated, login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}

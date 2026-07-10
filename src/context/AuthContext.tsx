import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiFetch, setToken, getToken } from "@/lib/api";
import type { User } from "@/types/database";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const { user: currentUser } = await apiFetch<{ user: User }>("/api/auth/me");
      setUser(currentUser);
    } catch {
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const signOut = async () => {
    try {
      setToken(null);
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error logging out";
      toast.error(message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

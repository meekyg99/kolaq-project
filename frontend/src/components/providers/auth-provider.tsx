"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Check auth on mount - this will validate the token and update the store
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}

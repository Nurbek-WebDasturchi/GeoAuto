import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "@/components/layout/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { me } from "@/features/auth/auth-api";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/stores/auth-store";
import { router } from "./router";

export const Providers = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SessionSync />
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

const SessionSync = () => {
  const { token, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    let active = true;
    me()
      .then(({ data }) => {
        if (active) setUser(data);
      })
      .catch(() => {
        if (active) logout();
      });

    return () => {
      active = false;
    };
  }, [logout, setUser, token]);

  return null;
};

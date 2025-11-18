import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import type { LoginCredentials } from "../services/auth.service";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    authService.isAuthenticated()
  );

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      if (data.success && data.data?.token) {
        authService.setToken(data.data.token);
        setIsAuthenticated(true);
      }
    },
  });

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    loginResponse: loginMutation.data,
  };
};

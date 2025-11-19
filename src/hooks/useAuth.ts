import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import type { LoginCredentials } from "../models/auth";
import { getToken, removeToken, setToken } from "../utils/cookies";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      if (data.success && data.data?.token) {
        setToken(data.data.token);
        setIsAuthenticated(true);
      }
    },
  });

  const logout = useCallback(async () => {
    await authService.logout();
    removeToken();
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

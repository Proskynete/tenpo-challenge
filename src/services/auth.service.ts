import type { LoginCredentials } from "../models/auth";
import type { Response } from "../models/common";
import { authApi } from "../lib/api";

interface LoginResponse {
  token: string;
}

const login = async (credentials: LoginCredentials) => {
  const response = await authApi.post<Response<LoginResponse>>(
    "/sign-in",
    credentials
  );
  return response.data;
};

const logout = async () => {
  await authApi.post("/sign-out");
};

export const authService = {
  login,
  logout,
};

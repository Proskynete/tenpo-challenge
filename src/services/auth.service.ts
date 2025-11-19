import type { LoginCredentials } from "../models/auth";
import type { Response } from "../models/common";
import { apiAdapter } from "../lib/api";

interface LoginResponse {
  token: string;
}

export const login = async (credentials: LoginCredentials) => {
  const response = await apiAdapter.post<Response<LoginResponse>>(
    "/sign-in",
    credentials
  );
  return response.data;
};

export const authService = {
  login,
};

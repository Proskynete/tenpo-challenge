import { authApi } from "../lib/api";
import type { LoginCredentials } from "../models/auth";
import type { Response } from "../models/common";

interface LoginResponse {
  token: string;
}

const login = async (
  credentials: LoginCredentials
): Promise<Response<LoginResponse | null>> => {
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

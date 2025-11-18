import Cookies from "js-cookie";
import axios from "axios";
import type { LoginCredentials } from "../models/auth";
import type { Response } from "../models/common";

const TOKEN_KEY = "auth_token";
const API_BASE_URL = "/v1/auth";

interface LoginResponse {
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<Response<LoginResponse>> {
    const response = await axios.post<Response<LoginResponse>>(
      `${API_BASE_URL}/sign-in`,
      credentials
    );
    return response.data;
  },

  setToken(token: string): void {
    Cookies.set(TOKEN_KEY, token, { expires: 7 }); // Expires in 7 days
  },

  getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken(): void {
    Cookies.remove(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  logout(): void {
    this.removeToken();
  },
};

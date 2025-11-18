import Cookies from "js-cookie";
import axios from "axios";

const TOKEN_KEY = "auth_token";
const API_BASE_URL = "/v1/auth";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  } | null;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
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

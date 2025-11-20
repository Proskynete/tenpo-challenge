import { beforeEach, describe, expect, it, vi } from "vitest";

import { authApi } from "../../src/lib/api";
import type { Response } from "../../src/models/common";
import { authService } from "../../src/services/auth.service";

// Mock the API module
vi.mock("../../src/lib/api", () => ({
  authApi: {
    post: vi.fn(),
  },
}));

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should call auth API with correct credentials", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const mockResponse: Response<{ token: string }> = {
        success: true,
        message: "Login successful",
        data: { token: "test-token-123" },
      };

      vi.mocked(authApi.post).mockResolvedValue({ data: mockResponse });

      const result = await authService.login(credentials);

      expect(authApi.post).toHaveBeenCalledWith("/sign-in", credentials);
      expect(result).toEqual(mockResponse);
    });

    it("should return token on successful login", async () => {
      const credentials = {
        email: "user@test.com",
        password: "secure-password",
      };

      const mockResponse: Response<{ token: string }> = {
        success: true,
        message: "Authenticated",
        data: { token: "abc123xyz" },
      };

      vi.mocked(authApi.post).mockResolvedValue({ data: mockResponse });

      const result = await authService.login(credentials);

      expect(result.success).toBe(true);
      expect(result.data.token).toBe("abc123xyz");
    });

    it("should handle login failure", async () => {
      const credentials = {
        email: "wrong@example.com",
        password: "wrongpassword",
      };

      const mockResponse: Response<{ token: string }> = {
        success: false,
        message: "Invalid credentials",
        data: { token: "" },
      };

      vi.mocked(authApi.post).mockResolvedValue({ data: mockResponse });

      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid credentials");
    });

    it("should handle network errors", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password",
      };

      const networkError = new Error("Network error");
      vi.mocked(authApi.post).mockRejectedValue(networkError);

      await expect(authService.login(credentials)).rejects.toThrow(
        "Network error"
      );
    });

    it("should handle empty credentials", async () => {
      const credentials = {
        email: "",
        password: "",
      };

      const mockResponse: Response<{ token: string }> = {
        success: false,
        message: "Email and password required",
        data: { token: "" },
      };

      vi.mocked(authApi.post).mockResolvedValue({ data: mockResponse });

      const result = await authService.login(credentials);

      expect(authApi.post).toHaveBeenCalledWith("/sign-in", credentials);
      expect(result.success).toBe(false);
    });
  });

  describe("logout", () => {
    it("should call logout endpoint", async () => {
      vi.mocked(authApi.post).mockResolvedValue({ data: {} });

      await authService.logout();

      expect(authApi.post).toHaveBeenCalledWith("/sign-out");
    });

    it("should handle logout success", async () => {
      vi.mocked(authApi.post).mockResolvedValue({
        data: { success: true, message: "Logged out" },
      });

      await expect(authService.logout()).resolves.not.toThrow();
    });

    it("should handle logout errors gracefully", async () => {
      vi.mocked(authApi.post).mockRejectedValue(new Error("Logout failed"));

      await expect(authService.logout()).rejects.toThrow("Logout failed");
    });

    it("should call logout without parameters", async () => {
      vi.mocked(authApi.post).mockResolvedValue({ data: {} });

      await authService.logout();

      expect(authApi.post).toHaveBeenCalledTimes(1);
      expect(authApi.post).toHaveBeenCalledWith("/sign-out");
    });
  });
});

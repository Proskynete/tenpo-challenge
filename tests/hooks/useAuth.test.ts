import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../../src/hooks/useAuth";
import * as authService from "../../src/services/auth.service";
import * as cookiesUtil from "../../src/utils/cookies";
import { AllTheProviders } from "../test-utils";

// Mock dependencies
vi.mock("../../src/utils/cookies", () => ({
  getToken: vi.fn(),
  setToken: vi.fn(),
  removeToken: vi.fn(),
}));

vi.mock("../../src/services/auth.service", () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("should initialize with authenticated state when token exists", () => {
      vi.mocked(cookiesUtil.getToken).mockReturnValue("mock-token");

      const { result } = renderHook(() => useAuth(), {
        wrapper: AllTheProviders,
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should initialize with unauthenticated state when no token exists", () => {
      vi.mocked(cookiesUtil.getToken).mockReturnValue(undefined);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AllTheProviders,
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("login", () => {
    it("should successfully login and set authenticated state", async () => {
      vi.mocked(cookiesUtil.getToken).mockReturnValue(undefined);
      vi.mocked(authService.authService.login).mockResolvedValue({
        success: true,
        data: { token: "new-token" },
        message: "Login successful",
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AllTheProviders,
      });

      expect(result.current.isAuthenticated).toBe(false);

      result.current.login({
        email: "test@example.com",
        password: "password",
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(authService.authService.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      });
      expect(cookiesUtil.setToken).toHaveBeenCalledWith("new-token");
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.loginResponse?.success).toBe(true);
    });

    it("should handle login failure without token", async () => {
      vi.mocked(cookiesUtil.getToken).mockReturnValue(undefined);
      vi.mocked(authService.authService.login).mockResolvedValue({
        success: false,
        message: "Invalid credentials",
        data: null,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AllTheProviders,
      });

      result.current.login({
        email: "test@example.com",
        password: "wrong-password",
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(cookiesUtil.setToken).not.toHaveBeenCalled();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.loginResponse?.success).toBe(false);
    });

    it("should handle login API error", async () => {
      vi.mocked(cookiesUtil.getToken).mockReturnValue(undefined);
      const mockError = new Error("Network error");
      vi.mocked(authService.authService.login).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AllTheProviders,
      });

      result.current.login({
        email: "test@example.com",
        password: "password",
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toEqual(mockError);
      expect(result.current.isAuthenticated).toBe(false);
      expect(cookiesUtil.setToken).not.toHaveBeenCalled();
    });

    it("should set loading state during login", async () => {
      vi.mocked(cookiesUtil.getToken).mockReturnValue(undefined);
      vi.mocked(authService.authService.login).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  success: true,
                  data: { token: "token" },
                  message: "Success",
                }),
              100
            )
          )
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AllTheProviders,
      });

      result.current.login({
        email: "test@example.com",
        password: "password",
      });

      // Wait for loading state to be set
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("logout", () => {
    it("should successfully logout and clear authenticated state", async () => {
      vi.mocked(cookiesUtil.getToken).mockReturnValue("existing-token");
      vi.mocked(authService.authService.logout).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AllTheProviders,
      });

      expect(result.current.isAuthenticated).toBe(true);

      await result.current.logout();

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      expect(authService.authService.logout).toHaveBeenCalled();
      expect(cookiesUtil.removeToken).toHaveBeenCalled();
    });

    it("should handle logout API error", async () => {
      vi.mocked(cookiesUtil.getToken).mockReturnValue("existing-token");
      vi.mocked(authService.authService.logout).mockRejectedValue(
        new Error("Logout failed")
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AllTheProviders,
      });

      // Should still clear local state even if API call fails
      await expect(result.current.logout()).rejects.toThrow("Logout failed");
    });

    it("should maintain logout callback reference", () => {
      vi.mocked(cookiesUtil.getToken).mockReturnValue("token");

      const { result, rerender } = renderHook(() => useAuth(), {
        wrapper: AllTheProviders,
      });

      const firstLogout = result.current.logout;
      rerender();
      const secondLogout = result.current.logout;

      expect(firstLogout).toBe(secondLogout);
    });
  });

  describe("hook return values", () => {
    it("should return all expected properties", () => {
      vi.mocked(cookiesUtil.getToken).mockReturnValue(undefined);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AllTheProviders,
      });

      expect(result.current).toHaveProperty("isAuthenticated");
      expect(result.current).toHaveProperty("login");
      expect(result.current).toHaveProperty("logout");
      expect(result.current).toHaveProperty("isLoading");
      expect(result.current).toHaveProperty("error");
      expect(result.current).toHaveProperty("loginResponse");
    });

    it("should have correct initial values", () => {
      vi.mocked(cookiesUtil.getToken).mockReturnValue(undefined);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AllTheProviders,
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.loginResponse).toBeUndefined();
      expect(typeof result.current.login).toBe("function");
      expect(typeof result.current.logout).toBe("function");
    });
  });
});

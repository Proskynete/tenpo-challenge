import userEvent from "@testing-library/user-event";
import type { AxiosError } from "axios";
import { useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Router, useLocation } from "wouter";
import { memoryLocation } from "wouter/memory-location";

import * as useAuthHook from "../../src/hooks/useAuth";
import type { Response } from "../../src/models/common";
import { Login } from "../../src/pages/Login";
import { render, screen, waitFor } from "../test-utils";

// Mock useAuth hook
vi.mock("../../src/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

// Helper component to capture location
const LocationCapture = ({
  onLocationChange,
}: {
  onLocationChange: (location: string) => void;
}) => {
  const [location] = useLocation();

  useEffect(() => {
    onLocationChange(location);
  }, [location, onLocationChange]);

  return null;
};

describe("Login", () => {
  const mockLogin = vi.fn();
  const defaultAuthState = {
    login: mockLogin,
    isLoading: false,
    loginResponse: undefined,
    isAuthenticated: false,
    error: null,
    logout: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthHook.useAuth).mockReturnValue(defaultAuthState);
  });

  describe("rendering", () => {
    it("should render login form with all elements", () => {
      render(<Login />);

      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
      expect(screen.getByText("Sign in to continue")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Sign In" })
      ).toBeInTheDocument();
    });

    it("should render email and password inputs with correct types", () => {
      render(<Login />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");

      expect(emailInput).toHaveAttribute("type", "email");
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("should render inputs with placeholders", () => {
      render(<Login />);

      expect(
        screen.getByPlaceholderText("Enter your email")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your password")
      ).toBeInTheDocument();
    });

    it("should show helper text about test credentials", () => {
      render(<Login />);

      expect(
        screen.getByText(/Use the email leopoldo.henchoz@tenpo.cl/i)
      ).toBeInTheDocument();
    });

    it("should have required attributes on inputs", () => {
      render(<Login />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");

      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });
  });

  describe("form submission", () => {
    it("should call login with email and password on submit", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Sign In" });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should prevent default form submission", async () => {
      const user = userEvent.setup();
      const { container } = render(<Login />);

      const form = container.querySelector("form");
      const submitSpy = vi.fn((e) => e.preventDefault());
      form?.addEventListener("submit", submitSpy);

      await user.type(screen.getByLabelText("Email"), "test@test.com");
      await user.type(screen.getByLabelText("Password"), "pass");
      await user.click(screen.getByRole("button", { name: "Sign In" }));

      expect(submitSpy).toHaveBeenCalled();
    });

    it("should handle empty form submission (HTML5 validation)", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const submitButton = screen.getByRole("button", { name: "Sign In" });
      await user.click(submitButton);

      // HTML5 required validation should prevent submission
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it("should update input values as user types", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        "Password"
      ) as HTMLInputElement;

      await user.type(emailInput, "user@test.com");
      await user.type(passwordInput, "secret");

      expect(emailInput.value).toBe("user@test.com");
      expect(passwordInput.value).toBe("secret");
    });
  });

  describe("loading state", () => {
    it("should show loading text when isLoading is true", () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        ...defaultAuthState,
        isLoading: true,
      });

      render(<Login />);

      expect(
        screen.getByRole("button", { name: "Signing in..." })
      ).toBeInTheDocument();
    });

    it("should disable inputs when loading", () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        ...defaultAuthState,
        isLoading: true,
      });

      render(<Login />);

      expect(screen.getByLabelText("Email")).toBeDisabled();
      expect(screen.getByLabelText("Password")).toBeDisabled();
    });

    it("should disable submit button when loading", () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        ...defaultAuthState,
        isLoading: true,
      });

      render(<Login />);

      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("should enable inputs when not loading", () => {
      render(<Login />);

      expect(screen.getByLabelText("Email")).not.toBeDisabled();
      expect(screen.getByLabelText("Password")).not.toBeDisabled();
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  describe("error handling", () => {
    it("should display error message from axios error", () => {
      const axiosError: Partial<AxiosError<Response<unknown>>> = {
        response: {
          data: {
            success: false,
            message: "Invalid credentials",
          },
          status: 401,
          statusText: "Unauthorized",
          headers: {},
          config: {} as never,
        },
      };

      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        ...defaultAuthState,
        error: axiosError as AxiosError,
      });

      render(<Login />);

      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    it("should display generic error message when no specific message", () => {
      const axiosError: Partial<AxiosError<Response<unknown>>> = {
        response: undefined,
      };

      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        ...defaultAuthState,
        error: axiosError as AxiosError,
      });

      render(<Login />);

      expect(
        screen.getByText("Login failed. Please try again.")
      ).toBeInTheDocument();
    });

    it("should display error from loginResponse when login fails", () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        ...defaultAuthState,
        loginResponse: {
          success: false,
          message: "Account locked",
        },
      });

      render(<Login />);

      expect(screen.getByText("Account locked")).toBeInTheDocument();
    });

    it("should prioritize axios error over loginResponse error", () => {
      const axiosError: Partial<AxiosError<Response<unknown>>> = {
        response: {
          data: {
            success: false,
            message: "Network error",
          },
          status: 500,
          statusText: "Internal Server Error",
          headers: {},
          config: {} as never,
        },
      };

      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        ...defaultAuthState,
        error: axiosError as AxiosError,
        loginResponse: {
          success: false,
          message: "Different error",
        },
      });

      render(<Login />);

      expect(screen.getByText("Network error")).toBeInTheDocument();
      expect(screen.queryByText("Different error")).not.toBeInTheDocument();
    });

    it("should not display error when no error exists", () => {
      render(<Login />);

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("should display error alert with icon", () => {
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        ...defaultAuthState,
        loginResponse: {
          success: false,
          message: "Error occurred",
        },
      });

      render(<Login />);

      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(screen.getByText("Error occurred")).toBeInTheDocument();
    });
  });

  describe("authentication redirect", () => {
    it("should redirect to home when already authenticated", async () => {
      let currentLocation = "/login";
      const { hook } = memoryLocation({ path: "/login" });

      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        ...defaultAuthState,
        isAuthenticated: true,
      });

      render(
        <Router hook={hook}>
          <LocationCapture
            onLocationChange={(loc) => (currentLocation = loc)}
          />
          <Login />
        </Router>
      );

      await waitFor(() => {
        expect(currentLocation).toBe("/");
      });
    });

    it("should not redirect when not authenticated", () => {
      let currentLocation = "/login";
      const { hook } = memoryLocation({ path: "/login" });

      render(
        <Router hook={hook}>
          <LocationCapture
            onLocationChange={(loc) => (currentLocation = loc)}
          />
          <Login />
        </Router>
      );

      expect(currentLocation).toBe("/login");
    });

    it("should redirect after successful authentication", async () => {
      let currentLocation = "/login";
      const { hook } = memoryLocation({ path: "/login" });

      const { rerender } = render(
        <Router hook={hook}>
          <LocationCapture
            onLocationChange={(loc) => (currentLocation = loc)}
          />
          <Login />
        </Router>
      );

      expect(currentLocation).toBe("/login");

      // Simulate authentication
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        ...defaultAuthState,
        isAuthenticated: true,
      });

      rerender(
        <Router hook={hook}>
          <LocationCapture
            onLocationChange={(loc) => (currentLocation = loc)}
          />
          <Login />
        </Router>
      );

      await waitFor(() => {
        expect(currentLocation).toBe("/");
      });
    });
  });

  describe("form interactions", () => {
    it("should allow clearing and retyping input values", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const emailInput = screen.getByLabelText("Email") as HTMLInputElement;

      await user.type(emailInput, "first@test.com");
      expect(emailInput.value).toBe("first@test.com");

      await user.clear(emailInput);
      expect(emailInput.value).toBe("");

      await user.type(emailInput, "second@test.com");
      expect(emailInput.value).toBe("second@test.com");
    });

    it("should handle tab navigation between inputs", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");

      await user.click(emailInput);
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();
    });
  });
});

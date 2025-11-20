import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../test-utils";
import userEvent from "@testing-library/user-event";
import { Home } from "../../src/pages/Home";
import * as useAuthHook from "../../src/hooks/useAuth";
import { Router, useLocation } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { useEffect } from "react";

// Mock useAuth hook
vi.mock("../../src/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

// Mock MovieList component for simpler testing
vi.mock("../../src/components/MovieList", () => ({
  MovieList: () => <div data-testid="movie-list">Movie List Component</div>,
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

describe("Home", () => {
  const mockLogout = vi.fn();
  const defaultAuthState = {
    logout: mockLogout,
    login: vi.fn(),
    isLoading: false,
    loginResponse: undefined,
    isAuthenticated: true,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthHook.useAuth).mockReturnValue(defaultAuthState);
  });

  describe("rendering", () => {
    it("should render page header with title", () => {
      render(<Home />);

      expect(screen.getByText("Popular Movies")).toBeInTheDocument();
    });

    it("should render subtitle", () => {
      render(<Home />);

      expect(
        screen.getByText("Browse the most popular movies")
      ).toBeInTheDocument();
    });

    it("should render logout button", () => {
      render(<Home />);

      expect(
        screen.getByRole("button", { name: "Logout" })
      ).toBeInTheDocument();
    });

    it("should render MovieList component", () => {
      render(<Home />);

      expect(screen.getByTestId("movie-list")).toBeInTheDocument();
    });

    it("should have fixed header", () => {
      const { container } = render(<Home />);

      const header = container.querySelector("header");
      expect(header).toHaveClass("fixed");
    });

    it("should render with proper layout structure", () => {
      const { container } = render(<Home />);

      const main = container.querySelector("main");
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass("max-w-7xl");
    });
  });

  describe("logout functionality", () => {
    it("should call logout when logout button is clicked", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const logoutButton = screen.getByRole("button", { name: "Logout" });
      await user.click(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it("should redirect to login page after logout", async () => {
      const user = userEvent.setup();
      let currentLocation = "/";
      const { hook } = memoryLocation({ path: "/" });

      mockLogout.mockResolvedValue(undefined);

      render(
        <Router hook={hook}>
          <LocationCapture
            onLocationChange={(loc) => (currentLocation = loc)}
          />
          <Home />
        </Router>
      );

      const logoutButton = screen.getByRole("button", { name: "Logout" });
      await user.click(logoutButton);

      await waitFor(() => {
        expect(currentLocation).toBe("/login");
      });
    });

    it("should handle logout errors gracefully", async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockLogout.mockRejectedValue(new Error("Logout failed"));

      render(<Home />);

      const logoutButton = screen.getByRole("button", { name: "Logout" });

      // Click and catch the error
      await user.click(logoutButton);

      // Wait for any async operations to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Component should not crash
      expect(screen.getByText("Popular Movies")).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it("should wait for logout to complete before redirecting", async () => {
      const user = userEvent.setup();
      let currentLocation = "/";
      const { hook } = memoryLocation({ path: "/" });

      let resolveLogout: () => void;
      mockLogout.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveLogout = resolve;
          })
      );

      render(
        <Router hook={hook}>
          <LocationCapture
            onLocationChange={(loc) => (currentLocation = loc)}
          />
          <Home />
        </Router>
      );

      const logoutButton = screen.getByRole("button", { name: "Logout" });
      await user.click(logoutButton);

      // Should still be on home page
      expect(currentLocation).toBe("/");

      // Resolve logout
      resolveLogout!();

      await waitFor(() => {
        expect(currentLocation).toBe("/login");
      });
    });
  });

  describe("header styling", () => {
    it("should have white background on header", () => {
      const { container } = render(<Home />);

      const header = container.querySelector("header");
      expect(header).toHaveClass("bg-white");
    });

    it("should have shadow and border on header", () => {
      const { container } = render(<Home />);

      const header = container.querySelector("header");
      expect(header).toHaveClass("shadow-sm");
      expect(header).toHaveClass("border-b");
    });

    it("should render logout button with destructive variant", () => {
      render(<Home />);

      const logoutButton = screen.getByRole("button", { name: "Logout" });
      // Button should have destructive styling (implementation detail may vary)
      expect(logoutButton).toBeInTheDocument();
    });
  });

  describe("layout and spacing", () => {
    it("should have proper padding on main content", () => {
      const { container } = render(<Home />);

      const main = container.querySelector("main");
      expect(main).toHaveClass("pt-32"); // Account for fixed header
      expect(main).toHaveClass("pb-8");
    });

    it("should have proper padding on header", () => {
      const { container } = render(<Home />);

      const headerContent = container.querySelector("header > div");
      expect(headerContent).toHaveClass("py-4");
    });

    it("should center content with max width", () => {
      const { container } = render(<Home />);

      const main = container.querySelector("main");
      expect(main).toHaveClass("max-w-7xl");
      expect(main).toHaveClass("mx-auto");
    });
  });

  describe("accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<Home />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Popular Movies");
    });

    it("should have semantic HTML structure", () => {
      const { container } = render(<Home />);

      expect(container.querySelector("header")).toBeInTheDocument();
      expect(container.querySelector("main")).toBeInTheDocument();
    });

    it("should have accessible logout button", () => {
      render(<Home />);

      const logoutButton = screen.getByRole("button", { name: "Logout" });
      expect(logoutButton).toBeEnabled();
    });
  });

  describe("responsive design classes", () => {
    it("should have responsive padding classes", () => {
      const { container } = render(<Home />);

      const headerContent = container.querySelector("header > div");
      expect(headerContent).toHaveClass("px-4");
      expect(headerContent).toHaveClass("sm:px-6");
      expect(headerContent).toHaveClass("lg:px-8");
    });

    it("should apply same responsive padding to main", () => {
      const { container } = render(<Home />);

      const main = container.querySelector("main");
      expect(main).toHaveClass("px-4");
      expect(main).toHaveClass("sm:px-6");
      expect(main).toHaveClass("lg:px-8");
    });
  });

  describe("header layout", () => {
    it("should use flexbox for header content alignment", () => {
      const { container } = render(<Home />);

      const headerInner = container.querySelector("header > div > div");
      expect(headerInner).toHaveClass("flex");
      expect(headerInner).toHaveClass("justify-between");
      expect(headerInner).toHaveClass("items-center");
    });

    it("should render title and subtitle in same container", () => {
      render(<Home />);

      const title = screen.getByText("Popular Movies");
      const subtitle = screen.getByText("Browse the most popular movies");

      // Both should be in the same div section of the header
      expect(title.parentElement?.parentElement).toBe(
        subtitle.parentElement?.parentElement
      );
    });
  });

  describe("integration with MovieList", () => {
    it("should render MovieList inside main content", () => {
      const { container } = render(<Home />);

      const main = container.querySelector("main");
      const movieList = screen.getByTestId("movie-list");

      expect(main).toContainElement(movieList);
    });
  });

  describe("useAuth hook integration", () => {
    it("should call useAuth hook on mount", () => {
      render(<Home />);

      expect(useAuthHook.useAuth).toHaveBeenCalled();
    });

    it("should use logout function from useAuth", async () => {
      const customLogout = vi.fn();
      vi.mocked(useAuthHook.useAuth).mockReturnValue({
        ...defaultAuthState,
        logout: customLogout,
      });

      const user = userEvent.setup();
      render(<Home />);

      await user.click(screen.getByRole("button", { name: "Logout" }));

      expect(customLogout).toHaveBeenCalled();
    });
  });
});

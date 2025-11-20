import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../test-utils";
import { ProtectedRoute } from "../../src/components/ProtectedRoute";
import * as cookiesUtil from "../../src/utils/cookies";
import { Router, useLocation } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { useEffect } from "react";

// Mock cookies utility
vi.mock("../../src/utils/cookies", () => ({
  getToken: vi.fn(),
  setToken: vi.fn(),
  removeToken: vi.fn(),
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

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render children when user is authenticated", () => {
    vi.mocked(cookiesUtil.getToken).mockReturnValue("valid-token");

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should redirect to login when user is not authenticated", async () => {
    vi.mocked(cookiesUtil.getToken).mockReturnValue(undefined);

    let currentLocation = "";
    const { hook } = memoryLocation({ path: "/home" });

    render(
      <Router hook={hook}>
        <LocationCapture onLocationChange={(loc) => (currentLocation = loc)} />
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </Router>
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();

    // Wait for redirect to complete
    await waitFor(() => {
      expect(currentLocation).toBe("/login");
    });
  });

  it("should redirect to login when token is empty string", async () => {
    vi.mocked(cookiesUtil.getToken).mockReturnValue("");

    let currentLocation = "";
    const { hook } = memoryLocation({ path: "/home" });

    render(
      <Router hook={hook}>
        <LocationCapture onLocationChange={(loc) => (currentLocation = loc)} />
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </Router>
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(currentLocation).toBe("/login");
    });
  });

  it("should render multiple children when authenticated", () => {
    vi.mocked(cookiesUtil.getToken).mockReturnValue("valid-token");

    render(
      <ProtectedRoute>
        <div>First Child</div>
        <div>Second Child</div>
        <span>Third Child</span>
      </ProtectedRoute>
    );

    expect(screen.getByText("First Child")).toBeInTheDocument();
    expect(screen.getByText("Second Child")).toBeInTheDocument();
    expect(screen.getByText("Third Child")).toBeInTheDocument();
  });

  it("should call getToken on each render", () => {
    const getTokenSpy = vi.mocked(cookiesUtil.getToken);
    getTokenSpy.mockReturnValue("token");

    const { rerender } = render(
      <ProtectedRoute>
        <div>Content</div>
      </ProtectedRoute>
    );

    expect(getTokenSpy).toHaveBeenCalledTimes(1);

    rerender(
      <ProtectedRoute>
        <div>Content</div>
      </ProtectedRoute>
    );

    expect(getTokenSpy).toHaveBeenCalledTimes(2);
  });

  it("should handle complex children structures", () => {
    vi.mocked(cookiesUtil.getToken).mockReturnValue("valid-token");

    render(
      <ProtectedRoute>
        <div>
          <h1>Title</h1>
          <section>
            <p>Paragraph</p>
            <button>Button</button>
          </section>
        </div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Paragraph")).toBeInTheDocument();
    expect(screen.getByText("Button")).toBeInTheDocument();
  });

  it("should redirect immediately without rendering children when not authenticated", async () => {
    vi.mocked(cookiesUtil.getToken).mockReturnValue(undefined);

    const mockEffect = vi.fn();
    const ChildWithEffect = () => {
      mockEffect();
      return <div>Child</div>;
    };

    let currentLocation = "";
    const { hook } = memoryLocation({ path: "/protected" });

    render(
      <Router hook={hook}>
        <LocationCapture onLocationChange={(loc) => (currentLocation = loc)} />
        <ProtectedRoute>
          <ChildWithEffect />
        </ProtectedRoute>
      </Router>
    );

    // Child effect should not be called since redirect happens first
    expect(mockEffect).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(currentLocation).toBe("/login");
    });
  });
});

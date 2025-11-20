import Cookies from "js-cookie";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getToken, removeToken, setToken } from "../../src/utils/cookies";

// Mock js-cookie
vi.mock("js-cookie", () => ({
  default: {
    set: vi.fn(),
    get: vi.fn(),
    remove: vi.fn(),
  },
}));

describe("cookies utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("setToken", () => {
    it("should set token with correct name and value", () => {
      const token = "test-token-123";
      setToken(token);

      expect(Cookies.set).toHaveBeenCalledWith("_tenpo_token", token, {
        expires: 7,
      });
    });

    it("should set token with 7 days expiration", () => {
      setToken("token");

      expect(Cookies.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        { expires: 7 }
      );
    });

    it("should handle empty string token", () => {
      setToken("");

      expect(Cookies.set).toHaveBeenCalledWith("_tenpo_token", "", {
        expires: 7,
      });
    });

    it("should handle long token strings", () => {
      const longToken = "a".repeat(1000);
      setToken(longToken);

      expect(Cookies.set).toHaveBeenCalledWith("_tenpo_token", longToken, {
        expires: 7,
      });
    });

    it("should handle tokens with special characters", () => {
      const specialToken = "token!@#$%^&*()_+-=[]{}|;:',.<>?/~`";
      setToken(specialToken);

      expect(Cookies.set).toHaveBeenCalledWith("_tenpo_token", specialToken, {
        expires: 7,
      });
    });
  });

  describe("getToken", () => {
    it("should return token when it exists", () => {
      const expectedToken = "existing-token";
      vi.mocked(Cookies.get).mockReturnValue(expectedToken);

      const result = getToken();

      expect(Cookies.get).toHaveBeenCalledWith("_tenpo_token");
      expect(result).toBe(expectedToken);
    });

    it("should return undefined when token does not exist", () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined);

      const result = getToken();

      expect(Cookies.get).toHaveBeenCalledWith("_tenpo_token");
      expect(result).toBeUndefined();
    });

    it("should return empty string if cookie value is empty", () => {
      vi.mocked(Cookies.get).mockReturnValue("");

      const result = getToken();

      expect(result).toBe("");
    });

    it("should use correct cookie name", () => {
      getToken();

      expect(Cookies.get).toHaveBeenCalledWith("_tenpo_token");
    });

    it("should call Cookies.get exactly once", () => {
      getToken();

      expect(Cookies.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("removeToken", () => {
    it("should remove token with correct name", () => {
      removeToken();

      expect(Cookies.remove).toHaveBeenCalledWith("_tenpo_token");
    });

    it("should call Cookies.remove exactly once", () => {
      removeToken();

      expect(Cookies.remove).toHaveBeenCalledTimes(1);
    });

    it("should return void", () => {
      const result = removeToken();

      expect(result).toBeUndefined();
    });
  });

  describe("token lifecycle", () => {
    it("should set and then get the same token", () => {
      const token = "lifecycle-token";
      vi.mocked(Cookies.get).mockReturnValue(token);

      setToken(token);
      const retrieved = getToken();

      expect(retrieved).toBe(token);
    });

    it("should return undefined after removing token", () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined);

      removeToken();
      const retrieved = getToken();

      expect(retrieved).toBeUndefined();
    });
  });

  describe("cookie name consistency", () => {
    it("should use same cookie name across all functions", () => {
      const cookieName = "_tenpo_token";

      setToken("token");
      expect(Cookies.set).toHaveBeenCalledWith(
        cookieName,
        expect.any(String),
        expect.any(Object)
      );

      getToken();
      expect(Cookies.get).toHaveBeenCalledWith(cookieName);

      removeToken();
      expect(Cookies.remove).toHaveBeenCalledWith(cookieName);
    });
  });
});

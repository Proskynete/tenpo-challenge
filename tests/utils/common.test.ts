import { describe, it, expect, beforeEach } from "vitest";
import { getLocale } from "../../src/utils/common";

describe("common utilities", () => {
  describe("getLocale", () => {
    beforeEach(() => {
      // Reset navigator.languages before each test
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        configurable: true,
        value: ["en-US", "en"],
      });
    });

    it("should return first language from navigator.languages", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        configurable: true,
        value: ["en-US", "en", "es"],
      });

      const result = getLocale();

      expect(result).toBe("en-US");
    });

    it("should handle single language preference", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        configurable: true,
        value: ["es-ES"],
      });

      const result = getLocale();

      expect(result).toBe("es-ES");
    });

    it("should handle multiple language preferences", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        configurable: true,
        value: ["fr-FR", "en-GB", "de-DE"],
      });

      const result = getLocale();

      expect(result).toBe("fr-FR");
    });

    it("should return language code without region", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        configurable: true,
        value: ["en"],
      });

      const result = getLocale();

      expect(result).toBe("en");
    });

    it("should handle region-specific locales", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        configurable: true,
        value: ["es-MX"],
      });

      const result = getLocale();

      expect(result).toBe("es-MX");
    });

    it("should handle empty languages array", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        configurable: true,
        value: [],
      });

      const result = getLocale();

      expect(result).toBeUndefined();
    });

    it("should handle Chinese locales", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        configurable: true,
        value: ["zh-CN", "zh"],
      });

      const result = getLocale();

      expect(result).toBe("zh-CN");
    });

    it("should handle Japanese locale", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        configurable: true,
        value: ["ja-JP"],
      });

      const result = getLocale();

      expect(result).toBe("ja-JP");
    });

    it("should handle Portuguese locales", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        configurable: true,
        value: ["pt-BR", "pt-PT"],
      });

      const result = getLocale();

      expect(result).toBe("pt-BR");
    });

    it("should consistently return same value on multiple calls", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        configurable: true,
        value: ["en-US"],
      });

      const firstCall = getLocale();
      const secondCall = getLocale();

      expect(firstCall).toBe(secondCall);
    });

    it("should handle case-sensitive locale codes", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        configurable: true,
        value: ["en-us"], // lowercase
      });

      const result = getLocale();

      expect(result).toBe("en-us");
    });

    it("should handle standard BCP 47 language tags", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        configurable: true,
        value: ["en-US-x-twain"], // Extended language tag
      });

      const result = getLocale();

      expect(result).toBe("en-US-x-twain");
    });
  });

  describe("getLocale browser compatibility", () => {
    it("should work with modern browser navigator API", () => {
      expect(window.navigator).toBeDefined();
      expect(window.navigator.languages).toBeDefined();
    });

    it("should return string or undefined", () => {
      const result = getLocale();

      expect(typeof result === "string" || result === undefined).toBe(true);
    });

    it("should handle readonly navigator.languages", () => {
      // In real browsers, navigator.languages is readonly
      const result = getLocale();

      expect(result).toBeDefined();
    });
  });

  describe("getLocale return type", () => {
    it("should return string when languages array has values", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        configurable: true,
        value: ["en-US"],
      });

      const result = getLocale();

      expect(typeof result).toBe("string");
    });

    it("should access first index of array", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        configurable: true,
        value: ["first", "second", "third"],
      });

      const result = getLocale();

      expect(result).toBe("first");
    });
  });
});

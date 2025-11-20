import { beforeEach, describe, expect, it } from "vitest";

import { formatNumber } from "../../src/utils/number";

describe("number utilities", () => {
  beforeEach(() => {
    // Set a consistent locale for testing
    Object.defineProperty(window.navigator, "languages", {
      writable: true,
      value: ["en-US"],
    });
  });

  describe("formatNumber", () => {
    it("should format integer numbers", () => {
      const result = formatNumber(1234567);

      expect(result).toBe("1,234,567");
    });

    it("should format zero", () => {
      const result = formatNumber(0);

      expect(result).toBe("0");
    });

    it("should format single digit numbers", () => {
      const result = formatNumber(5);

      expect(result).toBe("5");
    });

    it("should format double digit numbers", () => {
      const result = formatNumber(42);

      expect(result).toBe("42");
    });

    it("should format three digit numbers without separator", () => {
      const result = formatNumber(999);

      expect(result).toBe("999");
    });

    it("should format four digit numbers with separator", () => {
      const result = formatNumber(1000);

      expect(result).toBe("1,000");
    });

    it("should format large numbers", () => {
      const result = formatNumber(1000000);

      expect(result).toBe("1,000,000");
    });

    it("should format very large numbers", () => {
      const result = formatNumber(1234567890);

      expect(result).toBe("1,234,567,890");
    });

    it("should format decimal numbers", () => {
      const result = formatNumber(1234.56);

      expect(result).toBe("1,234.56");
    });

    it("should format negative numbers", () => {
      const result = formatNumber(-1234);

      expect(result).toBe("-1,234");
    });

    it("should format negative decimal numbers", () => {
      const result = formatNumber(-1234.56);

      expect(result).toBe("-1,234.56");
    });

    it("should handle different locales - European format", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        value: ["de-DE"],
      });

      const result = formatNumber(1234.56);

      // German locale uses period for thousands and comma for decimal
      expect(result).toBe("1.234,56");
    });

    it("should handle different locales - French format", () => {
      Object.defineProperty(window.navigator, "languages", {
        writable: true,
        value: ["fr-FR"],
      });

      const result = formatNumber(1234.56);

      // French locale uses non-breaking space and comma
      expect(result).toMatch(/1.*234.*56/);
    });

    it("should format number with many decimal places", () => {
      const result = formatNumber(123.456789);

      expect(result).toBe("123.457");
    });

    it("should format fractional number less than 1", () => {
      const result = formatNumber(0.99);

      expect(result).toBe("0.99");
    });

    it("should format small decimal", () => {
      const result = formatNumber(0.01);

      expect(result).toBe("0.01");
    });
  });
});

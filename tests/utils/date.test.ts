import { describe, it, expect, vi, beforeEach } from "vitest";
import { formatDate } from "../../src/utils/date";
import * as commonUtils from "../../src/utils/common";

// Mock common utils
vi.mock("../../src/utils/common", () => ({
  getLocale: vi.fn(),
}));

describe("formatDate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(commonUtils.getLocale).mockReturnValue("en-US");
  });

  describe("with Date object input", () => {
    it("should format Date object correctly", () => {
      const date = new Date("2024-03-15T10:30:00");
      const result = formatDate(date);

      expect(result).toContain("2024");
      expect(result).toContain("Mar");
      expect(result).toContain("15");
    });

    it("should use locale from getLocale function", () => {
      const date = new Date("2024-01-01");
      formatDate(date);

      expect(commonUtils.getLocale).toHaveBeenCalled();
    });

    it("should handle leap year dates", () => {
      const date = new Date(2024, 1, 29); // Month is 0-indexed, so 1 = February
      const result = formatDate(date);

      expect(result).toContain("Feb");
      expect(result).toContain("29");
      expect(result).toContain("2024");
    });

    it("should handle year boundaries", () => {
      const date = new Date(2024, 0, 1); // January 1, 2024
      const result = formatDate(date);

      expect(result).toContain("Jan");
      expect(result).toContain("1");
      expect(result).toContain("2024");
    });

    it("should handle end of year", () => {
      const date = new Date(2024, 11, 31); // December 31, 2024
      const result = formatDate(date);

      expect(result).toContain("Dec");
      expect(result).toContain("31");
      expect(result).toContain("2024");
    });
  });

  describe("with string input", () => {
    it("should format ISO date string correctly", () => {
      const dateString = "2024-06-20";
      const result = formatDate(dateString);

      expect(result).toContain("2024");
      expect(result).toContain("Jun");
      expect(result).toContain("20");
    });

    it("should format date-time string correctly", () => {
      const dateString = "2024-06-20T15:30:00";
      const result = formatDate(dateString);

      expect(result).toContain("2024");
      expect(result).toContain("Jun");
      expect(result).toContain("20");
    });

    it("should handle dates with timezone", () => {
      const dateString = "2024-06-20T15:30:00Z";
      const result = formatDate(dateString);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should format old dates correctly", () => {
      const dateString = "1990-01-15";
      const result = formatDate(dateString);

      expect(result).toContain("1990");
      expect(result).toContain("Jan");
    });

    it("should format future dates correctly", () => {
      const dateString = "2030-12-25";
      const result = formatDate(dateString);

      expect(result).toContain("2030");
      expect(result).toContain("Dec");
    });
  });

  describe("locale handling", () => {
    it("should format with en-US locale", () => {
      vi.mocked(commonUtils.getLocale).mockReturnValue("en-US");
      const date = new Date("2024-03-15");

      const result = formatDate(date);

      expect(result).toContain("Mar");
    });

    it("should format with es-ES locale", () => {
      vi.mocked(commonUtils.getLocale).mockReturnValue("es-ES");
      const date = new Date("2024-03-15");

      const result = formatDate(date);

      // Spanish abbreviation for March
      expect(result).toBeDefined();
    });

    it("should call getLocale for each format call", () => {
      const date = new Date("2024-03-15");

      formatDate(date);
      formatDate(date);

      expect(commonUtils.getLocale).toHaveBeenCalledTimes(2);
    });
  });

  describe("format options", () => {
    it("should include year in numeric format", () => {
      const date = new Date("2024-03-15");
      const result = formatDate(date);

      expect(result).toMatch(/2024/);
    });

    it("should include month in short format", () => {
      const date = new Date("2024-03-15");
      const result = formatDate(date);

      // Should be abbreviated month (e.g., "Mar" not "March")
      expect(result.length).toBeLessThan(20);
    });

    it("should include day in numeric format", () => {
      const date = new Date(2024, 2, 5); // March 5, 2024
      const result = formatDate(date);

      expect(result).toContain("5");
    });
  });

  describe("edge cases", () => {
    it("should handle January 1st, 1970 (Unix epoch)", () => {
      const date = new Date(1970, 0, 1); // January 1, 1970
      const result = formatDate(date);

      expect(result).toContain("1970");
      expect(result).toContain("Jan");
      expect(result).toContain("1");
    });

    it("should handle dates in different centuries", () => {
      const date = new Date(1899, 11, 31); // December 31, 1899
      const result = formatDate(date);

      expect(result).toContain("1899");
    });

    it("should handle single digit days", () => {
      const date = new Date(2024, 2, 1); // March 1, 2024
      const result = formatDate(date);

      expect(result).toContain("1");
      expect(result).toContain("Mar");
    });

    it("should handle single digit months (as string)", () => {
      const dateString = "2024-01-15";
      const result = formatDate(dateString);

      expect(result).toContain("Jan");
    });
  });

  describe("input validation", () => {
    it("should handle ISO 8601 format", () => {
      const result = formatDate("2024-03-15T10:30:00.000Z");

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });

    it("should handle date-only strings without time", () => {
      const result = formatDate("2024-03-15");

      expect(result).toContain("2024");
    });

    it("should convert string to Date before formatting", () => {
      const dateString = "2024-03-15";
      const expectedDate = new Date(dateString);

      const result = formatDate(dateString);

      // Should produce same result as passing Date object
      expect(result).toBe(formatDate(expectedDate));
    });
  });

  describe("all months", () => {
    const months = [
      { month: "01", abbr: "Jan" },
      { month: "02", abbr: "Feb" },
      { month: "03", abbr: "Mar" },
      { month: "04", abbr: "Apr" },
      { month: "05", abbr: "May" },
      { month: "06", abbr: "Jun" },
      { month: "07", abbr: "Jul" },
      { month: "08", abbr: "Aug" },
      { month: "09", abbr: "Sep" },
      { month: "10", abbr: "Oct" },
      { month: "11", abbr: "Nov" },
      { month: "12", abbr: "Dec" },
    ];

    months.forEach(({ month, abbr }) => {
      it(`should format ${abbr} correctly`, () => {
        const date = new Date(`2024-${month}-15`);
        const result = formatDate(date);

        expect(result).toContain(abbr);
      });
    });
  });
});

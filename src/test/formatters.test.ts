import { describe, expect, it } from "vitest";
import {
  formatCompactNumber,
  formatEngagementRate,
  formatExactNumber,
} from "@/lib/formatters";

describe("formatCompactNumber", () => {
  it("formats billions", () => {
    expect(formatCompactNumber(1_500_000_000)).toBe("1.5B");
  });

  it("formats millions", () => {
    expect(formatCompactNumber(678_546_942)).toBe("678.5M");
    expect(formatCompactNumber(1_000_000)).toBe("1M"); // trim trailing zero
  });

  it("formats thousands", () => {
    expect(formatCompactNumber(1_200)).toBe("1.2K");
    expect(formatCompactNumber(1_000)).toBe("1K");
  });

  it("formats small numbers as-is", () => {
    expect(formatCompactNumber(999)).toBe("999");
    expect(formatCompactNumber(0)).toBe("0");
  });

  it("handles non-finite gracefully", () => {
    expect(formatCompactNumber(NaN)).toBe("0");
    expect(formatCompactNumber(Infinity)).toBe("0");
  });
});

describe("formatEngagementRate", () => {
  it("converts the raw fraction (0.00024667) to a correct percentage", () => {
    const rate = 0.00024667121703718473; // instagram's actual engagement_rate
    expect(formatEngagementRate(rate)).toBe("0.02%");
  });

  it("returns a dash for undefined/null", () => {
    expect(formatEngagementRate(undefined)).toBe("—");
    expect(formatEngagementRate(null)).toBe("—");
  });

  it("formats a realistic mid-tier rate", () => {
    expect(formatEngagementRate(0.035)).toBe("3.50%");
  });
});

describe("formatExactNumber", () => {
  it("formats with locale separators", () => {
    expect(formatExactNumber(167_378)).toBe("167,378");
  });

  it("returns dash for missing values", () => {
    expect(formatExactNumber(undefined)).toBe("—");
    expect(formatExactNumber(null)).toBe("—");
  });
});

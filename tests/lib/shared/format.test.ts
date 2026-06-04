import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  formatBlockNumber,
  formatGasUsedPercent,
  formatInteger,
  timeAgo,
  truncateHash,
} from "@/lib/shared/format";

describe("formatInteger", () => {
  it("formats with US-style thousands separators", () => {
    expect(formatInteger(10976937)).toBe("10,976,937");
    expect(formatInteger(1000n)).toBe("1,000");
  });
});

describe("formatBlockNumber", () => {
  it("formats bigint block numbers", () => {
    expect(formatBlockNumber(1234567n)).toBe("1,234,567");
  });
});

describe("truncateHash", () => {
  it("truncates long hashes", () => {
    const hash =
      "0x4a481e4649da999d92db0585c36cba94c18a33747e95dc235330e6c737c6f975";
    expect(truncateHash(hash)).toBe("0x4a481e46…c6f975");
  });

  it("returns short values unchanged", () => {
    expect(truncateHash("0xabc")).toBe("0xabc");
  });
});

describe("formatGasUsedPercent", () => {
  it("calculates gas used percentage", () => {
    expect(formatGasUsedPercent(50n, 100n)).toBe(50);
  });

  it("returns 0 when gas limit is zero", () => {
    expect(formatGasUsedPercent(50n, 0n)).toBe(0);
  });
});

describe("timeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-02T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "just now" for recent timestamps', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(timeAgo(now - 2)).toBe("just now");
  });

  it("returns minutes ago", () => {
    const now = Math.floor(Date.now() / 1000);
    expect(timeAgo(now - 120)).toBe("2 mins ago");
  });
});

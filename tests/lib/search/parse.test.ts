import { describe, expect, it } from "vitest";
import { parseSearchQuery, searchResultPath } from "@/lib/search/parse";

describe("parseSearchQuery", () => {
  it("returns invalid for empty input", () => {
    const result = parseSearchQuery("   ");
    expect(result.type).toBe("invalid");
    if (result.type === "invalid") {
      expect(result.reason).toContain("Enter an address");
    }
  });

  it("parses block number", () => {
    expect(parseSearchQuery("10976937")).toEqual({
      type: "block",
      value: "10976937",
    });
  });

  it("parses checksummed address", () => {
    const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    expect(parseSearchQuery(address)).toEqual({
      type: "address",
      value: address,
    });
  });

  it("parses transaction hash", () => {
    const hash =
      "0x4a481e4649da999d92db0585c36cba94c18a33747e95dc235330e6c737c6f975";
    expect(parseSearchQuery(hash)).toEqual({
      type: "tx",
      value: hash,
    });
  });

  it("returns invalid for malformed input", () => {
    const result = parseSearchQuery("not-a-valid-query");
    expect(result.type).toBe("invalid");
  });
});

describe("searchResultPath", () => {
  it("builds paths for each result type", () => {
    expect(
      searchResultPath({
        type: "block",
        value: "123",
      }),
    ).toBe("/block/123");
    expect(
      searchResultPath({
        type: "address",
        value: "0xabc",
      }),
    ).toBe("/address/0xabc");
    expect(
      searchResultPath({
        type: "tx",
        value: "0xdef",
      }),
    ).toBe("/tx/0xdef");
  });
});

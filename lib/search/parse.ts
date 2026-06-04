import { isAddress, isHash } from "viem";

export type SearchResult =
  | { type: "address"; value: string }
  | { type: "tx"; value: string }
  | { type: "block"; value: string }
  | { type: "invalid"; value: string; reason: string };

export function parseSearchQuery(raw: string): SearchResult {
  const query = raw.trim();

  if (!query) {
    return {
      type: "invalid",
      value: query,
      reason: "Enter an address, tx hash, or block number.",
    };
  }

  if (/^\d+$/.test(query)) {
    return { type: "block", value: query };
  }

  if (isAddress(query)) {
    return { type: "address", value: query };
  }

  if (isHash(query)) {
    return { type: "tx", value: query };
  }

  return {
    type: "invalid",
    value: query,
    reason: "Invalid format. Use 0x address, 0x hash, or block number.",
  };
}

export function searchResultPath(
  result: Exclude<SearchResult, { type: "invalid" }>,
): string {
  switch (result.type) {
    case "address":
      return `/address/${result.value}`;
    case "tx":
      return `/tx/${result.value}`;
    case "block":
      return `/block/${result.value}`;
  }
}

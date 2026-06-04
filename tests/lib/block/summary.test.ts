import { describe, expect, it } from "vitest";
import type { Block } from "viem";
import { blockToSummary } from "@/lib/block/summary";

function createMockBlock(overrides: Partial<Block> = {}): Block {
  return {
    number: 12345n,
    hash: "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
    timestamp: 1710000000n,
    gasUsed: 21000n,
    gasLimit: 30000000n,
    transactions: [
      {
        hash: "0x4a481e4649da999d92db0585c36cba94c18a33747e95dc235330e6c737c6f975",
        from: "0x0000000000000000000000000000000000000001",
        to: "0x0000000000000000000000000000000000000002",
        value: 1000n,
      },
    ],
    ...overrides,
  } as Block;
}

describe("blockToSummary", () => {
  it("maps block fields to summary", () => {
    const summary = blockToSummary(createMockBlock());

    expect(summary).toEqual({
      number: "12345",
      hash: "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
      timestamp: "1710000000",
      transactionCount: 1,
      gasUsed: "21000",
      gasLimit: "30000000",
    });
  });

  it("uses transaction count when transactions is a number", () => {
    const summary = blockToSummary(
      createMockBlock({ transactions: 42 as unknown as Block["transactions"] }),
    );

    expect(summary.transactionCount).toBe(42);
  });
});

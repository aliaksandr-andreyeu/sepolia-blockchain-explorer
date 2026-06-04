import type { Block } from "viem";
import type { BlockSummary } from "@/lib/shared/types";

export function blockToSummary(block: Block): BlockSummary {
  const txs = block.transactions;
  const transactionCount = Array.isArray(txs) ? txs.length : txs;

  return {
    number: block.number!.toString(),
    hash: block.hash!,
    timestamp: block.timestamp.toString(),
    transactionCount,
    gasUsed: block.gasUsed.toString(),
    gasLimit: block.gasLimit.toString(),
  };
}

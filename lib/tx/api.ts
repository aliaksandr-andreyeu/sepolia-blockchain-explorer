import { getPublicClient } from "@/lib/shared/client";
import type { TransactionSummary } from "@/lib/shared/types";

export async function fetchLatestTransactions(
  limit = 20,
  maxBlocks = 12,
): Promise<TransactionSummary[]> {
  const client = getPublicClient();
  if (!client) return [];

  const latestNumber = await client.getBlockNumber();
  const transactions: TransactionSummary[] = [];

  for (let i = 0; i < maxBlocks && transactions.length < limit; i++) {
    const block = await client.getBlock({
      blockNumber: latestNumber - BigInt(i),
      includeTransactions: true,
    });

    if (!block.number) continue;

    const blockTxs = Array.isArray(block.transactions)
      ? [...block.transactions].reverse()
      : [];

    for (const tx of blockTxs) {
      if (typeof tx === "string") continue;

      transactions.push({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value.toString(),
        blockNumber: block.number.toString(),
        timestamp: block.timestamp.toString(),
      });

      if (transactions.length >= limit) break;
    }
  }

  return transactions;
}

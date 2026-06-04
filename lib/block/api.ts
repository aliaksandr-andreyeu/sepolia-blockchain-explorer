import type { Hash } from "viem";
import { blockToSummary } from "@/lib/block/summary";
import { getPublicClient } from "@/lib/shared/client";
import { formatGweiPrice, timeAgo } from "@/lib/shared/format";
import type { BlockSummary, NetworkStats } from "@/lib/shared/types";

export async function fetchLatestBlocks(count = 10): Promise<BlockSummary[]> {
  const client = getPublicClient();
  if (!client) return [];

  const latestNumber = await client.getBlockNumber();
  const numbers = Array.from(
    { length: count },
    (_, i) => latestNumber - BigInt(i),
  );

  const blocks = await Promise.all(
    numbers.map((n) =>
      client.getBlock({ blockNumber: n, includeTransactions: false }),
    ),
  );

  return blocks.map(blockToSummary);
}

export async function fetchNetworkStats(): Promise<NetworkStats | null> {
  const client = getPublicClient();
  if (!client) return null;

  const [blockNumber, gasPrice, latestBlock] = await Promise.all([
    client.getBlockNumber(),
    client.getGasPrice(),
    client.getBlock({ blockTag: "latest", includeTransactions: false }),
  ]);

  return {
    blockNumber: blockNumber.toString(),
    gasPrice: formatGweiPrice(gasPrice),
    latestBlockAge: timeAgo(latestBlock.timestamp),
  };
}

export async function fetchBlockDetail(id: string) {
  const client = getPublicClient();
  if (!client) return null;

  const block = /^\d+$/.test(id)
    ? await client.getBlock({
        blockNumber: BigInt(id),
        includeTransactions: true,
      })
    : await client.getBlock({
        blockHash: id as Hash,
        includeTransactions: true,
      });

  return block;
}

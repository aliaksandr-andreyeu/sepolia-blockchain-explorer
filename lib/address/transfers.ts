import type { Address } from "viem";
import { getAlchemyHttpUrl } from "@/lib/shared/chain";
import { formatDecimal } from "@/lib/shared/format";
import type { TransferSummary } from "@/lib/shared/types";

type AlchemyTransfer = {
  uniqueId: string;
  hash: string;
  from: string;
  to: string | null;
  value: number | null;
  asset: string | null;
  category: string;
  blockNum: string;
  metadata?: { blockTimestamp?: string };
};

type AssetTransfersResult = {
  transfers: AlchemyTransfer[];
  pageKey?: string;
};

type TransferCategory =
  | "external"
  | "internal"
  | "erc20"
  | "erc721"
  | "erc1155";

async function alchemyRequest<T>(
  method: string,
  params: unknown[],
): Promise<T> {
  const url = getAlchemyHttpUrl();
  if (!url) return null as T;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    next: { revalidate: 12 },
  });

  const data = (await response.json()) as {
    result?: T;
    error?: { message: string };
  };

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.result as T;
}

function formatTransferValue(
  value: number | null,
  asset: string | null,
): string {
  if (value == null) return "—";
  const symbol = asset ?? "TOKEN";
  return `${formatDecimal(value, { maximumFractionDigits: 8 })} ${symbol}`;
}

function toTransferSummary(
  transfer: AlchemyTransfer,
  address: Address,
): TransferSummary {
  const blockNumber = BigInt(transfer.blockNum).toString();
  const isOut = transfer.from.toLowerCase() === address.toLowerCase();

  return {
    uniqueId: transfer.uniqueId,
    hash: transfer.hash,
    from: transfer.from,
    to: transfer.to,
    value: formatTransferValue(transfer.value, transfer.asset),
    category: transfer.category,
    blockNumber,
    timestamp: transfer.metadata?.blockTimestamp ?? null,
    direction: isOut ? "out" : "in",
  };
}

async function fetchTransfersForAddress(
  address: Address,
  field: "fromAddress" | "toAddress",
  maxCount: number,
): Promise<AlchemyTransfer[]> {
  const result = await alchemyRequest<AssetTransfersResult | null>(
    "alchemy_getAssetTransfers",
    [
      {
        fromBlock: "0x0",
        toBlock: "latest",
        [field]: address,
        category: [
          "external",
          "internal",
          "erc20",
        ] satisfies TransferCategory[],
        excludeZeroValue: false,
        order: "desc",
        withMetadata: true,
        maxCount: `0x${maxCount.toString(16)}`,
      },
    ],
  );

  return result?.transfers ?? [];
}

export async function fetchAddressTransfers(
  address: Address,
  maxCount = 25,
): Promise<TransferSummary[]> {
  if (!getAlchemyHttpUrl()) return [];

  const [sent, received] = await Promise.all([
    fetchTransfersForAddress(address, "fromAddress", maxCount).catch(() => []),
    fetchTransfersForAddress(address, "toAddress", maxCount).catch(() => []),
  ]);

  const merged = new Map<string, TransferSummary>();

  for (const transfer of [...sent, ...received]) {
    merged.set(transfer.uniqueId, toTransferSummary(transfer, address));
  }

  return [...merged.values()]
    .sort((a, b) => {
      const blockDiff = BigInt(b.blockNumber) - BigInt(a.blockNumber);
      if (blockDiff !== 0n) return blockDiff > 0n ? 1 : -1;
      return b.hash.localeCompare(a.hash);
    })
    .slice(0, maxCount);
}

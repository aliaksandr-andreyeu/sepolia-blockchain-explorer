import Link from "next/link";
import { notFound } from "next/navigation";
import { formatEther } from "viem";
import { DataRow } from "@/components/shared/ui/DataRow";
import { Header } from "@/components/explorer/Header";
import { SetupNotice } from "@/components/explorer/SetupNotice";
import { fetchBlockDetail } from "@/lib/block/api";
import { getPublicClient } from "@/lib/shared/client";
import {
  formatBlockNumber,
  formatDecimal,
  formatGasUsedPercent,
  formatInteger,
  formatTimestamp,
  timeAgo,
  truncateHash,
} from "@/lib/shared/format";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BlockPage({ params }: PageProps) {
  const { id } = await params;

  if (!getPublicClient()) {
    return (
      <div className="min-h-full bg-explorer-bg">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <SetupNotice />
        </main>
      </div>
    );
  }

  const block = await fetchBlockDetail(id).catch(() => null);
  if (!block || block.number == null || block.hash == null) notFound();

  const gasPct = formatGasUsedPercent(block.gasUsed, block.gasLimit);
  const txs = Array.isArray(block.transactions) ? block.transactions : [];

  return (
    <div className="min-h-full bg-explorer-bg">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <nav className="mb-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-explorer-coral">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-explorer-slate">
            Block {formatBlockNumber(block.number)}
          </span>
        </nav>

        <h1 className="mb-6 text-2xl font-semibold text-explorer-slate">
          Block #{formatBlockNumber(block.number)}
        </h1>

        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <dl>
            <DataRow label="Block Height">
              {formatBlockNumber(block.number)}
            </DataRow>
            <DataRow label="Status">
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700">
                Finalized
              </span>
            </DataRow>
            <DataRow label="Timestamp">
              {formatTimestamp(block.timestamp)} ({timeAgo(block.timestamp)})
            </DataRow>
            <DataRow label="Transactions">{formatInteger(txs.length)}</DataRow>
            <DataRow label="Block Hash">{block.hash}</DataRow>
            <DataRow label="Parent Hash">
              {block.parentHash ? (
                <Link
                  href={`/block/${block.parentHash}`}
                  className="text-explorer-coral hover:underline"
                >
                  {block.parentHash}
                </Link>
              ) : (
                "—"
              )}
            </DataRow>
            <DataRow label="Gas Used">
              {formatInteger(block.gasUsed)} ({gasPct.toFixed(2)}%)
            </DataRow>
            <DataRow label="Gas Limit">{formatInteger(block.gasLimit)}</DataRow>
          </dl>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-explorer-slate">
              Transactions ({txs.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-medium">Tx Hash</th>
                  <th className="px-4 py-3 font-medium">From</th>
                  <th className="px-4 py-3 font-medium">To</th>
                  <th className="px-4 py-3 font-medium text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {txs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      No transactions in this block
                    </td>
                  </tr>
                ) : (
                  txs.map((tx) => {
                    if (typeof tx === "string") return null;
                    return (
                      <tr key={tx.hash} className="hover:bg-explorer-peach/10">
                        <td className="px-4 py-3">
                          <Link
                            href={`/tx/${tx.hash}`}
                            className="font-mono text-explorer-coral hover:underline"
                          >
                            {truncateHash(tx.hash)}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/address/${tx.from}`}
                            className="font-mono text-explorer-coral hover:underline"
                          >
                            {truncateHash(tx.from)}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          {tx.to ? (
                            <Link
                              href={`/address/${tx.to}`}
                              className="font-mono text-explorer-coral hover:underline"
                            >
                              {truncateHash(tx.to)}
                            </Link>
                          ) : (
                            <span className="text-gray-400">
                              Contract Creation
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {formatDecimal(Number(formatEther(tx.value)), {
                            maximumFractionDigits: 6,
                          })}{" "}
                          ETH
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

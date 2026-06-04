import Link from "next/link";
import { notFound } from "next/navigation";
import { formatEther, formatGwei } from "viem";
import { DataRow } from "@/components/shared/ui/DataRow";
import { Header } from "@/components/explorer/Header";
import { SetupNotice } from "@/components/explorer/SetupNotice";
import { getPublicClient } from "@/lib/shared/client";
import {
  formatBlockNumber,
  formatDecimal,
  formatInteger,
} from "@/lib/shared/format";

type PageProps = {
  params: Promise<{ hash: string }>;
};

export default async function TransactionPage({ params }: PageProps) {
  const { hash } = await params;
  const client = getPublicClient();

  if (!client) {
    return (
      <div className="min-h-full bg-explorer-bg">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <SetupNotice />
        </main>
      </div>
    );
  }

  const [tx, receipt] = await Promise.all([
    client.getTransaction({ hash: hash as `0x${string}` }).catch(() => null),
    client
      .getTransactionReceipt({ hash: hash as `0x${string}` })
      .catch(() => null),
  ]);

  if (!tx) notFound();

  const isSuccess = receipt?.status === "success";
  const isFailed = receipt?.status === "reverted";
  const fee =
    receipt != null
      ? receipt.gasUsed * (receipt.effectiveGasPrice ?? tx.gasPrice ?? 0n)
      : null;

  return (
    <div className="min-h-full bg-explorer-bg">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <nav className="mb-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-explorer-coral">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-explorer-slate">Transaction Details</span>
        </nav>

        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-explorer-slate">
            Transaction Details
          </h1>
          {receipt ? (
            <span
              className={`rounded px-2.5 py-1 text-xs font-semibold ${
                isSuccess
                  ? "bg-emerald-50 text-emerald-700"
                  : isFailed
                    ? "bg-red-50 text-red-700"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {isSuccess ? "Success" : isFailed ? "Failed" : "Unknown"}
            </span>
          ) : (
            <span className="rounded bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              Pending
            </span>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <dl>
            <DataRow label="Transaction Hash">{tx.hash}</DataRow>
            <DataRow label="Status">
              {receipt
                ? isSuccess
                  ? "Success"
                  : "Failed"
                : "Pending (not yet mined)"}
            </DataRow>
            <DataRow label="Block">
              {tx.blockNumber != null ? (
                <Link
                  href={`/block/${tx.blockNumber}`}
                  className="text-explorer-coral hover:underline"
                >
                  {formatBlockNumber(tx.blockNumber)}
                </Link>
              ) : (
                "Pending"
              )}
            </DataRow>
            <DataRow label="Timestamp">
              {receipt?.blockNumber != null
                ? `Included in block ${formatBlockNumber(receipt.blockNumber)}`
                : "—"}
            </DataRow>
            <DataRow label="From">
              <Link
                href={`/address/${tx.from}`}
                className="text-explorer-coral hover:underline"
              >
                {tx.from}
              </Link>
            </DataRow>
            <DataRow label="To">
              {tx.to ? (
                <Link
                  href={`/address/${tx.to}`}
                  className="text-explorer-coral hover:underline"
                >
                  {tx.to}
                </Link>
              ) : (
                "Contract Creation"
              )}
            </DataRow>
            <DataRow label="Value">
              {formatDecimal(Number(formatEther(tx.value)), {
                maximumFractionDigits: 8,
              })}{" "}
              ETH
            </DataRow>
            <DataRow label="Transaction Fee">
              {fee != null
                ? `${formatDecimal(Number(formatEther(fee)), {
                    maximumFractionDigits: 8,
                  })} ETH`
                : "—"}
            </DataRow>
            <DataRow label="Gas Price">
              {tx.gasPrice != null ? `${formatGwei(tx.gasPrice)} Gwei` : "—"}
            </DataRow>
            <DataRow label="Gas Limit">{formatInteger(tx.gas)}</DataRow>
            {receipt && (
              <DataRow label="Gas Used">
                {formatInteger(receipt.gasUsed)} (
                {((Number(receipt.gasUsed) / Number(tx.gas)) * 100).toFixed(1)}
                %)
              </DataRow>
            )}
            <DataRow label="Nonce">{tx.nonce}</DataRow>
          </dl>
        </div>
      </main>
    </div>
  );
}

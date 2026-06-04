import Link from "next/link";
import { formatEther } from "viem";
import { RelativeTime } from "@/components/shared/ui/RelativeTime";
import {
  formatBlockNumber,
  formatDecimal,
  truncateHash,
} from "@/lib/shared/format";
import type { TransactionSummary } from "@/lib/shared/types";

type TransactionTableProps = {
  transactions: TransactionSummary[];
};

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-explorer-slate">
          Latest Transactions
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-medium">Tx Hash</th>
              <th className="px-4 py-3 font-medium">Block</th>
              <th className="px-4 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">To</th>
              <th className="px-4 py-3 font-medium text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
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
                      href={`/block/${tx.blockNumber}`}
                      className="font-mono text-explorer-coral hover:underline"
                    >
                      {formatBlockNumber(tx.blockNumber)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <RelativeTime unixSeconds={BigInt(tx.timestamp)} />
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
                      <span className="text-gray-400">Contract Creation</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {formatDecimal(Number(formatEther(BigInt(tx.value))), {
                      maximumFractionDigits: 6,
                    })}{" "}
                    ETH
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

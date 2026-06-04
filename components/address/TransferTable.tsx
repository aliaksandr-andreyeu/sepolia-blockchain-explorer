import Link from "next/link";
import { RelativeTime } from "@/components/shared/ui/RelativeTime";
import { formatBlockNumber, truncateHash } from "@/lib/shared/format";
import type { TransferSummary } from "@/lib/shared/types";

type TransferTableProps = {
  transfers: TransferSummary[];
};

export function TransferTable({ transfers }: TransferTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-explorer-slate">
          Transactions
        </h2>
        <p className="mt-0.5 text-xs text-gray-500">
          ETH and token transfers via Alchemy Transfers API
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-medium">Tx Hash</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Block</th>
              <th className="px-4 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">To</th>
              <th className="px-4 py-3 font-medium text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transfers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No transfers found for this address
                </td>
              </tr>
            ) : (
              transfers.map((transfer) => (
                <tr
                  key={transfer.uniqueId}
                  className="hover:bg-explorer-peach/10"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/tx/${transfer.hash}`}
                      className="font-mono text-explorer-coral hover:underline"
                    >
                      {truncateHash(transfer.hash)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                        transfer.direction === "in"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-sky-50 text-sky-700"
                      }`}
                    >
                      {transfer.direction === "in" ? "IN" : "OUT"}
                    </span>
                    <span className="ml-2 text-xs uppercase text-gray-400">
                      {transfer.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/block/${transfer.blockNumber}`}
                      className="font-mono text-explorer-coral hover:underline"
                    >
                      {formatBlockNumber(transfer.blockNumber)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {transfer.timestamp ? (
                      <RelativeTime
                        unixSeconds={Math.floor(
                          new Date(transfer.timestamp).getTime() / 1000,
                        )}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/address/${transfer.from}`}
                      className="font-mono text-explorer-coral hover:underline"
                    >
                      {truncateHash(transfer.from)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {transfer.to ? (
                      <Link
                        href={`/address/${transfer.to}`}
                        className="font-mono text-explorer-coral hover:underline"
                      >
                        {truncateHash(transfer.to)}
                      </Link>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {transfer.value}
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

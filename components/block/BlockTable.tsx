import Link from "next/link";
import { RelativeTime } from "@/components/shared/ui/RelativeTime";
import { formatBlockNumber, formatGasUsedPercent } from "@/lib/shared/format";
import type { BlockSummary } from "@/lib/shared/types";

type BlockTableProps = {
  blocks: BlockSummary[];
  showLive?: boolean;
  isLive?: boolean;
};

export function BlockTable({
  blocks,
  showLive = false,
  isLive = false,
}: BlockTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-explorer-slate">
          Latest Blocks
        </h2>
        {showLive && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span
              className={`h-2 w-2 rounded-full ${isLive ? "animate-pulse bg-emerald-500" : "bg-gray-300"}`}
            />
            {isLive ? "Live" : "Polling"}
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-medium">Block</th>
              <th className="px-4 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium text-right">Txn</th>
              <th className="px-4 py-3 font-medium">Gas Used</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {blocks.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No blocks loaded
                </td>
              </tr>
            ) : (
              blocks.map((block) => {
                const gasUsed = BigInt(block.gasUsed);
                const gasLimit = BigInt(block.gasLimit);
                const pct = formatGasUsedPercent(gasUsed, gasLimit);

                return (
                  <tr key={block.hash} className="hover:bg-explorer-peach/10">
                    <td className="px-4 py-3">
                      <Link
                        href={`/block/${block.number}`}
                        className="font-mono font-medium text-explorer-coral hover:text-explorer-rose hover:underline"
                      >
                        {formatBlockNumber(block.number)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <RelativeTime unixSeconds={BigInt(block.timestamp)} />
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {block.transactionCount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-explorer-purple"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import type { NetworkStats } from "@/lib/shared/types";
import { formatBlockNumber } from "@/lib/shared/format";

type StatCardsProps = {
  stats: NetworkStats | null;
};

export function StatCards({ stats }: StatCardsProps) {
  const items = [
    {
      label: "Block Height",
      value: stats ? formatBlockNumber(stats.blockNumber) : "—",
    },
    {
      label: "Gas Price",
      value: stats?.gasPrice ?? "—",
    },
    {
      label: "Latest Block",
      value: stats?.latestBlockAge ?? "—",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {item.label}
          </p>
          <p className="mt-1 text-xl font-semibold text-explorer-slate">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

import { LiveBlocks } from "@/components/block/LiveBlocks";
import { Header } from "@/components/explorer/Header";
import { SetupNotice } from "@/components/explorer/SetupNotice";
import { StatCards } from "@/components/explorer/StatCards";
import { TransactionTable } from "@/components/tx/TransactionTable";
import { fetchLatestBlocks, fetchNetworkStats } from "@/lib/block/api";
import { getAlchemyWsUrl } from "@/lib/shared/chain";
import { getPublicClient } from "@/lib/shared/client";
import { fetchLatestTransactions } from "@/lib/tx/api";

export const revalidate = 12;

export default async function Home() {
  const hasClient = getPublicClient() != null;
  const [blocks, stats, transactions] = hasClient
    ? await Promise.all([
        fetchLatestBlocks(15),
        fetchNetworkStats(),
        fetchLatestTransactions(20),
      ])
    : [[], null, []];

  const wsUrl = getAlchemyWsUrl();

  return (
    <div className="min-h-full bg-explorer-bg">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {!hasClient && (
          <div className="mb-8">
            <SetupNotice />
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-explorer-slate">
            Sepolia Blockchain Explorer
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Search addresses, transactions, and blocks on Sepolia testnet.
          </p>
        </div>

        <div className="mb-8">
          <StatCards stats={stats} />
        </div>

        <div className="flex flex-col gap-8">
          {hasClient ? (
            <LiveBlocks initialBlocks={blocks} wsUrl={wsUrl} />
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 px-4 py-12 text-center text-gray-400">
              Connect Alchemy to load live blocks
            </div>
          )}

          {hasClient && <TransactionTable transactions={transactions} />}
        </div>
      </main>

      <footer className="mt-auto border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-400">
        Sepolia Testnet · Read-only explorer · Powered by Alchemy + viem
      </footer>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { formatEther, getAddress, isAddress } from "viem";
import { TransferTable } from "@/components/address/TransferTable";
import { DataRow } from "@/components/shared/ui/DataRow";
import { Header } from "@/components/explorer/Header";
import { SetupNotice } from "@/components/explorer/SetupNotice";
import { fetchAddressTransfers } from "@/lib/address/transfers";
import { getPublicClient } from "@/lib/shared/client";
import { formatDecimal, formatInteger } from "@/lib/shared/format";

type PageProps = {
  params: Promise<{ address: string }>;
};

export const revalidate = 12;

export default async function AddressPage({ params }: PageProps) {
  const { address: rawAddress } = await params;
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

  if (!isAddress(rawAddress)) notFound();

  const address = getAddress(rawAddress);

  const [balance, txCount, code, transfers] = await Promise.all([
    client.getBalance({ address }),
    client.getTransactionCount({ address }),
    client.getCode({ address }),
    fetchAddressTransfers(address, 25),
  ]);

  const isContract = code !== "0x" && code !== undefined;

  return (
    <div className="min-h-full bg-explorer-bg">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <nav className="mb-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-explorer-coral">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-explorer-slate">Address</span>
        </nav>

        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h1 className="break-all font-mono text-xl font-semibold text-explorer-slate">
            {address}
          </h1>
          <span className="rounded bg-explorer-peach/30 px-2.5 py-1 text-xs font-medium text-explorer-slate">
            {isContract ? "Contract" : "Address"}
          </span>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Balance
            </p>
            <p className="mt-1 text-2xl font-semibold text-explorer-slate">
              {formatDecimal(Number(formatEther(balance)), {
                maximumFractionDigits: 6,
              })}{" "}
              ETH
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Nonce
            </p>
            <p className="mt-1 text-2xl font-semibold text-explorer-slate">
              {formatInteger(txCount)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Transfers Found
            </p>
            <p className="mt-1 text-2xl font-semibold text-explorer-slate">
              {formatInteger(transfers.length)}
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <dl>
            <DataRow label="Address">{address}</DataRow>
            <DataRow label="Type">
              {isContract ? "Smart Contract" : "Externally Owned Account"}
            </DataRow>
            <DataRow label="Balance">{formatEther(balance)} ETH</DataRow>
          </dl>
        </div>

        <TransferTable transfers={transfers} />
      </main>
    </div>
  );
}

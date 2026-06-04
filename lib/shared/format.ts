import { formatGwei } from "viem";

/** Fixed locale so SSR and browser render identical number strings. */
export const EXPLORER_LOCALE = "en-US";

export function formatInteger(value: bigint | number | string): string {
  const str =
    typeof value === "bigint"
      ? value.toString()
      : typeof value === "string"
        ? value.replace(/\D/g, "") || "0"
        : Math.trunc(value).toString();

  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatDecimal(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return value.toLocaleString(EXPLORER_LOCALE, options);
}

export function truncateHash(value: string, start = 8, end = 6): string {
  if (value.length <= start + end + 3) return value;
  return `${value.slice(0, start + 2)}…${value.slice(-end)}`;
}

export function formatGweiPrice(wei: bigint): string {
  const gwei = formatGwei(wei);
  const num = Number(gwei);
  return `${formatDecimal(num, { maximumFractionDigits: 4 })} Gwei`;
}

export function formatGasUsedPercent(
  gasUsed: bigint,
  gasLimit: bigint,
): number {
  if (gasLimit === 0n) return 0;
  return Number((gasUsed * 10000n) / gasLimit) / 100;
}

export function timeAgo(unixSeconds: bigint | number): string {
  const ts =
    typeof unixSeconds === "bigint" ? Number(unixSeconds) : unixSeconds;
  const diff = Math.max(0, Math.floor(Date.now() / 1000) - ts);

  if (diff < 5) return "just now";
  if (diff < 60) return `${diff} secs ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export function formatTimestamp(unixSeconds: bigint | number): string {
  const ts =
    typeof unixSeconds === "bigint" ? Number(unixSeconds) : unixSeconds;
  return new Date(ts * 1000).toUTCString();
}

export function formatBlockNumber(value: bigint | number | string): string {
  return formatInteger(typeof value === "bigint" ? value : BigInt(value));
}

import { sepolia } from "viem/chains";

export const chain = sepolia;

export const chainLabel = "Sepolia Testnet";

function getAlchemyApiKey(): string | undefined {
  return process.env.ALCHEMY_API_KEY;
}

export function getAlchemyHttpUrl(): string | null {
  const key = getAlchemyApiKey();
  if (!key) return null;
  return `https://eth-sepolia.g.alchemy.com/v2/${key}`;
}

/** Used by client-side WebSocket (browser cannot read server-only env). */
export function getAlchemyWsUrl(): string | null {
  const key =
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? process.env.ALCHEMY_API_KEY;
  if (!key) return null;
  return `wss://eth-sepolia.g.alchemy.com/v2/${key}`;
}

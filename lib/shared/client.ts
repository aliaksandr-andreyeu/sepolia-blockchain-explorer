import { createPublicClient, http, type PublicClient } from "viem";
import { chain, getAlchemyHttpUrl } from "@/lib/shared/chain";

let cachedClient: PublicClient | null | undefined;

export function getPublicClient(): PublicClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = getAlchemyHttpUrl();
  if (!url) {
    cachedClient = null;
    return null;
  }

  cachedClient = createPublicClient({
    chain,
    transport: http(url),
  });

  return cachedClient;
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPublicClient, webSocket } from "viem";
import { BlockTable } from "@/components/block/BlockTable";
import { blockToSummary } from "@/lib/block/summary";
import { chain } from "@/lib/shared/chain";
import type { BlockSummary } from "@/lib/shared/types";

const MAX_BLOCKS = 15;

type LiveBlocksProps = {
  initialBlocks: BlockSummary[];
  wsUrl: string | null;
};

export function LiveBlocks({ initialBlocks, wsUrl }: LiveBlocksProps) {
  const [blocks, setBlocks] = useState<BlockSummary[]>(initialBlocks);
  const [isLive, setIsLive] = useState(false);
  const unwatchRef = useRef<(() => void) | null>(null);

  const prependBlock = useCallback((block: BlockSummary) => {
    setBlocks((prev) => {
      const filtered = prev.filter((b) => b.hash !== block.hash);
      return [block, ...filtered].slice(0, MAX_BLOCKS);
    });
  }, []);

  useEffect(() => {
    setBlocks(initialBlocks);
  }, [initialBlocks]);

  useEffect(() => {
    if (!wsUrl) return;

    const wsClient = createPublicClient({
      chain,
      transport: webSocket(wsUrl),
    });

    function startWatch() {
      unwatchRef.current?.();
      unwatchRef.current = wsClient.watchBlocks({
        includeTransactions: false,
        onBlock: (block) => {
          if (block.number == null || block.hash == null) return;
          prependBlock(blockToSummary(block));
        },
        onError: () => setIsLive(false),
      });
      setIsLive(true);
    }

    function stopWatch() {
      unwatchRef.current?.();
      unwatchRef.current = null;
      setIsLive(false);
    }

    function handleVisibility() {
      if (document.hidden) {
        stopWatch();
      } else {
        startWatch();
      }
    }

    if (!document.hidden) startWatch();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      stopWatch();
    };
  }, [wsUrl, prependBlock]);

  return <BlockTable blocks={blocks} showLive={!!wsUrl} isLive={isLive} />;
}

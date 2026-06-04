"use client";

import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/shared/format";

type RelativeTimeProps = {
  unixSeconds: bigint | number;
};

export function RelativeTime({ unixSeconds }: RelativeTimeProps) {
  const ts =
    typeof unixSeconds === "bigint" ? Number(unixSeconds) : unixSeconds;
  const [label, setLabel] = useState("…");

  useEffect(() => {
    const update = () => setLabel(timeAgo(ts));
    queueMicrotask(update);
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, [ts]);

  return <span suppressHydrationWarning>{label}</span>;
}

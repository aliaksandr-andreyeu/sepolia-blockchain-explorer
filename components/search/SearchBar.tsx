"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { parseSearchQuery, searchResultPath } from "@/lib/search/parse";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = parseSearchQuery(query);

    if (result.type === "invalid") {
      setError(result.reason);
      return;
    }

    setError(null);
    router.push(searchResultPath(result));
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex overflow-hidden rounded-lg border border-white/20 bg-white shadow-sm">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Search by Address / Tx Hash / Block Number"
          className="min-w-0 flex-1 px-4 py-2.5 text-sm text-explorer-slate placeholder:text-gray-400 focus:outline-none"
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-explorer-coral px-5 text-sm font-medium text-white transition-colors hover:bg-explorer-rose"
        >
          Search
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-explorer-peach">{error}</p>}
    </form>
  );
}

import Link from "next/link";
import { SearchBar } from "@/components/search/SearchBar";
import { chainLabel } from "@/lib/shared/chain";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-explorer-purple">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-explorer-coral text-sm font-bold text-white">
              S
            </span>
            <div>
              <p className="text-lg font-semibold leading-tight text-white">
                SepoliaScan
              </p>
              <p className="text-xs text-explorer-peach/80">{chainLabel}</p>
            </div>
          </Link>
        </div>
        <div className="w-full sm:max-w-xl">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

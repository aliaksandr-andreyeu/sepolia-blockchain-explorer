export function SetupNotice() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
      <p className="font-semibold">Alchemy API key required</p>
      <p className="mt-1 text-amber-800">
        Create{" "}
        <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">
          .env.local
        </code>{" "}
        with your key:
      </p>
      <pre className="mt-2 overflow-x-auto rounded-lg bg-amber-100/60 p-3 text-xs">
        {`ALCHEMY_API_KEY=your_key_here
NEXT_PUBLIC_ALCHEMY_API_KEY=your_key_here`}
      </pre>
      <p className="mt-2 text-xs text-amber-700">
        Get a free key at{" "}
        <a
          href="https://dashboard.alchemy.com/"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          dashboard.alchemy.com
        </a>
        . Restart <code className="text-xs">npm run dev</code> after adding it.
      </p>
    </div>
  );
}

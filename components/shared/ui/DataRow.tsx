type DataRowProps = {
  label: string;
  children: React.ReactNode;
};

export function DataRow({ label, children }: DataRowProps) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-gray-100 py-3 sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="break-all font-mono text-sm text-explorer-slate sm:col-span-2">
        {children}
      </dd>
    </div>
  );
}

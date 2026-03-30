import type { ReactNode } from "react";

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
};

export default function DataTable<T>({
  columns,
  data,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="glass-surface overflow-x-auto rounded-2xl border border-white/20">
      <table className="min-w-full text-sm text-slate-100">
        <thead className="bg-white/10 text-slate-100/90">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 text-start font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className={`cursor-pointer transition ${
                idx % 2 === 0 ? "bg-white/[0.03]" : "bg-transparent"
              }`}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="border-t border-white/10 px-4 py-2.5">
                  {col.render
                    ? col.render(row[col.key] as T[keyof T], row)
                    : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import type { ReactNode } from 'react'

export type ColumnDef<T> = {
  id: string
  header: string
  cell: (row: T, rowIndex: number) => ReactNode
}

type DataTableProps<T> = {
  columns: ColumnDef<T>[]
  data: T[]
  getRowKey: (row: T, rowIndex: number) => string
  emptyMessage?: string
}

export const DataTable = <T,>({
  columns,
  data,
  getRowKey,
  emptyMessage = 'No rows to display',
}: DataTableProps<T>) => {
  if (data.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-white/60 px-4 py-8 text-center text-slate-500">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200/80 bg-white/90 shadow-inner">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-100/90">
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                scope="col"
                className="whitespace-nowrap px-3 py-3 font-semibold text-slate-700 md:px-4"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white/95">
          {data.map((row, rowIndex) => (
            <tr key={getRowKey(row, rowIndex)} className="hover:bg-sky-50/60">
              {columns.map((col) => (
                <td key={col.id} className="whitespace-nowrap px-3 py-2.5 text-slate-800 md:px-4">
                  {col.cell(row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

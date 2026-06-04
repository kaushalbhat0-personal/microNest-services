import clsx from 'clsx'

export type Column<T> = {
  header: string
  accessor: (item: T) => React.ReactNode
  className?: string
}

type TableProps<T> = {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
}: TableProps<T>) {
  if (data.length === 0) return null

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={clsx(
                  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="hover:bg-gray-50">
              {columns.map((col, i) => (
                <td
                  key={i}
                  className={clsx(
                    'whitespace-nowrap px-4 py-3 text-sm text-gray-700',
                    col.className
                  )}
                >
                  {col.accessor(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

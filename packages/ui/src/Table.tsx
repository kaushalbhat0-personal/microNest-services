import clsx from 'clsx'

export type Column<T> = {
  header: string
  accessor: (item: T) => React.ReactNode
  className?: string
  hideOnMobile?: boolean
}

type TableProps<T> = {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  renderCard?: (item: T) => React.ReactNode
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  renderCard,
}: TableProps<T>) {
  if (data.length === 0) return null

  const table = (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={clsx(
                  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500',
                  col.className,
                  col.hideOnMobile && 'hidden md:table-cell'
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
                    'px-4 py-3 text-sm text-gray-700',
                    col.hideOnMobile && 'hidden md:table-cell'
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

  if (!renderCard) return table

  return (
    <>
      <div className="hidden md:block">{table}</div>
      <div className="block space-y-3 md:hidden">
        {data.map((item) => (
          <div
            key={keyExtractor(item)}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            {renderCard(item)}
          </div>
        ))}
      </div>
    </>
  )
}

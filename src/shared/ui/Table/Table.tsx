import { type ReactNode } from 'react'
import { cn } from '@core/utils/cn'
import { Loader } from '../Loader'
import { EmptyState } from '../EmptyState'

export interface TableColumn<T> {
  key: string
  header: ReactNode
  /** Cell renderer. If omitted, renders `row[key]` when key is a property of T. */
  cell?: (row: T, index: number) => ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string | number
  className?: string
  headerClassName?: string
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  rowKey: (row: T, index: number) => string | number
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  onRowClick?: (row: T) => void
  className?: string
  /** Sticky header inside scroll container. */
  stickyHeader?: boolean
}

const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' } as const

export function Table<T>({
  data,
  columns,
  rowKey,
  loading,
  emptyTitle = 'No data',
  emptyDescription,
  emptyAction,
  onRowClick,
  className,
  stickyHeader,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader />
      </div>
    )
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
  }

  return (
    <div className={cn('w-full overflow-auto rounded-md border border-border', className)}>
      <table className="w-full caption-bottom text-sm">
        <thead
          className={cn(
            'bg-muted/50 text-muted-foreground',
            stickyHeader && 'sticky top-0 z-10',
          )}
        >
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  'h-10 px-3 font-medium',
                  alignClass[col.align ?? 'left'],
                  col.headerClassName,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={rowKey(row, index)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'border-t border-border transition-colors',
                onRowClick && 'cursor-pointer hover:bg-muted/50',
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn('px-3 py-2.5 align-middle', alignClass[col.align ?? 'left'], col.className)}
                >
                  {col.cell
                    ? col.cell(row, index)
                    : ((row as Record<string, unknown>)[col.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

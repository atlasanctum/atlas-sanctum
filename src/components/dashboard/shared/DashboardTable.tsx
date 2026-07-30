import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DashboardTableProps<T> {
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
}

export function DashboardTable<T extends object>({
  title,
  icon: Icon,
  iconColor = 'text-emerald-500',
  columns,
  data,
  onRowClick,
  className,
  emptyMessage = 'No data available',
  loading = false,
}: DashboardTableProps<T>) {
  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={cn('h-5 w-5', iconColor)} aria-hidden="true" />}
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
            <span className="ml-3 text-muted-foreground">Loading...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center" role="status">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label={title}>
              <thead>
                <tr className="border-b">
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      scope="col"
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={index}
                    className={cn(
                      'border-b hover:bg-muted/50 transition-colors',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row)}
                    role="row"
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onRowClick?.(row);
                      }
                    }}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className="px-4 py-3 text-sm"
                        role="cell"
                      >
                        {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardTable;

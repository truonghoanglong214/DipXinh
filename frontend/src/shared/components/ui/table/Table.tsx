import React from 'react';
import { cn } from '../core/cn';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'w-full overflow-x-auto rounded-xl border border-border-default bg-surface shadow-2xs',
          containerClassName
        )}
      >
        <table
          ref={ref}
          className={cn('w-full text-left text-sm text-ink tabular-nums border-collapse', className)}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('bg-surface-subtle border-b border-border-default', className)}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('divide-y divide-border-default', className)} {...props} />
));
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'transition-colors duration-150 hover:bg-[#FAF6F1] group',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted bg-[#F9F6F2] select-none whitespace-nowrap',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('px-4 py-3.5 align-middle text-xs text-ink', className)} {...props} />
));
TableCell.displayName = 'TableCell';

export const TableEmpty: React.FC<{ colSpan: number; message?: string }> = ({
  colSpan,
  message = 'Không có dữ liệu hiển thị.',
}) => (
  <tr>
    <td colSpan={colSpan} className="text-center py-12 text-ink-muted text-sm italic">
      {message}
    </td>
  </tr>
);

import React from 'react';
import { cn } from '../core/cn';
import { Button } from '../buttons/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1 && !totalItems) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : currentPage * pageSize;

  // Generate page numbers
  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 border-t border-border-default text-xs text-ink-muted',
        className
      )}
      aria-label="Phân trang"
    >
      {totalItems !== undefined ? (
        <div>
          Hiển thị <span className="font-semibold text-ink">{startItem}</span> -{' '}
          <span className="font-semibold text-ink">{endItem}</span> trên{' '}
          <span className="font-semibold text-ink">{totalItems}</span> kết quả
        </div>
      ) : (
        <div>
          Trang <span className="font-semibold text-ink">{currentPage}</span> / {totalPages}
        </div>
      )}

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Trang trước"
          leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
        >
          Trước
        </Button>

        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="px-2 py-1 text-ink-muted">
                  ...
                </span>
              );
            }
            const isCurrent = p === currentPage;
            return (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => onPageChange(p as number)}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'h-8 min-w-[2rem] px-2 rounded-md font-medium text-xs transition-colors',
                  isCurrent
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-ink hover:bg-surface-subtle border border-transparent'
                )}
              >
                {p}
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Trang sau"
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          Sau
        </Button>
      </div>
    </div>
  );
};

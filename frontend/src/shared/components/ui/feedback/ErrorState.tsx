import React from 'react';
import { cn } from '../core/cn';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '../buttons/Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Đã xảy ra lỗi tải dữ liệu',
  message,
  onRetry,
  className,
  compact = false,
}) => {
  if (compact) {
    return (
      <div
        role="alert"
        className={cn(
          'flex items-center justify-between gap-3 p-3 rounded-lg border border-red-200 bg-red-50/70 text-xs text-red-900',
          className
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="truncate">{message}</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="font-medium text-red-700 hover:text-red-900 underline shrink-0 cursor-pointer"
          >
            Thử lại
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 md:p-10',
        'rounded-xl border border-red-200 bg-red-50/40',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-red-100/80 flex items-center justify-center text-red-700 mb-3.5">
        <AlertCircle className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h4 className="font-display text-base font-semibold text-red-950 leading-tight">{title}</h4>
      <p className="text-xs text-red-800/80 max-w-md mt-1.5 leading-relaxed">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Thử tải lại
          </Button>
        </div>
      )}
    </div>
  );
};

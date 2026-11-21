import React from 'react';
import { cn } from '../core/cn';

export interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Đang tải dữ liệu atelier...',
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2.5',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center p-8 text-center', className)}
    >
      <div
        className={cn(
          'rounded-full animate-spin border-primary/20 border-t-primary',
          sizeClasses[size]
        )}
      />
      {message && <p className="text-xs text-ink-muted mt-3 font-medium">{message}</p>}
    </div>
  );
};

import React from 'react';
import { cn } from '../core/cn';
import { PackageOpen } from 'lucide-react';
import { Button } from '../buttons/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 md:p-12',
        'rounded-xl border border-dashed border-border-default bg-surface/50',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-surface-subtle border border-border-default flex items-center justify-center text-ink-muted mb-4">
        {icon || <PackageOpen className="w-6 h-6 stroke-[1.25]" />}
      </div>
      <h4 className="font-display text-lg font-semibold text-ink leading-tight">{title}</h4>
      <p className="text-xs text-ink-muted max-w-sm mt-1.5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { cn } from '../core/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, isError = false, disabled, rows = 3, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        aria-invalid={isError ? 'true' : undefined}
        className={cn(
          'w-full bg-surface text-ink border transition-colors duration-150 p-3 text-sm rounded-lg resize-y',
          'placeholder:text-ink-subtle',
          'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary',
          isError
            ? 'border-red-500 focus-visible:ring-red-500'
            : 'border-border-default hover:border-ink-muted focus-visible:border-primary',
          disabled && 'bg-surface-subtle text-ink-muted cursor-not-allowed opacity-60',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

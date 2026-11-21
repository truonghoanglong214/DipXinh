import React from 'react';
import { cn } from '../core/cn';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  sizeVariant?: 'sm' | 'md' | 'lg';
  isError?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      sizeVariant = 'md',
      isError = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-8 px-2.5 text-xs rounded-md',
      md: 'h-10 px-3.5 text-sm rounded-lg',
      lg: 'h-11 px-4 text-base rounded-lg',
    };

    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-ink-muted">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          aria-invalid={isError ? 'true' : undefined}
          className={cn(
            'w-full bg-surface text-ink border transition-colors duration-150',
            'placeholder:text-ink-subtle',
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary',
            isError
              ? 'border-red-500 focus-visible:ring-red-500'
              : 'border-border-default hover:border-ink-muted focus-visible:border-primary',
            disabled ? 'bg-surface-subtle text-ink-muted cursor-not-allowed opacity-60' : undefined,
            sizeClasses[sizeVariant],
            leftIcon ? 'pl-9' : undefined,
            rightIcon ? 'pr-9' : undefined,
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 flex items-center pointer-events-none text-ink-muted">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

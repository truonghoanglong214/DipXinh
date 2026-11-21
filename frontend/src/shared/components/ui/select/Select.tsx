import React from 'react';
import { cn } from '../core/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options?: SelectOption[];
  sizeVariant?: 'sm' | 'md' | 'lg';
  isError?: boolean;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options,
      sizeVariant = 'md',
      isError = false,
      placeholder,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-8 pl-2.5 pr-8 text-xs rounded-md',
      md: 'h-10 pl-3.5 pr-9 text-sm rounded-lg',
      lg: 'h-11 pl-4 pr-10 text-base rounded-lg',
    };

    return (
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          disabled={disabled}
          aria-invalid={isError ? 'true' : undefined}
          className={cn(
            'w-full bg-surface text-ink border appearance-none transition-colors duration-150 cursor-pointer',
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary',
            isError
              ? 'border-red-500 focus-visible:ring-red-500'
              : 'border-border-default hover:border-ink-muted focus-visible:border-primary',
            disabled && 'bg-surface-subtle text-ink-muted cursor-not-allowed opacity-60',
            sizeClasses[sizeVariant],
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="absolute right-3 flex items-center pointer-events-none text-ink-muted">
          <ChevronDown className="w-4 h-4 opacity-70" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

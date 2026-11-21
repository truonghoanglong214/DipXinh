import React from 'react';
import { cn } from '../core/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'iconSm';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer ' +
      'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ' +
      'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.99] shadow-xs border border-transparent',
      secondary:
        'bg-surface-subtle text-ink hover:bg-[#EFE7DE] border border-border-default active:scale-[0.99]',
      outline:
        'bg-transparent text-ink border border-border-default hover:bg-surface-subtle hover:border-ink-muted active:scale-[0.99]',
      ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-surface-subtle',
      destructive:
        'bg-[#8B2E2E] text-white hover:bg-[#732424] active:scale-[0.99] shadow-xs border border-transparent',
      link: 'text-primary underline-offset-4 hover:underline p-0 h-auto font-normal',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
      md: 'h-10 px-4 text-sm rounded-lg gap-2',
      lg: 'h-11 px-5 text-sm md:text-base rounded-lg gap-2.5',
      icon: 'h-10 w-10 p-0 rounded-lg justify-center',
      iconSm: 'h-8 w-8 p-0 rounded-md justify-center',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Đang tải...</span>
          </span>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

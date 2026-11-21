import React from 'react';
import { cn } from '../core/cn';

export type BadgeTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type BadgeStyle = 'soft' | 'solid' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  styleVariant?: BadgeStyle;
  size?: BadgeSize;
  withDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  tone = 'neutral',
  styleVariant = 'soft',
  size = 'md',
  withDot = false,
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  const toneClasses: Record<BadgeTone, Record<BadgeStyle, { root: string; dot: string }>> = {
    primary: {
      soft: {
        root: 'bg-primary-soft text-primary border border-primary/20',
        dot: 'bg-primary',
      },
      solid: {
        root: 'bg-primary text-primary-foreground border-transparent',
        dot: 'bg-white',
      },
      outline: {
        root: 'border border-primary text-primary bg-transparent',
        dot: 'bg-primary',
      },
    },
    success: {
      soft: {
        root: 'bg-[#EAF5F0] text-[#1E5844] border border-[#BFE3D4]',
        dot: 'bg-[#2E7D5F]',
      },
      solid: {
        root: 'bg-[#2E7D5F] text-white border-transparent',
        dot: 'bg-white',
      },
      outline: {
        root: 'border border-[#2E7D5F] text-[#2E7D5F] bg-transparent',
        dot: 'bg-[#2E7D5F]',
      },
    },
    warning: {
      soft: {
        root: 'bg-[#FDF6EC] text-[#7C4E10] border border-[#F2D7B2]',
        dot: 'bg-[#C2781E]',
      },
      solid: {
        root: 'bg-[#C2781E] text-white border-transparent',
        dot: 'bg-white',
      },
      outline: {
        root: 'border border-[#C2781E] text-[#C2781E] bg-transparent',
        dot: 'bg-[#C2781E]',
      },
    },
    danger: {
      soft: {
        root: 'bg-[#FCEFEF] text-[#8B2E2E] border border-[#F5C9C9]',
        dot: 'bg-[#B93838]',
      },
      solid: {
        root: 'bg-[#B93838] text-white border-transparent',
        dot: 'bg-white',
      },
      outline: {
        root: 'border border-[#B93838] text-[#B93838] bg-transparent',
        dot: 'bg-[#B93838]',
      },
    },
    info: {
      soft: {
        root: 'bg-[#EBF3F8] text-[#29546B] border border-[#BFD9E8]',
        dot: 'bg-[#3A7799]',
      },
      solid: {
        root: 'bg-[#3A7799] text-white border-transparent',
        dot: 'bg-white',
      },
      outline: {
        root: 'border border-[#3A7799] text-[#3A7799] bg-transparent',
        dot: 'bg-[#3A7799]',
      },
    },
    neutral: {
      soft: {
        root: 'bg-[#F2EDE8] text-[#554C47] border border-[#DDD5CD]',
        dot: 'bg-[#70645D]',
      },
      solid: {
        root: 'bg-[#70645D] text-white border-transparent',
        dot: 'bg-white',
      },
      outline: {
        root: 'border border-[#DDD5CD] text-[#554C47] bg-transparent',
        dot: 'bg-[#70645D]',
      },
    },
  };

  const selectedTone = toneClasses[tone][styleVariant];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full tracking-wide select-none',
        sizeClasses[size],
        selectedTone.root,
        className
      )}
      {...props}
    >
      {withDot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', selectedTone.dot)}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};

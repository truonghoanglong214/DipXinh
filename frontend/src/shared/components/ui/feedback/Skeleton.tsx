import React from 'react';
import { cn } from '../core/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'rounded' | 'circular';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rounded',
  ...props
}) => {
  const variantClasses = {
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
    circular: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-[#EFE7DE] relative overflow-hidden',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};

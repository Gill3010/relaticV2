import React from 'react';
import { cn } from '../../lib/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
}

export function Skeleton({
  className,
  variant = 'rounded',
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-slate-800/60',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

// Responsive Container Component for Consistent Layout

import { ReactNode } from 'react';
import { cn } from '@/app/lib/utils';

interface ResponsiveContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveContainer({
  children,
  size = 'xl',
  padding = 'md',
  className,
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
  };

  return (
    <div className={cn('mx-auto w-full', sizeClasses[size], paddingClasses[padding], className)}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { xs: 1, sm: 2, lg: 3 },
  gap = 'md',
  className,
}: ResponsiveGridProps) {
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
    xl: 'gap-8 sm:gap-12',
  };

  const colClasses = [
    cols.xs && `grid-cols-${cols.xs}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={cn('grid', colClasses, gapClasses[gap], className)}>{children}</div>;
}

interface ResponsiveStackProps {
  children: ReactNode;
  direction?: 'vertical' | 'horizontal' | 'responsive';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  className?: string;
}

export function ResponsiveStack({
  children,
  direction = 'vertical',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  className,
}: ResponsiveStackProps) {
  const directionClasses = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
    responsive: 'flex-col sm:flex-row',
  };

  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
    xl: 'gap-8 sm:gap-12',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
}

interface ResponsiveCardProps {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
}

export function ResponsiveCard({
  children,
  padding = 'md',
  hover = false,
  className,
}: ResponsiveCardProps) {
  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        paddingClasses[padding],
        hover && 'transition-shadow hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
}

interface MobileOnlyProps {
  children: ReactNode;
  className?: string;
}

export function MobileOnly({ children, className }: MobileOnlyProps) {
  return <div className={cn('block lg:hidden', className)}>{children}</div>;
}

interface DesktopOnlyProps {
  children: ReactNode;
  className?: string;
}

export function DesktopOnly({ children, className }: DesktopOnlyProps) {
  return <div className={cn('hidden lg:block', className)}>{children}</div>;
}

interface TabletAndUpProps {
  children: ReactNode;
  className?: string;
}

export function TabletAndUp({ children, className }: TabletAndUpProps) {
  return <div className={cn('hidden md:block', className)}>{children}</div>;
}

interface ResponsiveSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveSection({
  children,
  title,
  description,
  action,
  spacing = 'md',
  className,
}: ResponsiveSectionProps) {
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
  };

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {(title || description || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            {title && (
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
            )}
            {description && (
              <p className="text-sm sm:text-base text-gray-600 mt-1">{description}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

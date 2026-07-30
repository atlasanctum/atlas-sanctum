// Responsive Design Utilities for Production

/**
 * Tailwind Breakpoints (reference)
 * sm: 640px
 * md: 768px
 * lg: 1024px
 * xl: 1280px
 * 2xl: 1536px
 */

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Hook to detect current breakpoint
 */
export function useBreakpoint() {
  if (typeof window === 'undefined') {
    return 'lg'; // Default for SSR
  }

  const width = window.innerWidth;

  if (width < breakpoints.sm) return 'xs';
  if (width < breakpoints.md) return 'sm';
  if (width < breakpoints.lg) return 'md';
  if (width < breakpoints.xl) return 'lg';
  if (width < breakpoints['2xl']) return 'xl';
  return '2xl';
}

/**
 * Check if mobile device
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.md;
}

/**
 * Check if tablet device
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg;
}

/**
 * Check if desktop device
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.lg;
}

/**
 * Responsive padding utilities
 */
export const responsivePadding = {
  page: 'px-4 sm:px-6 lg:px-8',
  section: 'px-4 sm:px-6',
  container: 'px-3 sm:px-4 lg:px-6',
  card: 'p-4 sm:p-6',
  tight: 'px-2 sm:px-3',
} as const;

/**
 * Responsive gap utilities
 */
export const responsiveGap = {
  xs: 'gap-2 sm:gap-3',
  sm: 'gap-3 sm:gap-4',
  md: 'gap-4 sm:gap-6',
  lg: 'gap-6 sm:gap-8',
  xl: 'gap-8 sm:gap-12',
} as const;

/**
 * Responsive grid utilities
 */
export const responsiveGrid = {
  '1-2': 'grid-cols-1 md:grid-cols-2',
  '1-2-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '1-2-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  '1-3': 'grid-cols-1 lg:grid-cols-3',
  '2-4': 'grid-cols-2 lg:grid-cols-4',
  auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
} as const;

/**
 * Responsive text sizes
 */
export const responsiveText = {
  xs: 'text-xs sm:text-sm',
  sm: 'text-sm sm:text-base',
  base: 'text-base sm:text-lg',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
  '2xl': 'text-2xl sm:text-3xl',
  '3xl': 'text-3xl sm:text-4xl',
} as const;

/**
 * Mobile navigation helper
 */
export const mobileNav = {
  container: 'fixed inset-x-0 top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800',
  menu: 'lg:hidden',
  desktop: 'hidden lg:flex',
  backdrop: 'fixed inset-0 z-40 bg-black/50 lg:hidden',
} as const;

/**
 * Responsive visibility utilities
 */
export const visibility = {
  mobileOnly: 'block lg:hidden',
  tabletOnly: 'hidden md:block lg:hidden',
  desktopOnly: 'hidden lg:block',
  mobileAndTablet: 'block lg:hidden',
  tabletAndDesktop: 'hidden md:block',
} as const;

/**
 * Get columns based on screen size
 */
export function getResponsiveColumns(size: 'sm' | 'md' | 'lg'): number {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  
  if (size === 'sm') {
    if (width < breakpoints.md) return 1;
    if (width < breakpoints.lg) return 2;
    return 3;
  }
  
  if (size === 'md') {
    if (width < breakpoints.sm) return 1;
    if (width < breakpoints.lg) return 2;
    if (width < breakpoints.xl) return 3;
    return 4;
  }
  
  // size === 'lg'
  if (width < breakpoints.sm) return 1;
  if (width < breakpoints.md) return 2;
  if (width < breakpoints.lg) return 3;
  if (width < breakpoints.xl) return 4;
  return 5;
}

/**
 * Touch-friendly sizes for mobile
 */
export const touchTarget = {
  min: 'min-h-[44px] min-w-[44px]', // iOS minimum touch target
  button: 'h-10 sm:h-9 px-4 sm:px-3', // Larger on mobile
  icon: 'h-10 w-10 sm:h-9 sm:w-9',
  tab: 'h-12 sm:h-10',
} as const;

/**
 * Responsive modal/dialog sizes
 */
export const modalSizes = {
  sm: 'max-w-sm mx-4',
  md: 'max-w-md mx-4',
  lg: 'max-w-lg mx-4',
  xl: 'max-w-xl mx-4',
  '2xl': 'max-w-2xl mx-4',
  full: 'max-w-full mx-4 sm:mx-6 lg:mx-8',
  screen: 'w-full h-full',
} as const;

/**
 * Responsive container widths
 */
export const containerSizes = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
} as const;

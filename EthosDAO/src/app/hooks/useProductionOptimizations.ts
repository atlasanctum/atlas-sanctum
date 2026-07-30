import { useEffect, useCallback, useRef, useMemo } from 'react';
import { logger } from '@/app/services/logger.service';

/**
 * Custom hooks for production optimizations
 */

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRan = useRef(Date.now());

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastRan.current >= delay) {
      callback(...args);
      lastRan.current = now;
    }
  }, [callback, delay]) as T;
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const mountTime = useRef(performance.now());
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current++;
  });

  useEffect(() => {
    const loadTime = performance.now() - mountTime.current;
    logger.info(`Component ${componentName} mounted in ${loadTime.toFixed(2)}ms`, 'Performance');

    return () => {
      const lifeTime = performance.now() - mountTime.current;
      logger.info(
        `Component ${componentName} unmounted after ${lifeTime.toFixed(2)}ms with ${renderCount.current} renders`,
        'Performance'
      );
    };
  }, [componentName]);
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

// Local storage hook with error handling
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.error('Error reading from localStorage', 'useLocalStorage', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      logger.error('Error writing to localStorage', 'useLocalStorage', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

// Online/Offline detection
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = React.useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      logger.info('Connection restored', 'Network');
    };

    const handleOffline = () => {
      setIsOnline(false);
      logger.warn('Connection lost', 'Network');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Idle detection hook
export function useIdleDetection(timeout: number = 300000) { // 5 minutes default
  const [isIdle, setIsIdle] = React.useState(false);
  const timeoutId = useRef<NodeJS.Timeout>();

  const resetTimer = useCallback(() => {
    setIsIdle(false);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      setIsIdle(true);
      logger.info('User idle detected', 'UserActivity');
    }, timeout);
  }, [timeout]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [resetTimer]);

  return isIdle;
}

// Media query hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// Previous value hook
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Async state management with error handling
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [state, setState] = React.useState<{
    loading: boolean;
    data: T | null;
    error: Error | null;
  }>({
    loading: true,
    data: null,
    error: null
  });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, data: null, error: null });

    asyncFunction()
      .then(data => {
        if (!cancelled) {
          setState({ loading: false, data, error: null });
        }
      })
      .catch(error => {
        if (!cancelled) {
          setState({ loading: false, data: null, error });
          logger.error('Async operation failed', 'useAsync', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return state;
}

// Optimized event handler
export function useEventCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef(fn);

  useEffect(() => {
    ref.current = fn;
  });

  return useCallback((...args: Parameters<T>) => {
    return ref.current(...args);
  }, []) as T;
}

// Memoized value with deep comparison
export function useDeepMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const ref = useRef<{ deps: React.DependencyList; value: T }>();

  if (!ref.current || !deepEqual(deps, ref.current.deps)) {
    ref.current = { deps, value: factory() };
  }

  return ref.current.value;
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

// Add React import at the top
import * as React from 'react';

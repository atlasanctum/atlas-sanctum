import { useEffect, useState, useCallback } from 'react';
import type { Metric } from 'web-vitals';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
import { trackPerformanceMetric } from '@/lib/analytics';

// Types for performance metrics
export interface PerformanceMetrics {
  cls: number | null;
  inp: number | null; // Interaction to Next Paint (replaces FID)
  fcp: number | null;
  lcp: number | null;
  ttfb: number | null;
  timestamp: number;
}

// Throttling configuration
const THROTTLE_MS = 1000; // 1 second throttle
let lastReportTime = 0;

// Error handling wrapper
const safeReport = (callback: () => void) => {
  try {
    const now = Date.now();
    if (now - lastReportTime > THROTTLE_MS) {
      callback();
      lastReportTime = now;
    }
  } catch (error) {
    console.error('Performance monitoring error:', error);
  }
};

// Google Analytics reporting function
const reportToGA = (metric: Metric) => {
  trackPerformanceMetric(metric.name, metric.value, metric.rating);
};

// Console logging for development
const logMetric = (metric: Metric) => {
  if (import.meta.env.DEV) {
    console.log(`[Performance] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
  }
};

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cls: null,
    inp: null,
    fcp: null,
    lcp: null,
    ttfb: null,
    timestamp: Date.now(),
  });

  const updateMetric = useCallback((name: keyof PerformanceMetrics, value: number) => {
    setMetrics(prev => ({
      ...prev,
      [name]: value,
      timestamp: Date.now(),
    }));
  }, []);

  useEffect(() => {
    // CLS - Cumulative Layout Shift
    onCLS((metric) => {
      safeReport(() => {
        logMetric(metric);
        reportToGA(metric);
        updateMetric('cls', metric.value);
      });
    });

    // INP - Interaction to Next Paint (replaces FID)
    onINP((metric) => {
      safeReport(() => {
        logMetric(metric);
        reportToGA(metric);
        updateMetric('inp', metric.value);
      });
    });

    // FCP - First Contentful Paint
    onFCP((metric) => {
      safeReport(() => {
        logMetric(metric);
        reportToGA(metric);
        updateMetric('fcp', metric.value);
      });
    });

    // LCP - Largest Contentful Paint
    onLCP((metric) => {
      safeReport(() => {
        logMetric(metric);
        reportToGA(metric);
        updateMetric('lcp', metric.value);
      });
    });

    // TTFB - Time to First Byte
    onTTFB((metric) => {
      safeReport(() => {
        logMetric(metric);
        reportToGA(metric);
        updateMetric('ttfb', metric.value);
      });
    });
  }, [updateMetric]);

  // Method to manually trigger performance report
  const reportPerformance = useCallback(() => {
    if (import.meta.env.DEV) {
      console.log('[Performance] Manual report:', metrics);
    }

    // Send all current metrics to GA
    Object.entries(metrics).forEach(([key, value]) => {
      if (value !== null && key !== 'timestamp') {
        const mockMetric: Metric = {
          name: key.toUpperCase() as Metric['name'],
          value: value as number,
          rating: getRating(key as keyof PerformanceMetrics, value as number),
          id: `manual-${Date.now()}`,
          delta: value as number,
          entries: [],
          navigationType: 'navigate' as const,
        };
        reportToGA(mockMetric);
      }
    });
  }, [metrics]);

  return {
    metrics,
    reportPerformance,
  };
};

// Helper function to determine metric rating
function getRating(metric: keyof PerformanceMetrics, value: number): 'good' | 'needs-improvement' | 'poor' {
  switch (metric) {
    case 'cls':
      return value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor';
    case 'inp':
      return value < 200 ? 'good' : value < 500 ? 'needs-improvement' : 'poor';
    case 'fcp':
    case 'lcp':
      return value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
    case 'ttfb':
      return value < 800 ? 'good' : value < 1800 ? 'needs-improvement' : 'poor';
    default:
      return 'good';
  }
}
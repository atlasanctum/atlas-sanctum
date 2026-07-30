import { useEffect, useCallback } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

export const usePerformanceOptimization = () => {
  // Preload critical resources
  const preloadResources = useCallback(() => {
    const criticalRoutes = ['/dashboard', '/marketplace', '/measurements'];
    
    criticalRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }, []);

  // Optimize images
  const optimizeImages = useCallback(() => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
    return () => imageObserver.disconnect();
  }, []);

  // Monitor Core Web Vitals using the new API
  const monitorWebVitals = useCallback(() => {
    onCLS((metric) => console.log('[CLS]', metric.value));
    onINP((metric) => console.log('[INP]', metric.value));
    onFCP((metric) => console.log('[FCP]', metric.value));
    onLCP((metric) => console.log('[LCP]', metric.value));
    onTTFB((metric) => console.log('[TTFB]', metric.value));
  }, []);

  useEffect(() => {
    preloadResources();
    const cleanup = optimizeImages();
    monitorWebVitals();
    
    return cleanup;
  }, [preloadResources, optimizeImages, monitorWebVitals]);

  return {
    preloadResources,
    optimizeImages,
    monitorWebVitals
  };
};
// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Enhanced Platform Analytics
export const analytics = {
  // Track user interactions
  trackEvent: (eventName: string, properties?: Record<string, any>) => {
    try {
      const eventData = {
        event: eventName,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...properties
      };

      // Send to Google Analytics
      if (typeof window.gtag === 'function') {
        try {
          window.gtag('event', eventName, properties);
        } catch (e) {
          // Silently fail if gtag call fails
          console.debug('gtag call failed:', e);
        }
      }

      // Store locally for offline analysis
      const events = JSON.parse(localStorage.getItem('platform_events') || '[]');
      events.push(eventData);

      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }

      localStorage.setItem('platform_events', JSON.stringify(events));
    } catch (error) {
      // Silently fail to prevent breaking the app
      console.debug('Analytics tracking failed:', error);
    }
  },

  // Track page views
  trackPageView: (pageName: string) => {
    analytics.trackEvent('page_view', {
      page_name: pageName,
      page_location: window.location.href,
      page_title: document.title
    });
  },

  // Track user engagement
  trackEngagement: (action: string, element?: string) => {
    analytics.trackEvent('user_engagement', {
      action,
      element,
      engagement_time: Date.now()
    });
  },

  // Track performance metrics
  trackPerformance: (metric: string, value: number, unit: string = 'ms') => {
    analytics.trackEvent('performance_metric', {
      metric_name: metric,
      metric_value: value,
      metric_unit: unit
    });
  },

  // Track performance metric (alias for compatibility)
  trackPerformanceMetric: (metric: string, value: number, unit: string = 'ms') => {
    analytics.trackPerformance(metric, value, unit);
  },

  // Track errors
  trackError: (error: Error, context?: Record<string, any>) => {
    analytics.trackEvent('platform_error', {
      error_message: error.message,
      error_stack: error.stack,
      error_context: context
    });
  },

  // Get analytics summary
  getSummary: () => {
    try {
      const eventsStr = localStorage.getItem('platform_events') || '[]';
      const events = JSON.parse(eventsStr);

      if (!Array.isArray(events)) {
        return {
          totalEvents: 0,
          pageViews: 0,
          errors: 0,
          engagements: 0,
          lastActivity: undefined
        };
      }

      const summary = {
        totalEvents: events.length,
        pageViews: events.filter((e: any) => e?.event === 'page_view').length,
        errors: events.filter((e: any) => e?.event === 'platform_error').length,
        engagements: events.filter((e: any) => e?.event === 'user_engagement').length,
        lastActivity: events[events.length - 1]?.timestamp
      };

      return summary;
    } catch (error) {
      // Return default summary on error
      console.debug('Failed to parse analytics summary:', error);
      return {
        totalEvents: 0,
        pageViews: 0,
        errors: 0,
        engagements: 0,
        lastActivity: undefined
      };
    }
  }
};

// Export individual functions for direct import
export const { trackEvent, trackPageView, trackEngagement, trackPerformance, trackPerformanceMetric, trackError, getSummary } = analytics;

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined') {
    // gtag is already defined in index.html, so we don't need to redefine it
    // The gtag function from HTML is sufficient for event tracking
    if (typeof window.gtag === 'function') {
      // gtag is already available, no need to initialize
      return;
    }
  }
};

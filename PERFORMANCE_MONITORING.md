# Performance Monitoring System

This document describes the comprehensive performance monitoring system implemented for the Atlas Genesis platform.

## Overview

The performance monitoring system tracks Core Web Vitals and other key performance metrics in real-time, providing insights into application performance and user experience.

## Features

### Core Web Vitals Tracking
- **First Contentful Paint (FCP)**: Time until first content appears
- **Largest Contentful Paint (LCP)**: Time until largest content element loads
- **Interaction to Next Paint (INP)**: Responsiveness to user interactions
- **Cumulative Layout Shift (CLS)**: Visual stability of the page
- **Time to First Byte (TTFB)**: Server response time

### Real-time Monitoring
- Automatic metric collection using the `web-vitals` library
- Real-time dashboard with live updates
- Performance rating calculation (Good/Needs Improvement/Poor)
- Console logging for development debugging

### Analytics Integration
- Google Analytics 4 integration for metric reporting
- Custom events and dimensions for performance data
- Privacy-compliant data collection

### Security & Enterprise Features
- Rate limiting (100 events per minute)
- Input sanitization and validation
- XSS protection for all tracked data
- Environment-based configuration
- Error handling and graceful degradation

### Automated Testing
- Lighthouse CI integration for continuous performance testing
- GitHub Actions workflow for automated performance checks
- Performance assertions and thresholds

## Setup

### Environment Variables

Add the following to your `.env` file:

```bash
VITE_GA_MEASUREMENT_ID=GA-XXXXXXXXXX
```

### Installation

The required dependencies are already installed:
- `web-vitals`: For Core Web Vitals measurement
- `lighthouse` & `@lhci/cli`: For automated performance testing

### Initialization

The performance monitoring system is automatically initialized when the app starts. No additional setup is required.

## Usage

### Performance Dashboard

Access the performance dashboard at `/admin/analytics` (Performance Monitoring tab). The dashboard shows:

- Overall performance score (0-100)
- Individual metric cards with ratings
- Real-time metric updates
- Performance recommendations
- Historical trend analysis

### Manual Performance Reporting

```typescript
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

const { reportPerformance } = usePerformanceMonitoring();

// Manually trigger performance report
reportPerformance();
```

### Custom Analytics Events

```typescript
import { trackEvent, trackPerformanceMetric } from '@/lib/analytics';

// Track custom events
trackEvent('user_action', {
  action: 'button_click',
  element: 'cta_button'
});

// Track performance metrics
trackPerformanceMetric('custom_metric', 150, 'good');
```

## Configuration

### Lighthouse CI

The `.lighthouserc.json` file contains Lighthouse CI configuration:

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run preview",
      "url": ["http://localhost:4173", "/dashboard", "/marketplace", "/admin"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.8}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

### Rate Limiting

- Maximum 100 events per minute
- Automatic throttling to prevent abuse
- Configurable limits in `src/lib/analytics.ts`

### Security Measures

- All input data is sanitized
- Event names validated against regex patterns
- Numeric values clamped to reasonable ranges
- XSS protection for string inputs

## Development

### Console Logging

Performance metrics are logged to the console in development mode:

```
[Performance] FCP: 1200.50 (good)
[Performance] LCP: 2500.75 (good)
[Analytics] Event tracked: web_vitals { ... }
```

### Testing Performance

Run Lighthouse locally:

```bash
# Run Lighthouse CI locally
npm run lighthouse:local

# Run Lighthouse on built application
npm run lighthouse
```

### GitHub Actions

The system includes automated performance testing via GitHub Actions. The workflow:

1. Builds the application
2. Runs Lighthouse CI
3. Reports results in PR comments
4. Fails CI if performance thresholds are not met

## Performance Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| FCP    | < 1800ms | 1800-3000ms | > 3000ms |
| LCP    | < 2500ms | 2500-4000ms | > 4000ms |
| INP    | < 200ms | 200-500ms | > 500ms |
| CLS    | < 0.1 | 0.1-0.25 | > 0.25 |
| TTFB   | < 800ms | 800-1800ms | > 1800ms |

## Troubleshooting

### Metrics Not Appearing

1. Check that `VITE_GA_MEASUREMENT_ID` is set
2. Verify Google Analytics is initialized
3. Check browser console for errors
4. Ensure user interactions have occurred (some metrics require user input)

### Lighthouse CI Failing

1. Check performance scores in the report
2. Review recommendations in the dashboard
3. Optimize images and assets
4. Reduce bundle size
5. Improve server response times

### Rate Limiting Issues

If events are being dropped due to rate limiting:
1. Reduce event frequency
2. Batch similar events
3. Check for infinite loops in event tracking

## Architecture

### Components

- `usePerformanceMonitoring`: React hook for metric collection
- `PerformanceDashboard`: UI component for displaying metrics
- `analytics.ts`: Google Analytics integration and security
- `.lighthouserc.json`: Lighthouse CI configuration
- GitHub Actions workflow: Automated testing

### Data Flow

1. User loads page → Performance monitoring initializes
2. Web Vitals library collects metrics → Hook updates state
3. Metrics sent to Google Analytics → Dashboard displays data
4. Lighthouse CI runs → Performance assertions checked

## Security Considerations

- All data sent to analytics is sanitized
- Rate limiting prevents abuse
- Environment variables protect sensitive configuration
- Error handling prevents information leakage
- GDPR/CCPA compliance through consent management

## Future Enhancements

- Real-time alerting for performance regressions
- Historical performance trend analysis
- A/B testing integration
- Custom performance budgets
- Integration with error tracking systems
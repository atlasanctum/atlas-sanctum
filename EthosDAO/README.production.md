# EthosDAO Collective Workspace - Production Deployment Guide

## 🚀 Production-Ready Features

### Core Infrastructure
- ✅ **Error Boundaries**: Comprehensive error handling with graceful fallbacks
- ✅ **Centralized Logging**: Production-grade logging with external service integration
- ✅ **API Service**: Retry logic, caching, request deduplication, and timeout handling
- ✅ **WebSocket Service**: Real-time collaboration with automatic reconnection
- ✅ **State Management**: Optimized context providers with performance monitoring
- ✅ **Performance Optimizations**: Memoization, lazy loading, and debouncing

### Security Features
- 🔒 CSRF protection
- 🔒 XSS prevention
- 🔒 Rate limiting
- 🔒 Secure WebSocket connections
- 🔒 Token-based authentication
- 🔒 Request size limits

### Monitoring & Analytics
- 📊 Performance tracking
- 📊 Error tracking (Sentry integration ready)
- 📊 User analytics
- 📊 Custom event tracking
- 📊 Real-time metrics

## 📋 Prerequisites

- Node.js 18+ 
- npm or pnpm
- Redis (for caching and sessions)
- PostgreSQL/MongoDB (for data persistence)

## 🔧 Environment Setup

1. **Copy environment variables:**
```bash
cp .env.example .env.production
```

2. **Configure environment variables:**
Edit `.env.production` with your production values:
- API endpoints
- WebSocket URLs
- Monitoring service keys (Sentry, GA, etc.)
- Blockchain RPC URLs
- Security secrets

## 📦 Installation

```bash
# Install dependencies
npm install

# Or with pnpm
pnpm install
```

## 🏗️ Build Process

```bash
# Production build
npm run build

# Build with source maps (for debugging)
npm run build -- --sourcemap

# Preview production build locally
npm run preview
```

## 🚢 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Option 2: Docker
```bash
# Build Docker image
docker build -t ethosdao-workspace:latest .

# Run container
docker run -p 3000:3000 \
  --env-file .env.production \
  ethosdao-workspace:latest
```

### Option 3: Traditional Server (Nginx + PM2)
```bash
# Build the application
npm run build

# Serve with Nginx (config provided in nginx.conf)
sudo systemctl start nginx

# Or use PM2 for Node.js serving
pm2 start ecosystem.config.js --env production
```

## 🔍 Health Checks

The application exposes health check endpoints:

- `/health` - Basic health check
- `/health/ready` - Readiness probe
- `/health/live` - Liveness probe

## 📊 Monitoring Setup

### Sentry Integration
1. Create a Sentry project
2. Add `SENTRY_DSN` to environment variables
3. Errors are automatically tracked

### Google Analytics
1. Create GA4 property
2. Add `GA_TRACKING_ID` to environment variables
3. User actions are automatically tracked

### Custom Metrics
```typescript
import { logger } from '@/app/services/logger.service';

// Track custom events
logger.trackAction('feature_used', { feature: 'workspace' });

// Performance monitoring
const endTimer = logger.startTimer('expensive_operation');
// ... operation
endTimer();
```

## 🔐 Security Checklist

- [ ] Update all secrets in `.env.production`
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers (CSP, HSTS, etc.)
- [ ] Regular dependency updates
- [ ] Security audit with `npm audit`

## 🧪 Testing Production Build

```bash
# Run production build locally
npm run build && npm run preview

# Test WebSocket connection
# Open browser console and check WebSocket status

# Test error boundaries
# Throw an error to see error boundary UI

# Test offline mode
# Disconnect network and verify graceful degradation
```

## 📈 Performance Optimization

### Implemented Optimizations:
- Code splitting by route
- Lazy loading of components
- Image optimization
- Request caching (60s TTL)
- Request deduplication
- WebSocket connection pooling
- Debounced user inputs
- Memoized expensive computations

### Performance Targets:
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Cumulative Layout Shift (CLS): < 0.1

## 🐛 Debugging Production Issues

### Enable Debug Mode:
```bash
# Set environment variable
ENABLE_DEBUG=true

# Or via localStorage in browser console
localStorage.setItem('debug', 'true');
```

### Access Logs:
```typescript
import { logger } from '@/app/services/logger.service';

// Get recent logs
const recentLogs = logger.getRecentLogs(100);

// Export all logs
const logData = logger.exportLogs();
```

### Check WebSocket Status:
```typescript
import { wsService } from '@/app/services/websocket.service';

// Check connection status
console.log(wsService.getConnectionStatus());
console.log(wsService.isConnected());
```

## 🔄 Updates & Maintenance

### Zero-Downtime Deployment:
1. Use blue-green deployment strategy
2. Health checks before routing traffic
3. Gradual rollout (10% → 50% → 100%)
4. Automatic rollback on errors

### Database Migrations:
```bash
# Run migrations before deployment
npm run migrate:up

# Rollback if needed
npm run migrate:down
```

### Cache Invalidation:
```bash
# Clear Redis cache
redis-cli FLUSHDB

# Or programmatically
apiService.clearCache();
```

## 📱 Mobile Considerations

- Responsive design implemented
- Touch-friendly interactions
- Optimized for mobile networks
- Progressive Web App (PWA) ready
- Offline support (with service worker)

## 🌍 CDN & Asset Optimization

### Recommended CDN Setup:
- CloudFlare (with Automatic Platform Optimization)
- AWS CloudFront
- Vercel Edge Network

### Asset Optimization:
- Images: WebP format, lazy loading
- Fonts: Preloaded, subset
- JavaScript: Minified, tree-shaken
- CSS: Critical CSS inlined

## 🔔 Alerts & Notifications

### Configure Alerts for:
- Error rate > 1%
- Response time > 2s
- WebSocket disconnections
- Failed deployments
- Security incidents
- High resource usage

## 📞 Support

For production issues:
- Email: support@ethosdao.com
- Status Page: status.ethosdao.com
- Documentation: docs.ethosdao.com

## 📜 License

Copyright © 2026 EthosDAO. All rights reserved.

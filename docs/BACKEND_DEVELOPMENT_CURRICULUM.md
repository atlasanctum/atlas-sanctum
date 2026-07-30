

---

## Module 9: Performance and Optimization

### Learning Objectives

Optimize database queries through proper indexing strategies, implement caching layers, apply load balancing fundamentals, profile code and benchmark performance, and tune memory management.

### Core Concepts

#### 9.1 Database Query Optimization

```typescript
// Query optimization with EXPLAIN ANALYZE
const explainQuery = `
    EXPLAIN ANALYZE
    SELECT u.id, u.username, COUNT(o.id) as order_count
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.created_at > $1
    GROUP BY u.id
    ORDER BY order_count DESC
    LIMIT 20
`;

// Index selection strategy
interface IndexRecommendation {
  columns: string[];
  type: "btree" | "hash" | "gin" | "gist";
  reason: string;
}

function analyzeIndexNeeds(queries: string[]): IndexRecommendation[] {
  const recommendations: IndexRecommendation[] = [];
  
  // Analyze WHERE clause patterns
  const wherePatterns = queries.flatMap(q => extractWhereClauses(q));
  
  // Recommend indexes for frequent filters
  const filterCounts = countOccurrences(wherePatterns);
  for (const [column, count] of filterCounts) {
    if (count >= 3) {
      recommendations.push({
        columns: [column],
        type: "btree",
        reason: `Column frequently used in WHERE clauses (${count} occurrences)`
      });
    }
  }
  
  return recommendations;
}

// Connection pooling configuration
const poolConfig = {
  min: 2,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  maxUses: 7500
};
```

#### 9.2 Caching Strategies

```typescript
// Multi-level caching implementation
class CacheManager {
  private memoryCache = new Map<string, unknown>();
  private redisCache: RedisCache;
  private defaultTtl = 3600;
  
  async get<T>(key: string): Promise<T | null> {
    // Level 1: Memory cache
    const memoryValue = this.memoryCache.get(key);
    if (memoryValue !== undefined) {
      return memoryValue as T;
    }
    
    // Level 2: Redis cache
    const redisValue = await this.redisCache.get<T>(key);
    if (redisValue !== null) {
      // Backfill memory cache
      this.memoryCache.set(key, redisValue);
      return redisValue;
    }
    
    return null;
  }
  
  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const effectiveTtl = ttl ?? this.defaultTtl;
    
    // Set in both levels
    this.memoryCache.set(key, value);
    await this.redisCache.set(key, value, effectiveTtl);
  }
  
  async invalidate(key: string): Promise<void> {
    this.memoryCache.delete(key);
    await this.redisCache.delete(key);
  }
  
  async invalidatePattern(pattern: string): Promise<void> {
    // Delete matching keys from both caches
    const keys = Array.from(this.memoryCache.keys())
      .filter(k => k.includes(pattern));
    keys.forEach(k => this.memoryCache.delete(k));
    
    await this.redisCache.deletePattern(`*:${pattern}*`);
  }
}
```

### Assessment Criteria

- Query optimization techniques
- Caching implementation
- Performance profiling
- Load balancing understanding

---

## Module 10: Security Best Practices

### Learning Objectives

Implement robust input validation and sanitization, apply rate limiting, configure CORS and CSRF protections, use secure headers, and establish secrets management.

### Core Concepts

#### 10.1 Security Middleware Implementation

```typescript
// Input validation with Zod
import { z } from "zod";

const userRegistrationSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  
  email: z.string()
    .email("Invalid email address")
    .toLowerCase(),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Secure headers middleware
function securityHeaders(req: Request, res: Response, next: NextFunction): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader("Content-Security-Policy", 
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");
  
  // HSTS for HTTPS
  if (req.secure || req.hostname === "localhost") {
    res.setHeader("Strict-Transport-Security", 
      "max-age=31536000; includeSubDomains; preload");
  }
  
  next();
}

// CORS configuration
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") ?? [];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  exposedHeaders: ["X-Request-ID", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
  credentials: true,
  maxAge: 86400
};
```

### Assessment Criteria

- Input validation implementation
- Security headers configuration
- CORS/CSRF protection
- Secrets management

---

## Module 11: DevOps and Deployment

### Learning Objectives

Manage environment configurations, build CI/CD pipelines, containerize applications with Docker, deploy to cloud platforms, and implement monitoring and logging.

### Core Concepts

#### 11.1 Docker Configuration

```dockerfile
# Multi-stage build for production
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

#### 11.2 CI/CD Pipeline

```yaml
# GitHub Actions workflow
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        ports: ["5432:5432"]
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: registry.heroku.com/${{ secrets.HEROKU_APP }}/web:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Assessment Criteria

- Docker configuration
- CI/CD pipeline implementation
- Environment management
- Monitoring setup

---

## Module 12: Real-World Projects

### Project 1: RESTful CRUD API with Authentication

**Description:** Build a complete RESTful API for a task management system with user authentication.

**Requirements:**
- User registration and login with JWT
- CRUD operations for tasks
- User task ownership and sharing
- Pagination and filtering
- Rate limiting
- Comprehensive test coverage

**Deliverables:**
- Source code with documentation
- API documentation (OpenAPI)
- Unit and integration tests
- Docker configuration

### Project 2: Real-Time Chat Application

**Description:** Build a real-time chat application with WebSocket support.

**Requirements:**
- Real-time messaging with Socket.io
- Room-based chat channels
- User presence indicators
- Message history
- Typing indicators
- Authentication integration

**Deliverables:**
- Complete source code
- WebSocket documentation
- Performance tests

### Project 3: E-commerce Backend API

**Description:** Build a comprehensive e-commerce backend with inventory and payments.

**Requirements:**
- Product catalog management
- Shopping cart functionality
- Order processing
- Payment integration (Stripe)
- Inventory management
- Admin dashboard APIs

**Deliverables:**
- Full API implementation
- Database schema
- API documentation
- Deployment configuration

---

## Module 13: Continuous Learning

### Resources for Continued Learning

#### Official Documentation
- [Node.js Documentation](https://nodejs.org/docs/latest/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)

#### Recommended Books
- "Node.js Design Patterns" by Mario Casciaro
- "TypeScript Deep Dive" by Basarat Ali Syed
- "Database Systems: The Complete Book" by Garcia-Molina
- "Security Engineering" by Ross Anderson

#### Online Courses
- Backend Development Bootcamps
- System Design Interview courses
- Cloud Architecture certifications

#### Community Resources
- Stack Overflow
- Reddit (r/node, r/programming)
- Dev.to
- HackerRank for algorithm practice

#### Certification Paths
- AWS Solutions Architect
- Google Cloud Professional
- Certified Kubernetes Administrator

---

## Assessment Framework

### Module Assessments
Each module includes:
- Conceptual understanding quizzes
- Coding exercises with automated grading
- Code review assessments
- Performance benchmarks

### Final Assessment
- Comprehensive project covering all modules
- Architecture design documentation
- Production deployment
- Security audit
- Performance optimization report

### Grading Criteria
- **Code Quality**: 25% (style, organization, documentation)
- **Functionality**: 30% (requirements fulfillment, bug-free operation)
- **Security**: 20% (vulnerability assessment, secure coding)
- **Performance**: 15% (optimization, scalability)
- **Testing**: 10% (coverage, test quality)

---

## Conclusion

This curriculum provides a comprehensive path to mastering backend development. Success requires dedication, practice, and continuous learning. Each module builds upon the previous, creating a solid foundation for building production-ready backend systems.

The key to success is hands-on practice. Implement the exercises, build the projects, and don't be afraid to experiment. The backend development landscape evolves rapidly, so stay curious and keep learning.

Good luck on your backend development journey!

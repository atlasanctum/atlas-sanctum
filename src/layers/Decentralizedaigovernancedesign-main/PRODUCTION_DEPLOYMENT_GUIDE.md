# 🚀 Production Deployment Guide

## Complete Checklist for Production Deployment

---

## ✅ **Pre-Deployment Checklist**

### 1. **Environment Configuration**

- [ ] Copy `.env.example` to `.env.local`
- [ ] Set all required environment variables
- [ ] Generate strong secrets for `JWT_SECRET`, `SESSION_SECRET`, `API_SECRET_KEY`
- [ ] Configure blockchain RPC endpoints (Alchemy/Infura)
- [ ] Set up WalletConnect Project ID
- [ ] Configure database connection strings
- [ ] Set up Redis connection
- [ ] Configure IPFS/Pinata credentials
- [ ] Set monitoring (Sentry DSN)
- [ ] Configure email service (SendGrid)
- [ ] Set Discord webhook for alerts
- [ ] Enable SSL (`FORCE_SSL=true`)
- [ ] Set `NODE_ENV=production`

### 2. **Dependencies & Build**

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Run type checks
pnpm run type-check

# Run linting
pnpm run lint

# Run tests
pnpm run test

# Generate production build
pnpm run build
```

### 3. **Smart Contract Deployment**

#### A. Compile Contracts
```bash
cd contracts
npx hardhat compile
```

#### B. Deploy to Testnet (First)
```bash
npx hardhat run scripts/deploy.ts --network goerli
```

#### C. Verify Contracts on Etherscan
```bash
npx hardhat verify --network goerli DEPLOYED_CONTRACT_ADDRESS
```

#### D. Update Environment Variables
```bash
# Update .env.local with deployed contract addresses
NEXT_PUBLIC_SOULBOUND_ADDRESS=0x...
NEXT_PUBLIC_OPTIMISTIC_ADDRESS=0x...
NEXT_PUBLIC_ZK_VOTING_ADDRESS=0x...
NEXT_PUBLIC_RPGF_ADDRESS=0x...
NEXT_PUBLIC_IMPACT_CERTS_ADDRESS=0x...
NEXT_PUBLIC_RISK_MONITOR_ADDRESS=0x...
```

### 4. **Database Setup**

#### A. PostgreSQL
```sql
-- Create database
CREATE DATABASE ethosdao;

-- Create user
CREATE USER ethosdao WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ethosdao TO ethosdao;
```

#### B. Run Migrations
```bash
# Apply database schema
npm run migrate

# Seed initial data (optional)
npm run seed
```

#### C. Database Backups
```bash
# Set up automated backups
pg_dump ethosdao > backup_$(date +%Y%m%d).sql

# Add to cron for daily backups
0 2 * * * pg_dump ethosdao > /backups/ethosdao_$(date +\%Y\%m\%d).sql
```

### 5. **Security Hardening**

#### A. Smart Contract Audits
- [ ] Audit by Trail of Bits / OpenZeppelin / Consensys Diligence
- [ ] Bug bounty program on Immunefi ($100K+ rewards)
- [ ] Formal verification of critical functions
- [ ] Time-lock on governance changes (48+ hours)

#### B. Application Security
- [ ] Enable HTTPS/SSL
- [ ] Set secure headers (CSP, HSTS, X-Frame-Options)
- [ ] Enable rate limiting
- [ ] Set up WAF (Cloudflare)
- [ ] Configure CORS properly
- [ ] Enable request validation
- [ ] Set up DDoS protection

#### C. Secrets Management
- [ ] Use environment variables (never commit secrets)
- [ ] Rotate secrets regularly (90 days)
- [ ] Use secret management service (AWS Secrets Manager / HashiCorp Vault)
- [ ] Separate secrets per environment

### 6. **Testing**

#### A. Unit Tests
```bash
pnpm run test
pnpm run test:coverage
```

Target: 80%+ code coverage

#### B. Integration Tests
```bash
pnpm run test:integration
```

#### C. E2E Tests
```bash
pnpm run test:e2e
```

#### D. Security Tests
```bash
# Smart contract testing
npx hardhat test

# Vulnerability scanning
npm audit
snyk test
```

#### E. Load Testing
```bash
# Use k6 or Artillery
k6 run load-test.js
```

Target: 1000+ req/sec

---

## 🚢 **Deployment Options**

### Option 1: Docker Deployment

```bash
# Build Docker image
docker build -t ethosdao:latest .

# Run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale api=3
```

### Option 2: Kubernetes Deployment

```bash
# Apply configurations
kubectl apply -f k8s/

# Check deployment
kubectl get pods
kubectl get services

# View logs
kubectl logs -f deployment/ethosdao-app

# Scale deployment
kubectl scale deployment ethosdao-app --replicas=5
```

### Option 3: Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_CHAIN_ID production
```

### Option 4: AWS Deployment

```bash
# Using AWS Amplify or Elastic Beanstalk
aws amplify create-app --name ethosdao
eb init
eb create production-env
eb deploy
```

---

## 📊 **Monitoring & Observability**

### 1. **Application Monitoring**

#### A. Sentry (Error Tracking)
```javascript
// sentry.config.js
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

#### B. Logs
```bash
# Structured logging with Winston/Pino
npm install winston

# Configure log aggregation (ELK/Datadog)
```

#### C. Metrics
- Response time
- Request rate
- Error rate
- Memory usage
- CPU usage
- Database query time

### 2. **Blockchain Monitoring**

- [ ] Monitor contract events with The Graph
- [ ] Set up Tenderly for transaction monitoring
- [ ] Configure alerts for failed transactions
- [ ] Track gas prices
- [ ] Monitor wallet balances

### 3. **Infrastructure Monitoring**

- [ ] Set up Prometheus + Grafana
- [ ] Configure CloudWatch (AWS)
- [ ] Set up uptime monitoring (UptimeRobot/Pingdom)
- [ ] Database performance monitoring
- [ ] Redis monitoring

### 4. **Alerts**

Critical Alerts:
- [ ] API response time > 2s
- [ ] Error rate > 1%
- [ ] Database connection failures
- [ ] Smart contract failures
- [ ] Security threats detected
- [ ] Disk space < 10%

---

## 🔄 **CI/CD Pipeline**

### GitHub Actions Workflow

```yaml
# .github/workflows/production.yml
name: Production Deployment

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Install dependencies
      - Run tests
      - Build application
      - Security scan
      - Deploy to production
      - Run smoke tests
      - Notify team
```

### Deployment Strategy

1. **Blue-Green Deployment**
   - Deploy to new environment
   - Run smoke tests
   - Switch traffic
   - Keep old version for rollback

2. **Canary Deployment**
   - Deploy to 10% of users
   - Monitor metrics
   - Gradually increase to 100%

3. **Rolling Deployment**
   - Update instances one by one
   - Zero downtime
   - Auto-rollback on failure

---

## 🛡️ **Security Checklist**

### Smart Contracts
- [ ] Reentrancy guards on all state-changing functions
- [ ] Access control on admin functions
- [ ] Input validation on all parameters
- [ ] Safe math operations (Solidity 0.8+)
- [ ] Emergency pause mechanism
- [ ] Rate limiting on sensitive functions
- [ ] Multi-sig for critical operations

### Application
- [ ] HTTPS enforced
- [ ] XSS protection
- [ ] CSRF protection
- [ ] SQL injection prevention
- [ ] Rate limiting (100 req/15min)
- [ ] Input sanitization
- [ ] Output encoding
- [ ] Secure session management
- [ ] Password hashing (bcrypt)
- [ ] JWT with short expiry

### Infrastructure
- [ ] Firewall configured
- [ ] DDoS protection
- [ ] WAF rules
- [ ] Database encryption at rest
- [ ] Encrypted backups
- [ ] Private subnets
- [ ] Bastion host for SSH
- [ ] Rotate access keys

---

## 📈 **Performance Optimization**

### Frontend
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Image optimization (Next.js Image)
- [ ] CDN for static assets
- [ ] Compress responses (gzip/brotli)
- [ ] Browser caching
- [ ] Minification

### Backend
- [ ] Database indexing
- [ ] Query optimization
- [ ] Connection pooling
- [ ] Redis caching
- [ ] API response caching
- [ ] Horizontal scaling
- [ ] Load balancing

### Blockchain
- [ ] Gas optimization
- [ ] Batch transactions
- [ ] EIP-1559 for gas pricing
- [ ] Fallback RPC providers

---

## 🔧 **Post-Deployment**

### 1. **Smoke Tests**
```bash
# Test critical paths
curl https://ethosdao.org/api/health
curl https://ethosdao.org/api/metrics

# Test wallet connection
# Test proposal creation
# Test voting
# Test reputation system
```

### 2. **Monitoring Dashboard**
- [ ] Set up Grafana dashboard
- [ ] Configure alerts
- [ ] Monitor key metrics
- [ ] Set up on-call rotation

### 3. **Documentation**
- [ ] Update deployment docs
- [ ] Document runbooks
- [ ] Create incident response plan
- [ ] Update API documentation

### 4. **Communication**
- [ ] Announce launch
- [ ] Update status page
- [ ] Notify community
- [ ] Publish changelog

---

## 🚨 **Incident Response**

### 1. **Severity Levels**

**P0 - Critical**
- System completely down
- Security breach
- Data loss
- Response: Immediate (< 15 min)

**P1 - High**
- Major feature broken
- Severe performance degradation
- Response: < 1 hour

**P2 - Medium**
- Minor feature broken
- Some users affected
- Response: < 4 hours

**P3 - Low**
- Cosmetic issues
- Enhancement requests
- Response: < 24 hours

### 2. **Incident Response Process**

1. **Detect** - Monitoring alerts trigger
2. **Assess** - Determine severity
3. **Respond** - Execute runbook
4. **Communicate** - Update status page
5. **Resolve** - Fix the issue
6. **Post-mortem** - Document learnings

### 3. **Rollback Procedure**

```bash
# Quick rollback to previous version
kubectl rollout undo deployment/ethosdao-app

# Or with Docker
docker-compose down
docker-compose -f docker-compose.previous.yml up -d

# Verify rollback
curl https://ethosdao.org/api/health
```

---

## 📊 **Success Metrics**

### Technical Metrics
- **Uptime**: 99.9%+
- **Response Time**: < 500ms (p95)
- **Error Rate**: < 0.1%
- **Apdex Score**: > 0.95
- **Time to Recovery**: < 30 min

### Business Metrics
- **Active Users**: Track DAU/MAU
- **Proposals Created**: Monitor growth
- **Voting Participation**: Target 70%+
- **Transaction Success Rate**: 99%+
- **User Retention**: > 50% monthly

---

## 🔒 **Compliance & Legal**

- [ ] Privacy Policy (GDPR/CCPA)
- [ ] Terms of Service
- [ ] Cookie Policy
- [ ] Data Processing Agreement
- [ ] Security Audit Reports
- [ ] Penetration Test Results
- [ ] Compliance Certifications (SOC 2)

---

## 📚 **Resources**

### Documentation
- [Smart Contract Docs](./contracts/README.md)
- [API Documentation](./api/README.md)
- [System Architecture](./COMPLETE_SYSTEM_OVERVIEW.md)
- [Runbooks](./docs/runbooks/)

### Tools
- **Monitoring**: Sentry, Datadog, Grafana
- **CI/CD**: GitHub Actions, Jenkins
- **Testing**: Vitest, Playwright, Hardhat
- **Security**: Snyk, OpenZeppelin, Slither
- **Infrastructure**: Docker, Kubernetes, Terraform

### Support
- **Email**: support@ethosdao.org
- **Discord**: [Community Server]
- **Status Page**: https://status.ethosdao.org
- **Documentation**: https://docs.ethosdao.org

---

## ✅ **Final Checklist**

Before going live:

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Smart contracts verified
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Monitoring configured
- [ ] Alerts set up
- [ ] Backup strategy in place
- [ ] Rollback procedure tested
- [ ] Documentation updated
- [ ] Team trained
- [ ] Incident response plan ready
- [ ] Legal compliance verified
- [ ] Performance benchmarks met
- [ ] Accessibility tested (WCAG 2.1)
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing complete
- [ ] Load testing successful
- [ ] Disaster recovery tested
- [ ] Communication plan ready

---

## 🎉 **Launch Day**

### Timeline

**T-24 hours**
- Final code freeze
- Deploy to staging
- Run full test suite
- Final security scan

**T-12 hours**
- Deploy to production
- Monitor closely
- Team on standby

**T-0 hours**
- Public announcement
- Monitor metrics
- Respond to issues

**T+24 hours**
- Review metrics
- Address feedback
- Plan improvements

---

**Good luck with your deployment! 🚀**

For issues or questions, contact: devops@ethosdao.org

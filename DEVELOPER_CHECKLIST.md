# 🔨 Phase 2 Developer's Implementation Checklist

**Day-by-day implementation guide with exact commands and file locations.**

---

## Week Overview

```
Day 1-2: Payment Processing (6-8 hours)
  - Paystack integration setup
  - PayPal integration setup
  - Payment routes and database

Day 3-4: Email Notifications (8 hours)
  - EmailService implementation
  - Database triggers setup
  - Email queue worker

Day 5-6: Security Hardening (16 hours)
  - Rate limiting middleware
  - CORS configuration
  - API key system
  - Role-based access control

Day 7: Testing & Deployment (6 hours)
  - Unit tests
  - Integration testing
  - Load testing
  - Deploy to staging
```

---

## ✅ Pre-Implementation Checklist

Before you start coding, complete these setup tasks:

```bash
# 1. Create external accounts
# Paystack: https://paystack.com/signup
#   - Get PAYSTACK_PUBLIC_KEY (pk_...)
#   - Get PAYSTACK_SECRET_KEY (sk_...)
#   - Copy webhook secret

# PayPal: https://developer.paypal.com
#   - Create sandbox app
#   - Get PAYPAL_CLIENT_ID
#   - Get PAYPAL_CLIENT_SECRET

# SendGrid: https://sendgrid.com/signup
#   - Create API key
#   - Verify sender email

# 2. Update your .env file
cd /Users/gene/Documents/Atlas\ Humanitarian/atlas-genesis-fe2efd70/scaffold-mvp/backend
cat > .env << 'EOF'
# Existing variables...
DATABASE_URL=postgresql://user:pass@localhost/atlas
JWT_SECRET=your-secret-key

# NEW: Payments
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_WEBHOOK_SECRET=wh_xxxxx
PAYPAL_CLIENT_ID=xxxxx
PAYPAL_CLIENT_SECRET=xxxxx
PAYPAL_MODE=sandbox

# NEW: Email
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@atlas-genesis.com

# NEW: Frontend URL for redirects
FRONTEND_URL=http://localhost:8080

# NEW: Security
CORS_ORIGIN=http://localhost:8080
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# 3. Install dependencies NOW
npm install axios @sendgrid/mail express-rate-limit cors
```

---

## DAY 1-2: PAYMENT PROCESSING

### Step 1: Create Database Migration

**File:** `scaffold-mvp/db/migrations/202412XX_add_payments.sql`

```sql
-- Create transactions table
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  reference VARCHAR(255) UNIQUE NOT NULL,
  external_id VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  amount BIGINT NOT NULL, -- in cents
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
  provider VARCHAR(50) NOT NULL, -- paystack, paypal
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_reference ON transactions(reference);

-- Create RIU purchases table
CREATE TABLE riu_purchases (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL, -- in cents
  transaction_reference VARCHAR(255) NOT NULL REFERENCES transactions(reference),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_riu_purchases_user_id ON riu_purchases(user_id);
```

**Run it:**
```bash
cd scaffold-mvp
psql -d atlas_dev -f db/migrations/202412XX_add_payments.sql
# Verify with: \d transactions
```

### Step 2: Create PaymentService

**File:** `scaffold-mvp/backend/src/services/paymentService.ts`

Copy the complete `PaymentService` class from [PHASE_2_IMPLEMENTATION_GUIDE.md](PHASE_2_IMPLEMENTATION_GUIDE.md#step-2-create-payment-service)

```bash
# Create the file
touch scaffold-mvp/backend/src/services/paymentService.ts

# Paste the 400+ lines from the guide
# Add imports at top:
import axios from 'axios';
import crypto from 'crypto';
import { db } from '../db';
```

**Test it:**
```bash
cd scaffold-mvp/backend
npx ts-node -e "
import { paymentService } from './src/services/paymentService';
// Test Paystack initialization
paymentService.initializePaystackTransaction({
  email: 'test@example.com',
  amount: 50000, // 500 naira
  reference: 'test-' + Date.now()
}).then(result => console.log(result));
"
```

### Step 3: Create Payment Routes

**File:** `scaffold-mvp/backend/src/routes/payments.ts`

Copy the complete routes from [PHASE_2_IMPLEMENTATION_GUIDE.md](PHASE_2_IMPLEMENTATION_GUIDE.md#step-3-create-payment-routes)

```bash
# Create the file
touch scaffold-mvp/backend/src/routes/payments.ts

# Paste the 250+ lines from the guide
```

### Step 4: Register Routes in Express

**File:** `scaffold-mvp/backend/src/index.ts`

```typescript
// Add to imports
import paymentRoutes from './routes/payments';
import { paymentService } from './services/paymentService';

// Add to app setup (after other routes)
app.use('/api/v2/payments', paymentRoutes);

// Make payment service available globally (optional)
app.locals.paymentService = paymentService;
```

### Step 5: Test Payment Flow

```bash
# 1. Start the backend
cd scaffold-mvp/backend
npm start

# 2. In another terminal, test initialization
curl -X POST http://localhost:3001/api/v2/payments/paystack/initialize \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "riumQuantity": 5
  }'

# Expected response:
# {
#   "success": true,
#   "authorizationUrl": "https://checkout.paystack.com/...",
#   "reference": "atlas-1702..."
# }

# 3. Manually verify in browser:
# Open the authorizationUrl
# Use Paystack test card: 4084084084084081
# Test OTP: 123456
# 4. Get reference from response, then verify:

curl -X GET http://localhost:3001/api/v2/payments/paystack/verify/atlas-1702... \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Expected response:
# {
#   "success": true,
#   "status": "success",
#   "amount": 50000
# }
```

---

## DAY 3-4: EMAIL NOTIFICATIONS

### Step 1: Create Email Service

**File:** `scaffold-mvp/backend/src/services/emailService.ts`

Copy from [PHASE_2_IMPLEMENTATION_GUIDE.md](PHASE_2_IMPLEMENTATION_GUIDE.md#step-2-create-email-service)

```bash
# Create the file
touch scaffold-mvp/backend/src/services/emailService.ts

# Paste the 200+ lines from guide
# Key imports:
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
```

### Step 2: Create Email Queue Table

**File:** `scaffold-mvp/db/migrations/202412XX_email_system.sql`

```sql
CREATE TABLE email_queue (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  email_type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed
  attempts INT DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_user_id ON email_queue(user_id);
```

**Run it:**
```bash
psql -d atlas_dev -f scaffold-mvp/db/migrations/202412XX_email_system.sql
```

### Step 3: Create Email Triggers

**File:** `scaffold-mvp/db/migrations/202412XX_email_triggers.sql`

Copy from guide and run:
```bash
psql -d atlas_dev -f scaffold-mvp/db/migrations/202412XX_email_triggers.sql
```

### Step 4: Create Email Worker

**File:** `scaffold-mvp/backend/src/workers/emailWorker.ts`

Copy from [PHASE_2_IMPLEMENTATION_GUIDE.md](PHASE_2_IMPLEMENTATION_GUIDE.md#step-4-create-email-worker)

```bash
touch scaffold-mvp/backend/src/workers/emailWorker.ts
# Paste the 80+ lines from guide
```

### Step 5: Test Email Sending

```bash
# 1. Manually test EmailService
cd scaffold-mvp/backend
npx ts-node -e "
import { emailService } from './src/services/emailService';
emailService.sendWelcomeEmail('your-email@example.com', 'Test User')
  .then(success => console.log('Email sent:', success));
"

# 2. Check your inbox for the email
# If not in inbox, check spam folder

# 3. Run email worker manually
npm run worker:emails
# or: node -r ts-node/register src/workers/emailWorker.ts
```

### Step 6: Add to App Startup

**File:** `scaffold-mvp/backend/src/index.ts`

```typescript
// Add to imports
import { processEmailQueue } from './workers/emailWorker';

// Start email processing worker (runs every 60 seconds)
setInterval(processEmailQueue, 60000);

// Or run immediately for testing:
// processEmailQueue();
```

---

## DAY 5-6: SECURITY HARDENING

### Step 1: Create Rate Limiter Middleware

**File:** `scaffold-mvp/backend/src/middleware/rateLimiter.ts`

Copy from [PHASE_2_IMPLEMENTATION_GUIDE.md](PHASE_2_IMPLEMENTATION_GUIDE.md#step-1-rate-limiting-middleware)

```bash
touch scaffold-mvp/backend/src/middleware/rateLimiter.ts
# Paste 50+ lines from guide
```

### Step 2: Configure CORS

**File:** `scaffold-mvp/backend/src/middleware/cors.ts`

Create new file:
```bash
touch scaffold-mvp/backend/src/middleware/cors.ts
```

```typescript
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:3000',
  'https://atlas-genesis.com',
  'https://staging.atlas-genesis.com',
];

export const corsConfig = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
});
```

### Step 3: Create API Key Service

**File:** `scaffold-mvp/backend/src/services/apiKeyService.ts`

Copy from [PHASE_2_IMPLEMENTATION_GUIDE.md](PHASE_2_IMPLEMENTATION_GUIDE.md#step-3-api-key-service)

```bash
touch scaffold-mvp/backend/src/services/apiKeyService.ts
# Paste 120+ lines from guide
```

### Step 4: Create API Key Middleware

**File:** `scaffold-mvp/backend/src/middleware/apiKeyAuth.ts`

Copy from guide:
```bash
touch scaffold-mvp/backend/src/middleware/apiKeyAuth.ts
# Paste 50+ lines
```

### Step 5: Create Role-Based Access Control

**File:** `scaffold-mvp/backend/src/middleware/roleCheck.ts`

Copy from guide:
```bash
touch scaffold-mvp/backend/src/middleware/roleCheck.ts
# Paste 80+ lines
```

### Step 6: Add API Keys to Database

```sql
CREATE TABLE api_keys (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_hash VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  last_used_at TIMESTAMP,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);

-- Add role column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';
CREATE INDEX idx_users_role ON users(role);
```

### Step 7: Register Middleware in Express

**File:** `scaffold-mvp/backend/src/index.ts`

```typescript
import { apiLimiter, authLimiter, paymentLimiter } from './middleware/rateLimiter';
import { corsConfig } from './middleware/cors';

// Apply CORS globally
app.use(corsConfig);

// Apply general rate limiter
app.use(apiLimiter);

// Apply stricter limits to specific routes
app.post('/api/*/auth/login', authLimiter);
app.post('/api/*/auth/signup', authLimiter);

// Payment limiter already in payment routes
```

### Step 8: Test Security

```bash
# Test rate limiting (make 105 requests in 15 minutes)
for i in {1..105}; do
  curl http://localhost:3001/api/v2/marketplace/listings
  sleep 0.5
done
# Should get 429 (Too Many Requests) after 100

# Test CORS (from wrong origin)
curl -H "Origin: https://evil.com" \
  -H "Access-Control-Request-Method: GET" \
  http://localhost:3001/api/v2/marketplace/listings
# Should get CORS error

# Test API key
# First create a key:
curl -X POST http://localhost:3001/api/v2/admin/api-keys \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"name": "Mobile App"}'

# Then use it:
curl -H "X-API-Key: sk_test_xxxxx" \
  http://localhost:3001/api/v2/marketplace/listings
# Should work

# Test roles
curl -H "Authorization: Bearer USER_JWT" \
  http://localhost:3001/api/v2/admin/users
# Should get 403 if user is not admin
```

---

## DAY 7: TESTING & DEPLOYMENT

### Unit Tests

**File:** `scaffold-mvp/backend/src/__tests__/payments.test.ts`

```typescript
import { paymentService } from '../services/paymentService';

describe('PaymentService', () => {
  test('should initialize Paystack transaction', async () => {
    const result = await paymentService.initializePaystackTransaction({
      email: 'test@example.com',
      amount: 50000,
      reference: 'test-123',
    });
    expect(result.success).toBe(true);
    expect(result.authorizationUrl).toBeDefined();
  });

  test('should validate API key', async () => {
    const { apiKey } = await apiKeyService.generateAPIKey(
      'user-1',
      'Test Key'
    );
    const validation = await apiKeyService.validateAPIKey(apiKey);
    expect(validation.valid).toBe(true);
  });
});
```

**Run tests:**
```bash
cd scaffold-mvp/backend
npm test
# or: npm run test:watch
```

### Integration Tests

```bash
# 1. Start backend
npm start &

# 2. Test payment flow
PAYMENT_REF=$(curl -s -X POST http://localhost:3001/api/v2/payments/paystack/initialize \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 50000, "riumQuantity": 5}' | jq -r '.reference')

echo "Payment reference: $PAYMENT_REF"

# 3. Manually verify in Paystack sandbox, then verify in API
curl -X GET http://localhost:3001/api/v2/payments/paystack/verify/$PAYMENT_REF \
  -H "Authorization: Bearer $JWT_TOKEN"

# 4. Check database
psql -d atlas_dev -c "SELECT * FROM transactions WHERE reference = '$PAYMENT_REF';"
```

### Load Testing

```bash
# Install Apache Bench
# Mac: brew install httpd

# Test rate limiting
ab -n 120 -c 10 http://localhost:3001/api/v2/marketplace/listings

# Should show:
# Non-2xx responses: ~20 (the 429s from rate limiting)
# RPS (Requests Per Second): should be ~100/15min = 0.1

# Test WebSocket (if implemented)
# npm install -g artillery
artillery quick --count 100 --num 1000 ws://localhost:3001
```

### Deploy to Staging

```bash
# 1. Commit all changes
cd /Users/gene/Documents/Atlas\ Humanitarian/atlas-genesis-fe2efd70
git add .
git commit -m "Phase 2: Payment processing, emails, security"

# 2. Build
npm run build
cd scaffold-mvp/backend
npm run build

# 3. Deploy to staging
# (depends on your hosting - could be Heroku, Railway, AWS, etc.)
# Example with Heroku:
heroku login
git push heroku main

# 4. Run migrations on staging
heroku run "npm run migrate"

# 5. Test in staging
curl https://atlas-staging.herokuapp.com/api/v2/marketplace/listings

# 6. Monitor logs
heroku logs --tail
```

### Deploy to Production

```bash
# Only after staging is 100% tested!

# 1. Tag release
git tag -a v1.1.0 -m "Phase 2 release"
git push origin v1.1.0

# 2. Deploy
# (your deployment process)

# 3. Monitor carefully
# Check error logs every 5 minutes for first hour
# Watch payment success rate
# Monitor API response times

# 4. Be ready to rollback
git revert v1.1.0
# or: git reset --hard v1.0.0

# 5. Set up alerts
# Email if error rate > 1%
# Email if payment success < 95%
# Email if response time > 500ms
```

---

## 🐛 Debugging Guide

### Payment Issues

```bash
# 1. Check transaction in database
psql -d atlas_dev -c "SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5;"

# 2. Check Paystack webhook logs
# Go to Paystack dashboard → Settings → Webhooks

# 3. Verify API keys
echo "PAYSTACK_SECRET_KEY: $PAYSTACK_SECRET_KEY"

# 4. Test with curl
curl -H "Authorization: Bearer sk_test_xxx" \
  https://api.paystack.co/transaction/verify/test-ref
```

### Email Issues

```bash
# 1. Check email queue
psql -d atlas_dev -c "SELECT * FROM email_queue;"

# 2. Check last error
psql -d atlas_dev -c "SELECT last_error FROM email_queue WHERE status = 'failed';"

# 3. Manually send test email
npx ts-node -e "
import { emailService } from './src/services/emailService';
emailService.sendWelcomeEmail('you@example.com', 'Test')
  .then(r => console.log('Success:', r))
  .catch(e => console.error('Error:', e.message));
"

# 4. Check SendGrid logs
# Go to SendGrid dashboard → Activity Feed
```

### Rate Limiting Issues

```bash
# 1. Check current limits in code
grep -n "max:" scaffold-mvp/backend/src/middleware/rateLimiter.ts

# 2. Increase limits if needed
# Edit rateLimiter.ts, change max: 100 to max: 1000

# 3. Test new limits
ab -n 1005 -c 10 http://localhost:3001/api/v2/endpoint
```

---

## ✅ Final Verification Checklist

Before moving to Phase 3, verify:

- [ ] All migrations ran successfully
- [ ] Payment flow works end-to-end
- [ ] Emails send on signup and payment
- [ ] Rate limiting blocks after 100 requests
- [ ] CORS works for allowed origins, blocks others
- [ ] API keys can be generated and validated
- [ ] User roles enforce permissions
- [ ] No errors in logs
- [ ] Database has test data
- [ ] Staging deployment successful
- [ ] Production deployment successful
- [ ] Team trained on new systems
- [ ] Documentation updated

---

## 📊 Monitoring Checklist

After deployment, monitor:

```
Every hour:
  - [ ] Error rate (should be < 1%)
  - [ ] API response time (should be < 500ms)
  - [ ] Payment success rate (should be > 95%)
  - [ ] Email sending rate (should be 100%)

Every day:
  - [ ] Total transactions processed
  - [ ] Total emails sent
  - [ ] Active API key users
  - [ ] Database size growth
  - [ ] User feedback / bug reports

Every week:
  - [ ] Revenue generated
  - [ ] User complaints
  - [ ] Feature requests
  - [ ] Plan for Phase 3 improvements
```

---

**You're ready to go. Good luck! 🚀**

Next: Start with Day 1 (Payment processing)

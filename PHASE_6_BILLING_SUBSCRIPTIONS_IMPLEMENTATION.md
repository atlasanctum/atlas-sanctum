# Phase 6: Enterprise Billing & Subscriptions - Implementation Summary

## Overview

Phase 6 implements enterprise-grade billing and subscription management with Stripe integration. This phase provides complete subscription lifecycle management, invoicing, payment processing, and usage tracking.

## Architecture

### Backend Services

#### 1. Billing Service ([`backend/src/services/billing.ts`](backend/src/services/billing.ts))
- **Purpose**: Manages subscriptions, billing plans, and usage tracking
- **Key Features**:
  - Stripe customer management
  - Subscription creation and management
  - Usage tracking and alerts
  - Billing summary generation
  - Stripe webhook event handling

**Key Functions**:
- `createCustomer(userId, email, organizationId)` - Create Stripe customer
- `getOrCreateCustomer(userId, email, organizationId)` - Get or create customer
- `createSubscription(userId, organizationId, planId, paymentMethodId)` - Create new subscription
- `updateSubscription(subscriptionId, planId)` - Update subscription plan
- `cancelSubscription(subscriptionId, cancelAtPeriodEnd)` - Cancel subscription
- `resumeSubscription(subscriptionId)` - Resume canceled subscription
- `getUserSubscription(userId)` - Get user's subscription
- `getOrganizationSubscription(organizationId)` - Get organization's subscription
- `getBillingPlans()` - Get all billing plans
- `getBillingPlan(planId)` - Get specific billing plan
- `recordUsage(subscriptionId, userId, organizationId, metric, quantity)` - Record usage
- `getUsage(subscriptionId, startDate, endDate)` - Get usage records
- `getUsageSummary(organizationId, startDate, endDate)` - Get usage summary
- `checkUsageAlerts(subscriptionId, organizationId, metric)` - Check for usage alerts
- `createAlert(userId, organizationId, type, severity, message)` - Create billing alert
- `getAlerts(userId)` - Get user's alerts
- `markAlertAsRead(alertId)` - Mark alert as read
- `getBillingSummary(organizationId)` - Get billing summary
- `handleWebhookEvent(event)` - Handle Stripe webhook events

#### 2. Invoice Service ([`backend/src/services/invoice.ts`](backend/src/services/invoice.ts))
- **Purpose**: Manages invoice generation, PDF download, and settings
- **Key Features**:
  - Invoice creation from Stripe webhooks
  - Invoice PDF generation and download
  - Invoice settings management
  - Invoice statistics
  - Email sending

**Key Functions**:
- `createInvoiceFromStripe(stripeInvoice, userId, organizationId)` - Create invoice from Stripe webhook
- `getInvoice(invoiceId)` - Get invoice by ID
- `getOrganizationInvoices(organizationId, limit, offset)` - Get organization invoices
- `getInvoiceItems(invoiceId)` - Get invoice line items
- `getInvoiceWithItems(invoiceId)` - Get invoice with items
- `downloadInvoicePDF(invoiceId)` - Download invoice PDF
- `getInvoiceSettings(organizationId)` - Get invoice settings
- `updateInvoiceSettings(organizationId, updates)` - Update invoice settings
- `getInvoiceStatistics(organizationId, startDate, endDate)` - Get invoice statistics
- `voidInvoice(invoiceId)` - Void invoice
- `retryInvoicePayment(invoiceId)` - Retry invoice payment
- `sendInvoiceEmail(invoiceId)` - Send invoice email

#### 3. Payment Service ([`backend/src/services/payment.ts`](backend/src/services/payment.ts))
- **Purpose**: Manages payment methods and payment processing
- **Key Features**:
  - Payment method management (cards, bank accounts)
  - Payment intent creation and confirmation
  - Payment tracking and statistics
  - Default payment method management

**Key Functions**:
- `createPaymentMethod(userId, organizationId, paymentMethodId)` - Add payment method
- `getUserPaymentMethods(userId)` - Get user's payment methods
- `getOrganizationPaymentMethods(organizationId)` - Get organization's payment methods
- `setDefaultPaymentMethod(userId, paymentMethodId)` - Set default payment method
- `deletePaymentMethod(userId, paymentMethodId)` - Delete payment method
- `createPaymentIntent(userId, organizationId, invoiceId, amount, currency)` - Create payment intent
- `confirmPaymentIntent(paymentIntentId)` - Confirm payment intent
- `getPayment(paymentId)` - Get payment by ID
- `getUserPayments(userId, limit, offset)` - Get user's payments
- `getOrganizationPayments(organizationId, limit, offset)` - Get organization's payments
- `getPaymentStatistics(organizationId, startDate, endDate)` - Get payment statistics
- `handlePaymentWebhookEvent(event)` - Handle Stripe payment webhooks

### Routes

#### Billing Routes ([`backend/src/routes/billing.ts`](backend/src/routes/billing.ts))
- **Purpose**: HTTP endpoints for billing operations
- **Endpoints**:
  - `GET /api/billing/plans` - Get all billing plans
  - `GET /api/billing/plans/:id` - Get billing plan by ID
  - `POST /api/billing/subscriptions` - Create new subscription
  - `GET /api/billing/subscriptions` - Get current user's subscription
  - `GET /api/billing/subscriptions/organization/:organizationId` - Get organization's subscription
  - `PUT /api/billing/subscriptions/:id` - Update subscription plan
  - `POST /api/billing/subscriptions/:id/cancel` - Cancel subscription
  - `POST /api/billing/subscriptions/:id/resume` - Resume canceled subscription
  - `GET /api/billing/usage` - Get usage summary for current user
  - `GET /api/billing/usage/organization/:organizationId` - Get usage summary for organization
  - `GET /api/billing/summary` - Get billing summary
  - `GET /api/billing/alerts` - Get billing alerts
  - `PUT /api/billing/alerts/:id/read` - Mark alert as read
  - `POST /api/billing/webhook` - Handle Stripe webhook events
  - `GET /api/billing/invoices` - Get invoices for current user
  - `GET /api/billing/invoices/:id` - Get invoice by ID
  - `GET /api/billing/invoices/:id/items` - Get invoice items
  - `GET /api/billing/invoices/:id/pdf` - Download invoice PDF
  - `POST /api/billing/invoices/:id/send` - Send invoice email
  - `GET /api/billing/invoices/statistics` - Get invoice statistics
  - `GET /api/billing/invoices/settings` - Get invoice settings
  - `PUT /api/billing/invoices/settings` - Update invoice settings
  - `GET /api/billing/payments` - Get payments for current user
  - `GET /api/billing/payments/:id` - Get payment by ID
  - `GET /api/billing/payments/statistics` - Get payment statistics
  - `GET /api/billing/payment-methods` - Get payment methods for current user
  - `POST /api/billing/payment-methods` - Add new payment method
  - `PUT /api/billing/payment-methods/:id/default` - Set default payment method
  - `DELETE /api/billing/payment-methods/:id` - Delete payment method

### Database Schema

#### Billing Plans Table
```sql
CREATE TABLE billing_plans (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  stripe_price_id VARCHAR(255) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  interval VARCHAR(10) NOT NULL CHECK (interval IN ('month', 'year')),
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  api_calls_limit INTEGER NOT NULL,
  storage_limit INTEGER NOT NULL,
  team_members_limit INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES billing_plans(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'unpaid', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### Invoices Table
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  stripe_invoice_id VARCHAR(255) NOT NULL,
  invoice_number VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
  amount INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### Invoice Items Table
```sql
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### Invoice Settings Table
```sql
CREATE TABLE invoice_settings (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_prefix VARCHAR(10) NOT NULL DEFAULT 'INV-',
  invoice_number INTEGER NOT NULL DEFAULT 1,
  default_payment_terms INTEGER NOT NULL DEFAULT 30,
  tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
  tax_id VARCHAR(50),
  company_name VARCHAR(255),
  company_address TEXT,
  company_email VARCHAR(255),
  company_phone VARCHAR(50),
  logo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### Payment Methods Table
```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  stripe_payment_method_id VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('card', 'bank_account')),
  is_default BOOLEAN NOT NULL DEFAULT false,
  card_last4 VARCHAR(4),
  card_brand VARCHAR(20),
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  bank_name VARCHAR(255),
  bank_last4 VARCHAR(4),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
  payment_method_type VARCHAR(50),
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### Usage Records Table
```sql
CREATE TABLE usage_records (
  id UUID PRIMARY KEY,
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  metric VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### Billing Alerts Table
```sql
CREATE TABLE billing_alerts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('usage_threshold', 'payment_failed', 'subscription_expiring', 'budget_exceeded')),
  severity VARCHAR(10) NOT NULL CHECK (severity IN ('info', 'warning', 'error')),
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### Frontend Components

#### Billing Dashboard Page ([`src/pages/enterprise/BillingDashboard.tsx`](src/pages/enterprise/BillingDashboard.tsx))
- **Purpose**: UI for billing overview and subscription management
- **Features**:
  - Current subscription display
  - Billing plan comparison
  - Usage summary with visual charts
  - Payment history
  - Invoice management
  - Payment method management
  - Billing alerts
  - Plan upgrade/downgrade

#### Invoices Management Page ([`src/pages/enterprise/InvoicesManagement.tsx`](src/pages/enterprise/InvoicesManagement.tsx))
- **Purpose**: UI for invoice management
- **Features**:
  - Invoice list with status indicators
  - Invoice detail view
  - PDF download
  - Email invoice
  - Invoice settings management
  - Invoice statistics

#### Payment Methods Page ([`src/pages/enterprise/PaymentMethods.tsx`](src/pages/enterprise/PaymentMethods.tsx))
- **Purpose**: UI for payment method management
- **Features**:
  - Payment method list (cards, bank accounts)
  - Add new payment method
  - Set default payment method
  - Delete payment method
  - Card details display
  - Bank account details display

## Integration Guide

### Backend Integration

1. **Install Stripe SDK**:
```bash
npm install stripe
```

2. **Set Environment Variables**:
```bash
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

3. **Register Billing Routes**:
```typescript
import billingRouter from './routes/billing';
app.use('/api/billing', billingRouter);
```

4. **Run Database Migration**:
```bash
psql -U your_user -d your_database -f database/migrations/add_billing_tables.sql
```

5. **Configure Stripe Webhook**:
- Set up webhook endpoint at `https://your-domain.com/api/billing/webhook`
- Configure webhook events: `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

### Frontend Integration

1. **Add Navigation Links**:
```typescript
// In Navigation.tsx
{user?.role === 'admin' && (
  <>
    <Link to="/enterprise/billing">Billing</Link>
    <Link to="/enterprise/invoices">Invoices</Link>
    <Link to="/enterprise/payment-methods">Payment Methods</Link>
  </>
)}
```

2. **Add Route Configuration**:
```typescript
// In App.tsx
<Route path="/enterprise/billing" element={<BillingDashboard />} />
<Route path="/enterprise/invoices" element={<InvoicesManagement />} />
<Route path="/enterprise/payment-methods" element={<PaymentMethods />} />
```

## Security Considerations

### Stripe Security
- API keys stored in environment variables
- Webhook signature verification
- PCI DSS compliance through Stripe
- No raw card data stored (only Stripe tokens)
- TLS 1.3 for all Stripe API calls

### Data Privacy
- Customer data encrypted at rest
- Payment method tokens only stored
- Invoice data access restricted to organization
- Usage data aggregated for privacy
- Audit logging for all billing operations

### Payment Security
- 3D Secure authentication (SCA) for card payments
- CVV verification for card payments
- Address verification for bank accounts
- Payment intent confirmation before charging
- Automatic retry for failed payments

## Performance Considerations

### Database Optimization
- Indexes on frequently queried columns
- Partitioning for large tables (invoices, payments)
- Connection pooling for high-volume transactions
- Read replicas for analytics queries

### Caching
- Stripe customer data caching
- Billing plans caching (TTL: 1 hour)
- Usage summary caching (TTL: 5 minutes)
- Invoice PDF caching (TTL: 24 hours)

### Scalability
- Stripe handles high-volume transactions
- Webhook processing is asynchronous
- Payment intents for idempotency
- Rate limiting on public endpoints

## Monitoring and Alerting

### Key Metrics to Monitor
- Subscription creation rate
- Payment success rate
- Invoice generation rate
- Payment failure rate
- Webhook processing time
- API response times

### Alert Thresholds
- Payment failure rate > 5%
- Webhook processing time > 5 seconds
- Invoice generation failure rate > 1%
- Subscription churn rate > 10%

### Logging
- All billing operations logged
- Stripe API calls logged
- Webhook events logged
- Error tracking with stack traces

## Testing

### Unit Tests
- Billing service functions
- Invoice service functions
- Payment service functions
- Webhook event handling

### Integration Tests
- Stripe webhook processing
- Payment intent lifecycle
- Subscription lifecycle
- Invoice generation and delivery

### Load Tests
- Concurrent subscription creation
- High-volume payment processing
- Webhook handling under load
- Database query performance

## Next Steps (Phase 7: Enterprise Security & Compliance)

Phase 7 will focus on:
1. **Security Audit Logs** - Comprehensive security event tracking
2. **Compliance Reporting** - GDPR, SOC2, HIPAA compliance reports
3. **Data Retention Policies** - Configurable data retention and deletion
4. **Security Incident Management** - Track and respond to security incidents
5. **Vulnerability Scanning** - Automated security scanning
6. **Penetration Testing Tools** - Built-in security testing tools
7. **Security Score Dashboard** - Visual security health metrics

## Conclusion

Phase 6 provides a complete enterprise-grade billing and subscription solution with:
- Stripe integration for payment processing
- Complete subscription lifecycle management
- Invoice generation and management
- Payment method management
- Usage tracking and alerts
- Comprehensive billing analytics
- Production-ready security and performance

This foundation enables organizations to monetize their platform while maintaining control over billing, usage, and costs.

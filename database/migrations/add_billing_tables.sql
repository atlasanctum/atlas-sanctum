-- Billing & Subscriptions Tables Migration
-- This migration adds tables for billing, subscriptions, invoices, and payments

-- Billing Plans Table
CREATE TABLE IF NOT EXISTS billing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Indexes for Billing Plans
CREATE INDEX IF NOT EXISTS idx_billing_plans_is_active ON billing_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_billing_plans_amount ON billing_plans(amount);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Indexes for Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Indexes for Invoices
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_organization_id ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription_id ON invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

-- Invoice Items Table
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for Invoice Items
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Invoice Settings Table
CREATE TABLE IF NOT EXISTS invoice_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Indexes for Invoice Settings
CREATE INDEX IF NOT EXISTS idx_invoice_settings_organization_id ON invoice_settings(organization_id);

-- Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Indexes for Payment Methods
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_organization_id ON payment_methods(organization_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(is_default);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Indexes for Payments
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_organization_id ON payments(organization_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);

-- Usage Records Table
CREATE TABLE IF NOT EXISTS usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  metric VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for Usage Records
CREATE INDEX IF NOT EXISTS idx_usage_records_subscription_id ON usage_records(subscription_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_user_id ON usage_records(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_organization_id ON usage_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_metric ON usage_records(metric);
CREATE INDEX IF NOT EXISTS idx_usage_records_period_start ON usage_records(period_start);
CREATE INDEX IF NOT EXISTS idx_usage_records_period_end ON usage_records(period_end);

-- Billing Alerts Table
CREATE TABLE IF NOT EXISTS billing_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('usage_threshold', 'payment_failed', 'subscription_expiring', 'budget_exceeded')),
  severity VARCHAR(10) NOT NULL CHECK (severity IN ('info', 'warning', 'error')),
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for Billing Alerts
CREATE INDEX IF NOT EXISTS idx_billing_alerts_user_id ON billing_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_alerts_organization_id ON billing_alerts(organization_id);
CREATE INDEX IF NOT EXISTS idx_billing_alerts_is_read ON billing_alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_billing_alerts_type ON billing_alerts(type);
CREATE INDEX IF NOT EXISTS idx_billing_alerts_severity ON billing_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_billing_alerts_created_at ON billing_alerts(created_at);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_billing_plans_updated_at
  BEFORE UPDATE ON billing_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_settings_updated_at
  BEFORE UPDATE ON invoice_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE billing_plans IS 'Stores subscription pricing plans';
COMMENT ON TABLE subscriptions IS 'Stores user subscriptions';
COMMENT ON TABLE invoices IS 'Stores billing invoices';
COMMENT ON TABLE invoice_items IS 'Stores line items for invoices';
COMMENT ON TABLE invoice_settings IS 'Stores organization invoice settings';
COMMENT ON TABLE payment_methods IS 'Stores payment methods for users';
COMMENT ON TABLE payments IS 'Stores payment transactions';
COMMENT ON TABLE usage_records IS 'Stores usage metrics for billing';
COMMENT ON TABLE billing_alerts IS 'Stores billing alerts and notifications';

COMMENT ON COLUMN billing_plans.stripe_price_id IS 'Stripe price ID for the plan';
COMMENT ON COLUMN subscriptions.stripe_subscription_id IS 'Stripe subscription ID';
COMMENT ON COLUMN subscriptions.cancel_at_period_end IS 'Whether subscription will cancel at period end';
COMMENT ON COLUMN invoices.stripe_invoice_id IS 'Stripe invoice ID';
COMMENT ON COLUMN invoices.due_date IS 'Invoice due date';
COMMENT ON COLUMN payment_methods.stripe_payment_method_id IS 'Stripe payment method ID';
COMMENT ON COLUMN payments.stripe_payment_intent_id IS 'Stripe payment intent ID';
COMMENT ON COLUMN payments.failure_reason IS 'Reason for payment failure';
COMMENT ON COLUMN usage_records.metric IS 'Usage metric (e.g., api_calls, storage, team_members)';
COMMENT ON COLUMN billing_alerts.type IS 'Alert type';
COMMENT ON COLUMN billing_alerts.severity IS 'Alert severity level';

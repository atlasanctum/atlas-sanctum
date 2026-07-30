
-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id text NOT NULL,
  plan_name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  billing_period text NOT NULL DEFAULT 'monthly',
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  canceled_at timestamptz,
  payment_method text,
  payment_reference text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON public.subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON public.subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  transaction_id uuid,
  invoice_number text NOT NULL UNIQUE,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'paid',
  billing_name text,
  billing_email text,
  billing_address text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  payment_method text,
  payment_reference text,
  issued_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own invoices"
  ON public.invoices FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices"
  ON public.invoices FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON public.invoices(invoice_number);

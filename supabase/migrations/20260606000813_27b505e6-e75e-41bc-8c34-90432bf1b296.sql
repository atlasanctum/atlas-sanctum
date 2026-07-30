
CREATE TABLE IF NOT EXISTS public.newsletter_subscription_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  ip_address TEXT,
  succeeded BOOLEAN NOT NULL DEFAULT false,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_attempts_email_time
  ON public.newsletter_subscription_attempts (email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_attempts_ip_time
  ON public.newsletter_subscription_attempts (ip_address, created_at DESC);

-- Only the service role (edge functions) may read or write this table.
GRANT ALL ON public.newsletter_subscription_attempts TO service_role;

ALTER TABLE public.newsletter_subscription_attempts ENABLE ROW LEVEL SECURITY;

-- Deny everyone by default (no policies for anon/authenticated).
CREATE POLICY "service role manages newsletter attempts"
  ON public.newsletter_subscription_attempts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Server-side cooldown check. Returns true if the caller is allowed.
CREATE OR REPLACE FUNCTION public.check_newsletter_rate_limit(
  _email TEXT,
  _ip TEXT,
  _window_seconds INT DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count INT;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.newsletter_subscription_attempts
  WHERE created_at > now() - make_interval(secs => _window_seconds)
    AND (
      (_email IS NOT NULL AND email = lower(_email))
      OR (_ip IS NOT NULL AND ip_address = _ip)
    );
  RETURN recent_count = 0;
END;
$$;

REVOKE ALL ON FUNCTION public.check_newsletter_rate_limit(TEXT, TEXT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_newsletter_rate_limit(TEXT, TEXT, INT) TO service_role;

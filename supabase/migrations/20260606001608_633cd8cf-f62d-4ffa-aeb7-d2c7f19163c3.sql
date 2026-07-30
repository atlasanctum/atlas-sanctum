-- Atomic, idempotent newsletter cooldown: insert-or-reject in a single statement.
-- Combines email + IP. If any matching attempt exists within the window, returns false
-- without inserting. Otherwise inserts a pending row and returns true. This eliminates
-- the read-then-write race that allowed parallel requests to slip through.
CREATE OR REPLACE FUNCTION public.claim_newsletter_slot(
  _email text,
  _ip text,
  _window_seconds integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted_id uuid;
BEGIN
  INSERT INTO public.newsletter_subscription_attempts (email, ip_address, succeeded, reason)
  SELECT lower(_email), _ip, NULL, 'claim'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.newsletter_subscription_attempts
    WHERE created_at > now() - make_interval(secs => _window_seconds)
      AND (
        (_email IS NOT NULL AND email = lower(_email))
        OR (_ip IS NOT NULL AND ip_address = _ip)
      )
    FOR UPDATE SKIP LOCKED
  )
  RETURNING id INTO inserted_id;

  RETURN inserted_id IS NOT NULL;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_newsletter_slot(text, text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_newsletter_slot(text, text, integer) TO service_role;

-- Allow newsletter_subscription_attempts column to permit NULL succeeded for "claim" rows
ALTER TABLE public.newsletter_subscription_attempts
  ALTER COLUMN succeeded DROP NOT NULL;

-- Admin read access for the new dashboard. Service role already has full access.
DROP POLICY IF EXISTS "Admins can view newsletter attempts" ON public.newsletter_subscription_attempts;
CREATE POLICY "Admins can view newsletter attempts"
  ON public.newsletter_subscription_attempts
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.newsletter_subscription_attempts TO authenticated;
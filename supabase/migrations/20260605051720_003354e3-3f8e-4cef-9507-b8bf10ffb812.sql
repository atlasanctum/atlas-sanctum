DROP POLICY IF EXISTS "Users can view their own newsletter subscription" ON public.newsletter_subscriptions;
CREATE POLICY "Users can view their own newsletter subscription"
ON public.newsletter_subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
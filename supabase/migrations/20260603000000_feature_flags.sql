-- Feature flags table used by backend runtime flag system
CREATE TABLE IF NOT EXISTS public.feature_flags (
  key TEXT PRIMARY KEY,
  value BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON public.feature_flags(key);

-- Only admins can modify flags; anyone can read
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage feature flags"
ON public.feature_flags
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "All authenticated users can read feature flags"
ON public.feature_flags
FOR SELECT
TO authenticated
USING (true);

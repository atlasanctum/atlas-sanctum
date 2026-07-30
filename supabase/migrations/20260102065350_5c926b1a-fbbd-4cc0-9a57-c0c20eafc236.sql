-- Create price_alerts table for real-time price monitoring
CREATE TABLE public.price_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID NOT NULL REFERENCES public.carbon_projects(id) ON DELETE CASCADE,
  target_price DECIMAL(10, 2) NOT NULL,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('above', 'below')),
  triggered BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for price_alerts
CREATE POLICY "Users can view their own price alerts" 
  ON public.price_alerts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own price alerts" 
  ON public.price_alerts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own price alerts" 
  ON public.price_alerts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own price alerts" 
  ON public.price_alerts FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_price_alerts_updated_at
  BEFORE UPDATE ON public.price_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create user_tour_progress table for onboarding tour
CREATE TABLE public.user_tour_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  completed_steps TEXT[] DEFAULT '{}',
  tour_completed BOOLEAN DEFAULT FALSE,
  tour_skipped BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_tour_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_tour_progress
CREATE POLICY "Users can view their own tour progress" 
  ON public.user_tour_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tour progress" 
  ON public.user_tour_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tour progress" 
  ON public.user_tour_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_tour_progress_updated_at
  BEFORE UPDATE ON public.user_tour_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
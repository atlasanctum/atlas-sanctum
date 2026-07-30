-- Create user_preferences table for storing onboarding choices and settings
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  organization_type TEXT,
  investment_goals TEXT[],
  project_interests TEXT[],
  monthly_budget TEXT,
  email_notifications BOOLEAN DEFAULT true,
  transaction_alerts BOOLEAN DEFAULT true,
  impact_updates BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  newsletter_subscribed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create bioregional_zones table
CREATE TABLE public.bioregional_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL,
  country TEXT NOT NULL,
  coordinates JSONB,
  climate_type TEXT,
  biodiversity_index NUMERIC,
  carbon_sequestration_rate NUMERIC,
  risk_level TEXT DEFAULT 'low',
  active_projects INTEGER DEFAULT 0,
  total_area_hectares NUMERIC,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bioregional_zones ENABLE ROW LEVEL SECURITY;

-- Anyone can view bioregional zones (public data)
CREATE POLICY "Anyone can view bioregional zones" 
ON public.bioregional_zones 
FOR SELECT 
USING (true);

-- Admins can manage bioregional zones
CREATE POLICY "Admins can manage bioregional zones" 
ON public.bioregional_zones 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_bioregional_zones_updated_at
BEFORE UPDATE ON public.bioregional_zones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create measurement_data table
CREATE TABLE public.measurement_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.carbon_projects(id) ON DELETE CASCADE,
  zone_id UUID REFERENCES public.bioregional_zones(id) ON DELETE SET NULL,
  measurement_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  source TEXT,
  confidence_level NUMERIC,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID,
  metadata JSONB,
  measured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.measurement_data ENABLE ROW LEVEL SECURITY;

-- Anyone can view measurement data (public data)
CREATE POLICY "Anyone can view measurement data" 
ON public.measurement_data 
FOR SELECT 
USING (true);

-- Admins and partners can insert measurement data
CREATE POLICY "Admins can manage measurement data" 
ON public.measurement_data 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'partner'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'partner'::app_role));

-- Create regenerative_metrics table
CREATE TABLE public.regenerative_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.carbon_projects(id) ON DELETE CASCADE,
  zone_id UUID REFERENCES public.bioregional_zones(id) ON DELETE SET NULL,
  metric_name TEXT NOT NULL,
  metric_category TEXT NOT NULL,
  current_value NUMERIC NOT NULL,
  baseline_value NUMERIC,
  target_value NUMERIC,
  unit TEXT NOT NULL,
  trend TEXT DEFAULT 'stable',
  improvement_percentage NUMERIC,
  last_measured_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.regenerative_metrics ENABLE ROW LEVEL SECURITY;

-- Anyone can view regenerative metrics (public data)
CREATE POLICY "Anyone can view regenerative metrics" 
ON public.regenerative_metrics 
FOR SELECT 
USING (true);

-- Admins can manage regenerative metrics
CREATE POLICY "Admins can manage regenerative metrics" 
ON public.regenerative_metrics 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_regenerative_metrics_updated_at
BEFORE UPDATE ON public.regenerative_metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create newsletter_subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  user_id UUID,
  subscribed BOOLEAN DEFAULT true,
  subscription_type TEXT DEFAULT 'general',
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert newsletter subscriptions (public signup)
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscriptions 
FOR INSERT 
WITH CHECK (true);

-- Users can view their own subscription
CREATE POLICY "Users can view their own newsletter subscription" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own subscription
CREATE POLICY "Users can update their own newsletter subscription" 
ON public.newsletter_subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Insert seed data for bioregional zones
INSERT INTO public.bioregional_zones (name, code, region, country, climate_type, biodiversity_index, carbon_sequestration_rate, risk_level, active_projects, total_area_hectares, description) VALUES
('Amazon Basin', 'AMZ-001', 'South America', 'Brazil', 'Tropical Rainforest', 0.95, 12.5, 'medium', 15, 5500000, 'The worlds largest tropical rainforest, critical for global carbon sequestration'),
('Congo Rainforest', 'CON-001', 'Central Africa', 'Democratic Republic of Congo', 'Tropical Rainforest', 0.92, 11.2, 'high', 8, 2000000, 'Second largest tropical rainforest, home to endangered species'),
('Borneo Highlands', 'BOR-001', 'Southeast Asia', 'Indonesia', 'Tropical Rainforest', 0.88, 9.8, 'high', 12, 743330, 'Ancient rainforest with high biodiversity'),
('Great Barrier Reef Coast', 'GBR-001', 'Oceania', 'Australia', 'Marine Tropical', 0.85, 4.2, 'critical', 6, 348000, 'Marine ecosystem with mangrove restoration projects'),
('Pacific Northwest', 'PNW-001', 'North America', 'United States', 'Temperate Rainforest', 0.78, 8.5, 'low', 22, 1200000, 'Old-growth temperate rainforest region'),
('Scandinavian Taiga', 'SCN-001', 'Northern Europe', 'Sweden', 'Boreal Forest', 0.65, 6.3, 'low', 18, 2800000, 'Sustainable forestry and peatland restoration');

-- Insert seed data for regenerative metrics
INSERT INTO public.regenerative_metrics (metric_name, metric_category, current_value, baseline_value, target_value, unit, trend, improvement_percentage) VALUES
('Carbon Sequestration Rate', 'Carbon', 12.5, 8.2, 15.0, 'tonnes CO2/ha/year', 'increasing', 52.4),
('Biodiversity Index', 'Biodiversity', 0.78, 0.65, 0.90, 'index', 'increasing', 20.0),
('Soil Health Score', 'Soil', 72, 55, 85, 'score', 'increasing', 30.9),
('Water Quality Index', 'Water', 85, 72, 95, 'index', 'stable', 18.1),
('Forest Cover', 'Land Use', 68, 52, 80, 'percentage', 'increasing', 30.8),
('Species Richness', 'Biodiversity', 245, 180, 300, 'count', 'increasing', 36.1);
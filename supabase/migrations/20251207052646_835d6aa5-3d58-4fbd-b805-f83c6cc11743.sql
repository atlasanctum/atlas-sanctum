-- Create carbon credit project types enum
CREATE TYPE public.project_type AS ENUM ('reforestation', 'renewable_energy', 'methane_capture', 'ocean_restoration', 'soil_carbon', 'direct_air_capture');
CREATE TYPE public.project_status AS ENUM ('active', 'pending', 'completed', 'suspended');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Carbon credit projects table
CREATE TABLE public.carbon_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  country TEXT NOT NULL,
  project_type project_type NOT NULL,
  status project_status NOT NULL DEFAULT 'active',
  price_per_credit DECIMAL(10, 2) NOT NULL,
  total_credits INTEGER NOT NULL,
  available_credits INTEGER NOT NULL,
  vintage_year INTEGER NOT NULL,
  certification TEXT NOT NULL,
  methodology TEXT,
  co2_offset_per_credit DECIMAL(10, 2) NOT NULL DEFAULT 1.0,
  image_url TEXT,
  developer_name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User holdings/portfolio
CREATE TABLE public.credit_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.carbon_projects(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  purchase_price DECIMAL(10, 2) NOT NULL,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  retired BOOLEAN NOT NULL DEFAULT false,
  retired_at TIMESTAMPTZ,
  certificate_id TEXT,
  UNIQUE(user_id, project_id, purchased_at)
);

-- Transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.carbon_projects(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price_per_credit DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  transaction_type TEXT NOT NULL DEFAULT 'purchase',
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.carbon_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Carbon projects policies (public read, admin write)
CREATE POLICY "Anyone can view active projects"
ON public.carbon_projects FOR SELECT
USING (status = 'active');

CREATE POLICY "Admins can manage projects"
ON public.carbon_projects FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Credit holdings policies
CREATE POLICY "Users can view their own holdings"
ON public.credit_holdings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own holdings"
ON public.credit_holdings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own holdings"
ON public.credit_holdings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Transaction policies
CREATE POLICY "Users can view their own transactions"
ON public.transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
ON public.transactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_carbon_projects_updated_at
BEFORE UPDATE ON public.carbon_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample projects
INSERT INTO public.carbon_projects (title, description, location, country, project_type, price_per_credit, total_credits, available_credits, vintage_year, certification, methodology, developer_name, image_url) VALUES
('Amazon Rainforest Protection', 'Protecting 50,000 hectares of pristine Amazon rainforest from deforestation through community partnerships and sustainable development initiatives.', 'Amazonas Region', 'Brazil', 'reforestation', 24.50, 100000, 87500, 2024, 'Verra VCS', 'VM0015', 'EcoGuard International', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800'),
('Kenyan Wind Farm', 'Large-scale wind energy project replacing coal-fired power plants in rural Kenya, providing clean electricity to 100,000 homes.', 'Turkana County', 'Kenya', 'renewable_energy', 18.75, 75000, 62000, 2024, 'Gold Standard', 'AMS-I.D', 'African Renewables Ltd', 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800'),
('Indonesian Peatland Restoration', 'Rewetting and restoring degraded peatlands to prevent carbon release and restore critical ecosystem services.', 'Central Kalimantan', 'Indonesia', 'soil_carbon', 32.00, 50000, 45000, 2024, 'Verra VCS', 'VM0007', 'Peatland Guardians', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'),
('Pacific Kelp Forest Initiative', 'Cultivating massive kelp forests off the California coast to sequester carbon and restore marine biodiversity.', 'Monterey Bay', 'USA', 'ocean_restoration', 45.00, 25000, 23500, 2024, 'Verra VCS', 'Pending', 'Blue Carbon Alliance', 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800'),
('Landfill Methane Capture', 'Capturing and converting methane emissions from major landfills into clean energy, preventing potent greenhouse gas release.', 'São Paulo', 'Brazil', 'methane_capture', 15.50, 150000, 128000, 2024, 'CDM', 'AMS-III.G', 'MethaGreen Solutions', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800'),
('Iceland Direct Air Capture', 'Pioneering direct air capture facility using geothermal energy to permanently remove CO2 from the atmosphere.', 'Hellisheiði', 'Iceland', 'direct_air_capture', 125.00, 10000, 9200, 2024, 'Puro.earth', 'DAC Standard', 'CarbonVault Tech', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800');
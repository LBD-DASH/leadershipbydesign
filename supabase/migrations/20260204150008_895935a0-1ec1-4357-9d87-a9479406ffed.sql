-- Create prospecting_config table for industry targeting
CREATE TABLE public.prospecting_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  industry TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Gauteng',
  company_size TEXT NOT NULL DEFAULT '50-500',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prospecting_runs table for tracking automated runs
CREATE TABLE public.prospecting_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'running',
  companies_discovered INTEGER NOT NULL DEFAULT 0,
  companies_researched INTEGER NOT NULL DEFAULT 0,
  companies_saved INTEGER NOT NULL DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  run_details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.prospecting_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospecting_runs ENABLE ROW LEVEL SECURITY;

-- RLS policies for prospecting_config (admin only)
CREATE POLICY "Admins can view prospecting config"
  ON public.prospecting_config
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
  ));

CREATE POLICY "Admins can insert prospecting config"
  ON public.prospecting_config
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
  ));

CREATE POLICY "Admins can update prospecting config"
  ON public.prospecting_config
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
  ));

CREATE POLICY "Admins can delete prospecting config"
  ON public.prospecting_config
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
  ));

-- RLS policies for prospecting_runs (admin only)
CREATE POLICY "Admins can view prospecting runs"
  ON public.prospecting_runs
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
  ));

CREATE POLICY "Admins can insert prospecting runs"
  ON public.prospecting_runs
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
  ));

CREATE POLICY "Admins can update prospecting runs"
  ON public.prospecting_runs
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
  ));

-- Add trigger for updated_at on prospecting_config
CREATE TRIGGER update_prospecting_config_updated_at
  BEFORE UPDATE ON public.prospecting_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default industries
INSERT INTO public.prospecting_config (industry, location, company_size, is_active) VALUES
  ('Financial Services', 'Gauteng', '50-500', true),
  ('Technology', 'Gauteng', '50-500', true),
  ('Manufacturing', 'Gauteng', '50-500', true),
  ('Professional Services', 'Gauteng', '50-500', true),
  ('Healthcare', 'Gauteng', '50-500', true);
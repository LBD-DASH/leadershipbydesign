-- Allow anyone to view prospecting config (for dashboard display)
CREATE POLICY "Anyone can view prospecting config" 
ON public.prospecting_config 
FOR SELECT 
USING (true);

-- Allow anyone to view prospecting runs (for dashboard display)
CREATE POLICY "Anyone can view prospecting runs" 
ON public.prospecting_runs 
FOR SELECT 
USING (true);

-- Allow anyone to view prospect companies (for dashboard display)
-- Note: existing policy only allows authenticated users
CREATE POLICY "Anyone can view prospects for dashboard" 
ON public.prospect_companies 
FOR SELECT 
USING (true);
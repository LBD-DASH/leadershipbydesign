-- Add hr_contacts column to store HR/L&D decision makers with LinkedIn search URLs
ALTER TABLE public.prospect_companies 
ADD COLUMN hr_contacts jsonb DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.prospect_companies.hr_contacts IS 'Array of HR/L&D contacts with name, role, and LinkedIn search URL';
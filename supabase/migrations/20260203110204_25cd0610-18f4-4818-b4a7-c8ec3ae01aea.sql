-- Create prospect_companies table for lead prospecting
CREATE TABLE public.prospect_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  company_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  industry TEXT,
  company_size TEXT,
  
  -- Scraped intelligence
  about_summary TEXT,
  leadership_team JSONB,
  pain_points JSONB,
  opportunity_signals JSONB,
  
  -- AI-generated outreach
  personalised_pitch TEXT,
  suggested_approach TEXT,
  
  -- Workflow
  status TEXT NOT NULL DEFAULT 'researched',
  contacted_at TIMESTAMPTZ,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.prospect_companies ENABLE ROW LEVEL SECURITY;

-- Create policies - only authenticated users can access
CREATE POLICY "Authenticated users can view prospects"
ON public.prospect_companies
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert prospects"
ON public.prospect_companies
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update prospects"
ON public.prospect_companies
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete prospects"
ON public.prospect_companies
FOR DELETE
USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE TRIGGER update_prospect_companies_updated_at
BEFORE UPDATE ON public.prospect_companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for status filtering
CREATE INDEX idx_prospect_companies_status ON public.prospect_companies(status);

-- Add index for created_at sorting
CREATE INDEX idx_prospect_companies_created_at ON public.prospect_companies(created_at DESC);
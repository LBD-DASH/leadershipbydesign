CREATE TABLE public.needs_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_title TEXT,
  industry TEXT NOT NULL,
  company_size TEXT NOT NULL,
  pain_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  additional_notes TEXT,
  generated_summary TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.needs_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage needs analysis"
  ON public.needs_analysis FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Service role can insert needs analysis"
  ON public.needs_analysis FOR INSERT
  WITH CHECK (true);
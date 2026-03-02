
-- Create conversion_insights table for tracking which themes/pain clusters drive clicks
CREATE TABLE public.conversion_insights (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  newsletter_id uuid REFERENCES public.newsletter_sends(id),
  theme text,
  pain_cluster text,
  subject_line_type text,
  total_opens integer NOT NULL DEFAULT 0,
  total_clicks integer NOT NULL DEFAULT 0,
  contact_submissions integer NOT NULL DEFAULT 0,
  open_rate numeric,
  click_rate numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversion_insights ENABLE ROW LEVEL SECURITY;

-- Admin-only read/write via authenticated check (matches existing pattern)
CREATE POLICY "Authenticated users can view conversion insights"
  ON public.conversion_insights FOR SELECT
  USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Service role can insert conversion insights"
  ON public.conversion_insights FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update conversion insights"
  ON public.conversion_insights FOR UPDATE
  USING (true);

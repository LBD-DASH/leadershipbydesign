-- Create pipeline_deals table for sales pipeline tracking
CREATE TABLE public.pipeline_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_source_table TEXT NOT NULL,
  lead_source_id UUID NOT NULL,
  lead_name TEXT,
  lead_email TEXT,
  lead_company TEXT,
  lead_phone TEXT,
  lead_temperature TEXT,
  lead_score INTEGER,
  stage TEXT NOT NULL DEFAULT 'new_lead',
  deal_value INTEGER,
  notes TEXT,
  assigned_to TEXT,
  contacted_at TIMESTAMPTZ,
  booked_at TIMESTAMPTZ,
  met_at TIMESTAMPTZ,
  proposal_sent_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  close_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pipeline_deals ENABLE ROW LEVEL SECURITY;

-- Authenticated users can manage pipeline deals
CREATE POLICY "Authenticated users can view pipeline deals"
  ON public.pipeline_deals FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert pipeline deals"
  ON public.pipeline_deals FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update pipeline deals"
  ON public.pipeline_deals FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete pipeline deals"
  ON public.pipeline_deals FOR DELETE
  USING (auth.role() = 'authenticated');

-- Service role can also insert (for automated pipeline creation)
CREATE POLICY "Service role can insert pipeline deals"
  ON public.pipeline_deals FOR INSERT
  WITH CHECK (true);

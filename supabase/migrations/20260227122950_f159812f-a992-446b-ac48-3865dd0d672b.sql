
-- Create warm_lead_sequences table for 2-5-10 follow-up cadence
CREATE TABLE public.warm_lead_sequences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_source_table text NOT NULL,
  lead_source_id uuid NOT NULL,
  lead_name text,
  lead_email text,
  lead_company text,
  lead_phone text,
  lead_source_type text,
  lead_score integer,
  lead_temperature text,
  status text NOT NULL DEFAULT 'awaiting_first_contact',
  contacted_at timestamptz,
  next_reminder_at timestamptz,
  engaged_at timestamptz,
  booked_at timestamptz,
  dormant_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.warm_lead_sequences ENABLE ROW LEVEL SECURITY;

-- Public INSERT (edge functions use service role)
CREATE POLICY "Service role can insert sequences"
  ON public.warm_lead_sequences FOR INSERT
  WITH CHECK (true);

-- Authenticated users can view
CREATE POLICY "Authenticated users can view sequences"
  ON public.warm_lead_sequences FOR SELECT
  USING (auth.role() = 'authenticated'::text);

-- Authenticated users can update (for dashboard actions)
CREATE POLICY "Authenticated users can update sequences"
  ON public.warm_lead_sequences FOR UPDATE
  USING (auth.role() = 'authenticated'::text)
  WITH CHECK (auth.role() = 'authenticated'::text);

-- Trigger for updated_at
CREATE TRIGGER update_warm_lead_sequences_updated_at
  BEFORE UPDATE ON public.warm_lead_sequences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for cron job queries
CREATE INDEX idx_warm_lead_sequences_reminder
  ON public.warm_lead_sequences (next_reminder_at)
  WHERE status IN ('contacted', 'day_2_sent', 'day_5_sent', 'day_10_sent');

-- Index for dashboard queries
CREATE INDEX idx_warm_lead_sequences_status
  ON public.warm_lead_sequences (status, created_at DESC);

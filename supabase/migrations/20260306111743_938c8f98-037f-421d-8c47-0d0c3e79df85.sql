-- Create diagnostic_nurture_sequences table for post-diagnostic email sequences
CREATE TABLE public.diagnostic_nurture_sequences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_email TEXT NOT NULL,
  lead_name TEXT,
  diagnostic_type TEXT NOT NULL,
  diagnostic_submission_id UUID,
  primary_result TEXT,
  current_step INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active',
  next_send_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.diagnostic_nurture_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view nurture sequences"
  ON public.diagnostic_nurture_sequences FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can insert nurture sequences"
  ON public.diagnostic_nurture_sequences FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update nurture sequences"
  ON public.diagnostic_nurture_sequences FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Auto-create pipeline deal and nurture sequence when leads come in
-- Trigger function for contact_form_submissions
CREATE OR REPLACE FUNCTION public.auto_create_pipeline_deal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.pipeline_deals (lead_source_table, lead_source_id, lead_name, lead_email, lead_company, lead_phone, lead_temperature, lead_score, stage)
  VALUES (
    TG_TABLE_NAME,
    NEW.id,
    COALESCE(NEW.name, ''),
    NEW.email,
    CASE
      WHEN TG_TABLE_NAME = 'contact_form_submissions' THEN NEW.company
      WHEN TG_TABLE_NAME = 'contagious_identity_interests' THEN NEW.company
      ELSE COALESCE(NEW.organisation, NULL)
    END,
    NEW.phone,
    NEW.lead_temperature,
    NEW.lead_score,
    'new_lead'
  )
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

-- Attach trigger to key tables
CREATE TRIGGER auto_pipeline_contact_form
  AFTER INSERT ON public.contact_form_submissions
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_pipeline_deal();

CREATE TRIGGER auto_pipeline_leadership_diagnostic
  AFTER INSERT ON public.leadership_diagnostic_submissions
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_pipeline_deal();

CREATE TRIGGER auto_pipeline_diagnostic
  AFTER INSERT ON public.diagnostic_submissions
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_pipeline_deal();

CREATE TRIGGER auto_pipeline_shift_diagnostic
  AFTER INSERT ON public.shift_diagnostic_submissions
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_pipeline_deal();

CREATE TRIGGER auto_pipeline_ai_readiness
  AFTER INSERT ON public.ai_readiness_submissions
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_pipeline_deal();

CREATE TRIGGER auto_pipeline_contagious_identity
  AFTER INSERT ON public.contagious_identity_interests
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_pipeline_deal();

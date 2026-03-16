
CREATE TABLE public.apollo_sequence_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_name text NOT NULL DEFAULT 'leader_as_coach_v2',
  step_number integer NOT NULL,
  day_number integer NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  cta_type text NOT NULL DEFAULT 'question',
  note text,
  status text NOT NULL DEFAULT 'Active',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.apollo_sequence_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view sequence templates"
  ON public.apollo_sequence_templates FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sequence templates"
  ON public.apollo_sequence_templates FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sequence templates"
  ON public.apollo_sequence_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete sequence templates"
  ON public.apollo_sequence_templates FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');

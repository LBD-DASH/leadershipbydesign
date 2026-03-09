
CREATE TABLE public.leader_as_coach_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  version text NOT NULL CHECK (version IN ('hr_leader', 'manager')),
  name text,
  email text,
  company text,
  job_title text,
  q1 integer NOT NULL, q2 integer NOT NULL, q3 integer NOT NULL, q4 integer NOT NULL, q5 integer NOT NULL,
  q6 integer NOT NULL, q7 integer NOT NULL, q8 integer NOT NULL, q9 integer NOT NULL, q10 integer NOT NULL,
  q11 integer NOT NULL, q12 integer NOT NULL, q13 integer NOT NULL, q14 integer NOT NULL, q15 integer NOT NULL,
  total_score integer NOT NULL,
  profile text NOT NULL,
  lowest_areas jsonb NOT NULL DEFAULT '[]'::jsonb,
  lead_score integer,
  lead_temperature text,
  buyer_persona text,
  company_size text,
  urgency text,
  ai_analysis text,
  next_action text,
  scoring_breakdown jsonb,
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text
);

ALTER TABLE public.leader_as_coach_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit LAC assessment" ON public.leader_as_coach_assessments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view LAC assessments" ON public.leader_as_coach_assessments
  FOR SELECT TO authenticated USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update LAC assessments" ON public.leader_as_coach_assessments
  FOR UPDATE TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Add trigger to sync leads to email subscribers
CREATE TRIGGER sync_lac_to_subscribers
  AFTER INSERT ON public.leader_as_coach_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_lead_to_subscribers();

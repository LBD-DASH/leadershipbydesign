
CREATE TABLE public.cold_call_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  rep_name TEXT NOT NULL,
  contact_name TEXT,
  company TEXT,
  phone TEXT,
  email TEXT,
  initial_response TEXT NOT NULL,
  pitch_outcome TEXT,
  gatekeeper_outcome TEXT,
  programme_interest TEXT,
  objection_reason TEXT,
  proposed_meeting_date DATE,
  follow_up_date DATE,
  notes TEXT
);

ALTER TABLE public.cold_call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert cold call logs"
ON public.cold_call_logs
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can view cold call logs"
ON public.cold_call_logs
FOR SELECT
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can update cold call logs"
ON public.cold_call_logs
FOR UPDATE
USING (auth.role() = 'authenticated'::text)
WITH CHECK (auth.role() = 'authenticated'::text);

CREATE TABLE IF NOT EXISTS public.diagnostic_email_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  name text,
  company text,
  profile_type text NOT NULL,
  score int NOT NULL,
  sent_at timestamptz DEFAULT now(),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text
);

ALTER TABLE public.diagnostic_email_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.diagnostic_email_results
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can insert diagnostic email results" ON public.diagnostic_email_results
  FOR INSERT WITH CHECK (true);
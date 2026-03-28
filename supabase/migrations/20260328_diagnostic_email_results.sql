CREATE TABLE IF NOT EXISTS diagnostic_email_results (
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

-- Allow the service role to insert
ALTER TABLE diagnostic_email_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON diagnostic_email_results
  FOR ALL USING (auth.role() = 'service_role');

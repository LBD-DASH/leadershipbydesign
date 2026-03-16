
CREATE TABLE public.manual_outreach_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL DEFAULT '',
  linkedin_url text NOT NULL DEFAULT '',
  tier integer NOT NULL DEFAULT 1,
  account_group text NOT NULL DEFAULT '',
  connection_status text NOT NULL DEFAULT 'not_sent',
  message_sent text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.manual_outreach_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view manual outreach leads"
  ON public.manual_outreach_leads FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can update manual outreach leads"
  ON public.manual_outreach_leads FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated'::text)
  WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can insert manual outreach leads"
  ON public.manual_outreach_leads FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can delete manual outreach leads"
  ON public.manual_outreach_leads FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated'::text);

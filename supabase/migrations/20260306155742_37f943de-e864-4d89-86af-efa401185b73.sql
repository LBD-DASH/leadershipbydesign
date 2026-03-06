
-- 1. warm_outreach_queue table
CREATE TABLE public.warm_outreach_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text,
  company_website text,
  contact_name text,
  contact_title text,
  contact_email text,
  contact_phone text,
  contact_linkedin text,
  apollo_person_id text,
  source_keyword text,
  status text NOT NULL DEFAULT 'pending',
  email_sent_at timestamptz,
  follow_up_sent_at timestamptz,
  booked_at timestamptz,
  email_subject text,
  email_body text,
  follow_up_body text,
  scrape_summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.warm_outreach_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert outreach queue" ON public.warm_outreach_queue FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view outreach queue" ON public.warm_outreach_queue FOR SELECT USING (auth.role() = 'authenticated'::text);
CREATE POLICY "Authenticated users can update outreach queue" ON public.warm_outreach_queue FOR UPDATE USING (auth.role() = 'authenticated'::text);

-- 2. bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_email text,
  prospect_name text,
  prospect_company text,
  meeting_datetime timestamptz,
  meeting_type text,
  source_table text,
  source_id uuid,
  confirmation_sent boolean DEFAULT false,
  diagnostic_sent boolean DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view bookings" ON public.bookings FOR SELECT USING (auth.role() = 'authenticated'::text);
CREATE POLICY "Authenticated users can update bookings" ON public.bookings FOR UPDATE USING (auth.role() = 'authenticated'::text);

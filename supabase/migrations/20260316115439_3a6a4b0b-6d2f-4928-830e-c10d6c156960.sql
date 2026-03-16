
CREATE TABLE public.chat_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  organisation text,
  chat_summary text,
  source text DEFAULT 'chat_agent',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.chat_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert chat leads" ON public.chat_leads
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Authenticated users can view chat leads" ON public.chat_leads
  FOR SELECT TO authenticated USING (true);

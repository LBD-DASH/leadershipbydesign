
CREATE TABLE public.linkedin_post_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_date date NOT NULL,
  content_preview text NOT NULL,
  full_content text,
  status text NOT NULL DEFAULT 'queued',
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.linkedin_post_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage linkedin posts" ON public.linkedin_post_schedule FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Service role can insert linkedin posts" ON public.linkedin_post_schedule FOR INSERT TO public WITH CHECK (true);

CREATE TABLE public.outstanding_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item text NOT NULL,
  priority text NOT NULL DEFAULT 'medium',
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.outstanding_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage outstanding items" ON public.outstanding_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Service role can insert outstanding items" ON public.outstanding_items FOR INSERT TO public WITH CHECK (true);

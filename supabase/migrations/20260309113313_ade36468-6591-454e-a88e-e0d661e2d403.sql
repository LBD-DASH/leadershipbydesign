
CREATE TABLE public.active_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  emoji text DEFAULT '🟡',
  priority integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'not_started',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.active_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active projects" ON public.active_projects FOR SELECT TO public USING (true);
CREATE POLICY "Service role can manage active projects" ON public.active_projects FOR ALL TO public USING (true) WITH CHECK (true);

INSERT INTO public.active_projects (title, emoji, priority, status, notes) VALUES
  ('Leader as Coach Sales Page', '🔴', 1, 'done', 'BUILT ✅'),
  ('Pipeline Lead Quality — Monitor Firecrawl yield. Target 5+ quality leads/day', '🔴', 2, 'in_progress', NULL),
  ('Google Ads + Tag in Slack — Confirm API credentials in Supabase env vars', '🟡', 3, 'in_progress', NULL),
  ('GA4 Auto-Pull — GTM live (GTM-TV3SFR3G). Connect GA4 to dashboard', '🟡', 4, 'in_progress', NULL),
  ('LAC Diagnostic → Outreach Alignment — Monitor first completions entering queue', '🟡', 5, 'in_progress', NULL),
  ('Zero Purchases — Sales page live. Monitor checkout conversion', '🟡', 6, 'not_started', NULL),
  ('Admin POS Dashboard — This page', '🟢', 7, 'done', NULL);

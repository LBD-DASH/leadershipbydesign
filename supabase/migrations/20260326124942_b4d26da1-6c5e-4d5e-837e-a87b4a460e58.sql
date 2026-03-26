
CREATE TABLE public.agent_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name text NOT NULL,
  agent_type text NOT NULL,
  status text NOT NULL,
  message text,
  details jsonb,
  items_processed integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_log_name ON agent_activity_log(agent_name, created_at DESC);
CREATE INDEX idx_agent_log_recent ON agent_activity_log(created_at DESC);

CREATE TABLE public.active_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_name text NOT NULL,
  contact_email text,
  company text NOT NULL,
  contact_title text,
  deal_value text,
  status text NOT NULL DEFAULT 'prospect',
  source text,
  notes text,
  next_action text,
  next_action_date timestamptz,
  last_activity_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage agent logs" ON public.agent_activity_log FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage agent logs" ON public.agent_activity_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage deals" ON public.active_deals FOR ALL TO authenticated USING (true) WITH CHECK (true);

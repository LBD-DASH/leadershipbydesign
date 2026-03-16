
CREATE TABLE public.apollo_sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  synced_at timestamp with time zone NOT NULL DEFAULT now(),
  steps_synced integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'success',
  error_message text
);

ALTER TABLE public.apollo_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view sync logs" ON public.apollo_sync_log
  FOR SELECT TO authenticated USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Service role can insert sync logs" ON public.apollo_sync_log
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can insert cold call logs" ON public.cold_call_logs;

CREATE POLICY "Authenticated users can insert cold call logs"
ON public.cold_call_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

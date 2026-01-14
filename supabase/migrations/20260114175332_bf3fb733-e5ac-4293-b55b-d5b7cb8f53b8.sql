-- Ensure API roles have table privileges (RLS still applies)
GRANT INSERT, UPDATE ON TABLE public.diagnostic_submissions TO anon;
GRANT INSERT, UPDATE, SELECT ON TABLE public.diagnostic_submissions TO authenticated;
-- Grant SELECT to anon so they can read their own submission
GRANT SELECT ON TABLE public.diagnostic_submissions TO anon;

-- Add SELECT policy for anon users
CREATE POLICY "Anyone can view diagnostic submissions" 
ON public.diagnostic_submissions 
FOR SELECT 
TO anon
USING (true);
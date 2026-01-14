-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can submit diagnostic" ON public.diagnostic_submissions;
DROP POLICY IF EXISTS "Anyone can update submissions" ON public.diagnostic_submissions;
DROP POLICY IF EXISTS "Authenticated users can view submissions" ON public.diagnostic_submissions;

-- Recreate with explicit anon role for INSERT
CREATE POLICY "Anyone can submit diagnostic" 
ON public.diagnostic_submissions 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update submissions" 
ON public.diagnostic_submissions 
FOR UPDATE 
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions" 
ON public.diagnostic_submissions 
FOR SELECT 
TO authenticated
USING (true);
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can submit diagnostic" ON public.diagnostic_submissions;
DROP POLICY IF EXISTS "Anyone can update their own submission" ON public.diagnostic_submissions;
DROP POLICY IF EXISTS "Authenticated users can view submissions" ON public.diagnostic_submissions;

-- Recreate as permissive policies
CREATE POLICY "Anyone can submit diagnostic" 
ON public.diagnostic_submissions 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can update submissions" 
ON public.diagnostic_submissions 
FOR UPDATE 
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions" 
ON public.diagnostic_submissions 
FOR SELECT 
TO authenticated
USING (true);
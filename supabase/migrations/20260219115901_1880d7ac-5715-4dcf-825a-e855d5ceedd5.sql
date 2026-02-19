
-- Fix 1: diagnostic_submissions - remove public SELECT, keep authenticated only
DROP POLICY IF EXISTS "Anyone can view diagnostic submissions" ON public.diagnostic_submissions;
DROP POLICY IF EXISTS "Authenticated users can view submissions" ON public.diagnostic_submissions;
CREATE POLICY "Authenticated users can view diagnostic submissions" ON public.diagnostic_submissions FOR SELECT USING (auth.role() = 'authenticated'::text);

-- Fix 2: Remove overly permissive UPDATE on diagnostic_submissions
DROP POLICY IF EXISTS "Anyone can update submissions" ON public.diagnostic_submissions;
CREATE POLICY "Authenticated users can update diagnostic submissions" ON public.diagnostic_submissions FOR UPDATE USING (auth.role() = 'authenticated'::text) WITH CHECK (auth.role() = 'authenticated'::text);

-- Fix 3: contact_form_submissions - remove public UPDATE
DROP POLICY IF EXISTS "Anyone can update contact submissions" ON public.contact_form_submissions;

-- Fix 4: prospecting_runs - remove public SELECT
DROP POLICY IF EXISTS "Anyone can view prospecting runs" ON public.prospecting_runs;

-- Fix 5: shift_diagnostic_submissions - tighten SELECT and UPDATE
DROP POLICY IF EXISTS "Anyone can view shift diagnostic submissions" ON public.shift_diagnostic_submissions;
CREATE POLICY "Authenticated users can view shift submissions" ON public.shift_diagnostic_submissions FOR SELECT USING (auth.role() = 'authenticated'::text);
DROP POLICY IF EXISTS "Anyone can update shift submissions" ON public.shift_diagnostic_submissions;
CREATE POLICY "Authenticated users can update shift submissions" ON public.shift_diagnostic_submissions FOR UPDATE USING (auth.role() = 'authenticated'::text) WITH CHECK (auth.role() = 'authenticated'::text);

-- Fix 6: leadership_diagnostic_submissions - tighten SELECT and UPDATE
DROP POLICY IF EXISTS "Anyone can view leadership diagnostic submissions" ON public.leadership_diagnostic_submissions;
CREATE POLICY "Authenticated users can view leadership submissions" ON public.leadership_diagnostic_submissions FOR SELECT USING (auth.role() = 'authenticated'::text);
DROP POLICY IF EXISTS "Anyone can update leadership submissions" ON public.leadership_diagnostic_submissions;
CREATE POLICY "Authenticated users can update leadership submissions" ON public.leadership_diagnostic_submissions FOR UPDATE USING (auth.role() = 'authenticated'::text) WITH CHECK (auth.role() = 'authenticated'::text);

-- Fix 7: ai_readiness_submissions - tighten SELECT and UPDATE
DROP POLICY IF EXISTS "Anyone can view AI readiness submissions" ON public.ai_readiness_submissions;
CREATE POLICY "Authenticated users can view AI readiness submissions" ON public.ai_readiness_submissions FOR SELECT USING (auth.role() = 'authenticated'::text);
DROP POLICY IF EXISTS "Anyone can update AI readiness submissions" ON public.ai_readiness_submissions;
CREATE POLICY "Authenticated users can update AI readiness submissions" ON public.ai_readiness_submissions FOR UPDATE USING (auth.role() = 'authenticated'::text) WITH CHECK (auth.role() = 'authenticated'::text);

-- Fix 8: contagious_identity_interests - tighten UPDATE
DROP POLICY IF EXISTS "Anyone can update coaching interests" ON public.contagious_identity_interests;
CREATE POLICY "Authenticated users can update coaching interests" ON public.contagious_identity_interests FOR UPDATE USING (auth.role() = 'authenticated'::text) WITH CHECK (auth.role() = 'authenticated'::text);

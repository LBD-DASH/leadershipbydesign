CREATE POLICY "Authenticated users can delete leadership submissions"
ON public.leadership_diagnostic_submissions
FOR DELETE
USING (auth.role() = 'authenticated'::text);
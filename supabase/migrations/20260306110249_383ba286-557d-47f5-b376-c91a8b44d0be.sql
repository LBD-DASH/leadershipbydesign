-- Fix: Restrict content_assets write access to authenticated users only
-- Keep public SELECT for marketing content visibility

DROP POLICY IF EXISTS "Allow all insert on content_assets" ON public.content_assets;
DROP POLICY IF EXISTS "Allow all update on content_assets" ON public.content_assets;
DROP POLICY IF EXISTS "Allow all delete on content_assets" ON public.content_assets;

CREATE POLICY "Authenticated users can insert content_assets"
  ON public.content_assets FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update content_assets"
  ON public.content_assets FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete content_assets"
  ON public.content_assets FOR DELETE
  USING (auth.role() = 'authenticated');
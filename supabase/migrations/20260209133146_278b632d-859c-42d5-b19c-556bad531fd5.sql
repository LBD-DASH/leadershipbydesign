
-- Drop all existing restrictive policies on content_assets
DROP POLICY IF EXISTS "Anyone can delete content assets" ON public.content_assets;
DROP POLICY IF EXISTS "Anyone can insert content assets" ON public.content_assets;
DROP POLICY IF EXISTS "Anyone can update content assets" ON public.content_assets;
DROP POLICY IF EXISTS "Anyone can view content assets" ON public.content_assets;
DROP POLICY IF EXISTS "Authenticated users can delete content assets" ON public.content_assets;
DROP POLICY IF EXISTS "Authenticated users can insert content assets" ON public.content_assets;
DROP POLICY IF EXISTS "Authenticated users can update content assets" ON public.content_assets;
DROP POLICY IF EXISTS "Authenticated users can view content assets" ON public.content_assets;

-- Recreate as PERMISSIVE policies (the default)
CREATE POLICY "Allow all select on content_assets"
  ON public.content_assets FOR SELECT
  USING (true);

CREATE POLICY "Allow all insert on content_assets"
  ON public.content_assets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update on content_assets"
  ON public.content_assets FOR UPDATE
  USING (true);

CREATE POLICY "Allow all delete on content_assets"
  ON public.content_assets FOR DELETE
  USING (true);

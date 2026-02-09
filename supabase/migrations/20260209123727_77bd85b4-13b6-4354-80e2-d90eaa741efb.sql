
CREATE POLICY "Anyone can insert content assets" ON public.content_assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view content assets" ON public.content_assets FOR SELECT USING (true);
CREATE POLICY "Anyone can update content assets" ON public.content_assets FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete content assets" ON public.content_assets FOR DELETE USING (true);

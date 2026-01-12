-- Add policies for blog admin operations (currently open, can be restricted later with auth)
CREATE POLICY "Allow insert for blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow update for blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow delete for blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (true);

-- Storage policies for uploading blog images
CREATE POLICY "Anyone can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Anyone can update blog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog-images');

CREATE POLICY "Anyone can delete blog images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'blog-images');
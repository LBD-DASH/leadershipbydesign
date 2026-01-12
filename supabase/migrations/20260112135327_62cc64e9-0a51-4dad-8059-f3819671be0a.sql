-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Allow insert for blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow update for blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow delete for blog posts" ON public.blog_posts;

-- Create new policies requiring authentication
CREATE POLICY "Authenticated users can insert blog posts" 
ON public.blog_posts 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts" 
ON public.blog_posts 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete blog posts" 
ON public.blog_posts 
FOR DELETE 
TO authenticated
USING (true);

-- Also allow authenticated users to view unpublished posts
CREATE POLICY "Authenticated users can view all blog posts" 
ON public.blog_posts 
FOR SELECT 
TO authenticated
USING (true);
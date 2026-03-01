
CREATE TABLE public.newsletter_themes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year integer NOT NULL,
  month integer NOT NULL,
  theme text NOT NULL,
  pain_point_cluster text NOT NULL,
  featured_products text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(year, month)
);

ALTER TABLE public.newsletter_themes ENABLE ROW LEVEL SECURITY;

-- Admin-only read access (edge functions use service role key so no policy needed for them,
-- but add SELECT for admin dashboard visibility)
CREATE POLICY "Admins can view newsletter themes"
  ON public.newsletter_themes FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role));

CREATE POLICY "Admins can manage newsletter themes"
  ON public.newsletter_themes FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role))
  WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role));

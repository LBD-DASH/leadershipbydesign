ALTER TABLE public.newsletter_sends 
ADD COLUMN IF NOT EXISTS rewrite_rounds integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS pain_point_topic text,
ADD COLUMN IF NOT EXISTS service_referenced text,
ADD COLUMN IF NOT EXISTS rewrite_feedback text;
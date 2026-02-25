
-- Add columns to newsletter_sends for auto-generation and approval
ALTER TABLE public.newsletter_sends 
  ADD COLUMN IF NOT EXISTS approval_token text,
  ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS auto_generated boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS research_topic text,
  ADD COLUMN IF NOT EXISTS research_sources jsonb;

-- Create newsletter tracking table
CREATE TABLE public.newsletter_tracking (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  newsletter_id uuid REFERENCES public.newsletter_sends(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  event_type text NOT NULL, -- 'open', 'click', 'reply'
  link_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_agent text,
  ip_address text
);

-- Enable RLS
ALTER TABLE public.newsletter_tracking ENABLE ROW LEVEL SECURITY;

-- Service role only (edge functions use service key)
CREATE POLICY "Service role can insert tracking" ON public.newsletter_tracking
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view tracking" ON public.newsletter_tracking
  FOR SELECT USING (auth.role() = 'authenticated');

-- Index for fast analytics queries
CREATE INDEX idx_newsletter_tracking_newsletter ON public.newsletter_tracking(newsletter_id);
CREATE INDEX idx_newsletter_tracking_event ON public.newsletter_tracking(event_type);

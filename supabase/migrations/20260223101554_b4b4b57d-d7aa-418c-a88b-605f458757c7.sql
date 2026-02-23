
-- Add new columns to email_subscribers
ALTER TABLE public.email_subscribers 
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS unsubscribed_at timestamptz;

-- Add unique constraint on email to prevent duplicates
ALTER TABLE public.email_subscribers 
  ADD CONSTRAINT email_subscribers_email_unique UNIQUE (email);

-- Allow authenticated users to update subscribers (for unsubscribe, status changes)
CREATE POLICY "Authenticated users can update subscribers"
  ON public.email_subscribers
  FOR UPDATE
  USING (auth.role() = 'authenticated'::text)
  WITH CHECK (auth.role() = 'authenticated'::text);

-- Allow public unsubscribe (anyone with the link can unsubscribe themselves)
CREATE POLICY "Anyone can unsubscribe"
  ON public.email_subscribers
  FOR UPDATE
  USING (true)
  WITH CHECK (status = 'unsubscribed');

-- Create newsletter_sends table
CREATE TABLE public.newsletter_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  body_html text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  recipient_count integer DEFAULT 0,
  sent_by text,
  status text NOT NULL DEFAULT 'draft',
  tag_filter text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on newsletter_sends
ALTER TABLE public.newsletter_sends ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can manage newsletter sends
CREATE POLICY "Authenticated users can view newsletter sends"
  ON public.newsletter_sends FOR SELECT
  USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can insert newsletter sends"
  ON public.newsletter_sends FOR INSERT
  WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can update newsletter sends"
  ON public.newsletter_sends FOR UPDATE
  USING (auth.role() = 'authenticated'::text);

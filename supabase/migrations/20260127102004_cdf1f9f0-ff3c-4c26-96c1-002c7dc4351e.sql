-- Create lead_magnet_downloads table
CREATE TABLE public.lead_magnet_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  lead_magnet TEXT NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT
);

-- Enable Row Level Security
ALTER TABLE public.lead_magnet_downloads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit (insert) a download request
CREATE POLICY "Anyone can submit lead magnet download"
ON public.lead_magnet_downloads
FOR INSERT
WITH CHECK (true);

-- Only authenticated users can view downloads (for admin dashboard)
CREATE POLICY "Authenticated users can view lead magnet downloads"
ON public.lead_magnet_downloads
FOR SELECT
USING (auth.role() = 'authenticated');

-- Create index on email for faster lookups
CREATE INDEX idx_lead_magnet_downloads_email ON public.lead_magnet_downloads(email);

-- Create index on lead_magnet for filtering
CREATE INDEX idx_lead_magnet_downloads_lead_magnet ON public.lead_magnet_downloads(lead_magnet);
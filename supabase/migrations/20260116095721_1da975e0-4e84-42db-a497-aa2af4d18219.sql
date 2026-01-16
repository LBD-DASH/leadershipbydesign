-- Create table for workshop download leads
CREATE TABLE public.workshop_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  workshop TEXT NOT NULL,
  diagnostic_submission_id UUID REFERENCES public.diagnostic_submissions(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.workshop_downloads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a download request (lead capture)
CREATE POLICY "Anyone can submit download request"
ON public.workshop_downloads
FOR INSERT
WITH CHECK (true);

-- Only authenticated users can view download records
CREATE POLICY "Authenticated users can view downloads"
ON public.workshop_downloads
FOR SELECT
USING (auth.role() = 'authenticated');
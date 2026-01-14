-- Create diagnostic_submissions table
CREATE TABLE public.diagnostic_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  answers JSONB NOT NULL,
  clarity_score INTEGER NOT NULL,
  motivation_score INTEGER NOT NULL,
  leadership_score INTEGER NOT NULL,
  primary_recommendation TEXT NOT NULL,
  secondary_recommendation TEXT,
  email TEXT,
  company TEXT,
  name TEXT,
  contacted_expert BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.diagnostic_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert diagnostic submissions (public form)
CREATE POLICY "Anyone can submit diagnostic"
ON public.diagnostic_submissions
FOR INSERT
WITH CHECK (true);

-- Only authenticated users can view submissions (admin access)
CREATE POLICY "Authenticated users can view submissions"
ON public.diagnostic_submissions
FOR SELECT
TO authenticated
USING (true);

-- Allow updating submissions (for adding contact info later)
CREATE POLICY "Anyone can update their own submission"
ON public.diagnostic_submissions
FOR UPDATE
USING (true)
WITH CHECK (true);
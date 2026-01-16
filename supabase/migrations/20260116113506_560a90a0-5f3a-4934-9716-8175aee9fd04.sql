-- Create leadership_diagnostic_submissions table
CREATE TABLE public.leadership_diagnostic_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  answers JSONB NOT NULL,
  l1_score INTEGER NOT NULL,
  l2_score INTEGER NOT NULL,
  l3_score INTEGER NOT NULL,
  l4_score INTEGER NOT NULL,
  l5_score INTEGER NOT NULL,
  primary_level TEXT NOT NULL,
  secondary_level TEXT,
  is_hybrid BOOLEAN NOT NULL DEFAULT false,
  low_foundation_flag BOOLEAN NOT NULL DEFAULT false,
  email TEXT,
  name TEXT,
  company TEXT
);

-- Enable Row Level Security
ALTER TABLE public.leadership_diagnostic_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit leadership diagnostic"
ON public.leadership_diagnostic_submissions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view leadership diagnostic submissions"
ON public.leadership_diagnostic_submissions
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update leadership submissions"
ON public.leadership_diagnostic_submissions
FOR UPDATE
USING (true)
WITH CHECK (true);
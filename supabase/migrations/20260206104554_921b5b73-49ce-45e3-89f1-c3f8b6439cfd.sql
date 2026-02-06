-- Create table for Contagious Identity Coaching interest submissions
CREATE TABLE public.contagious_identity_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Contact information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  role TEXT,
  company_size TEXT,
  
  -- Qualifying questions
  coaching_goals TEXT,
  current_challenge TEXT,
  timeline TEXT,
  
  -- Lead tracking fields (unified schema)
  lead_score INTEGER,
  lead_temperature TEXT,
  buyer_persona TEXT,
  urgency TEXT,
  ai_analysis TEXT,
  next_action TEXT,
  scoring_breakdown JSONB,
  
  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  
  -- Submission type
  submission_type TEXT NOT NULL DEFAULT 'interest' CHECK (submission_type IN ('workbook_download', 'interest'))
);

-- Enable Row Level Security
ALTER TABLE public.contagious_identity_interests ENABLE ROW LEVEL SECURITY;

-- Create policies for public form submission
CREATE POLICY "Anyone can submit coaching interest" 
ON public.contagious_identity_interests 
FOR INSERT 
WITH CHECK (true);

-- Authenticated users can view submissions
CREATE POLICY "Authenticated users can view coaching interests" 
ON public.contagious_identity_interests 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Allow updating for lead scoring
CREATE POLICY "Anyone can update coaching interests" 
ON public.contagious_identity_interests 
FOR UPDATE 
USING (true)
WITH CHECK (true);
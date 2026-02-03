-- Create AI Readiness Diagnostic Submissions table
CREATE TABLE IF NOT EXISTS public.ai_readiness_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  answers JSONB NOT NULL,
  -- Category scores
  ai_awareness_score INTEGER NOT NULL,
  human_ai_collab_score INTEGER NOT NULL,
  change_readiness_score INTEGER NOT NULL,
  ethical_ai_score INTEGER NOT NULL,
  human_skills_score INTEGER NOT NULL,
  overall_score INTEGER NOT NULL,
  readiness_level TEXT NOT NULL,
  primary_recommendation TEXT NOT NULL,
  secondary_recommendation TEXT,
  -- Lead capture fields
  name TEXT,
  email TEXT,
  organisation TEXT,
  role TEXT,
  phone TEXT,
  follow_up_preference TEXT,
  waiting_list BOOLEAN DEFAULT FALSE,
  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  -- Lead scoring (unified schema)
  lead_score INTEGER,
  lead_temperature TEXT,
  buyer_persona TEXT,
  company_size TEXT,
  urgency TEXT,
  ai_analysis TEXT,
  next_action TEXT,
  scoring_breakdown JSONB
);

-- Enable Row Level Security
ALTER TABLE public.ai_readiness_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit AI readiness diagnostic" 
ON public.ai_readiness_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view AI readiness submissions" 
ON public.ai_readiness_submissions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update AI readiness submissions" 
ON public.ai_readiness_submissions 
FOR UPDATE 
USING (true)
WITH CHECK (true);
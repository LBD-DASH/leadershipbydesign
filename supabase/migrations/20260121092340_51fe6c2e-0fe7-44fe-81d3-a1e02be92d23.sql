-- Create shift_diagnostic_submissions table
CREATE TABLE public.shift_diagnostic_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  answers JSONB NOT NULL,
  self_management_score INTEGER NOT NULL,
  human_intelligence_score INTEGER NOT NULL,
  innovation_score INTEGER NOT NULL,
  focus_score INTEGER NOT NULL,
  thinking_score INTEGER NOT NULL,
  primary_development TEXT NOT NULL,
  secondary_development TEXT,
  primary_strength TEXT NOT NULL,
  name TEXT,
  email TEXT,
  organisation TEXT,
  role TEXT,
  follow_up_preference TEXT,
  waiting_list BOOLEAN DEFAULT false,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT
);

-- Enable Row Level Security
ALTER TABLE public.shift_diagnostic_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit shift diagnostic" 
ON public.shift_diagnostic_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view shift diagnostic submissions" 
ON public.shift_diagnostic_submissions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update shift submissions" 
ON public.shift_diagnostic_submissions 
FOR UPDATE 
USING (true)
WITH CHECK (true);
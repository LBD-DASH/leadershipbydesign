-- Create contact_form_submissions table for lead tracking
CREATE TABLE public.contact_form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  service_interest TEXT,
  message TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
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
ALTER TABLE public.contact_form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (anyone can submit contact form)
CREATE POLICY "Anyone can submit contact form"
ON public.contact_form_submissions
FOR INSERT
WITH CHECK (true);

-- Create policy for authenticated users to view submissions
CREATE POLICY "Authenticated users can view contact submissions"
ON public.contact_form_submissions
FOR SELECT
USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to update submissions (for AI analysis)
CREATE POLICY "Authenticated users can update contact submissions"
ON public.contact_form_submissions
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Also allow public to update their own submissions (for AI analysis callback)
CREATE POLICY "Anyone can update contact submissions"
ON public.contact_form_submissions
FOR UPDATE
USING (true)
WITH CHECK (true);
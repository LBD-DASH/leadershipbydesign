-- Create table for storing generated Google Ads content
CREATE TABLE public.google_ads_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  campaign_type TEXT NOT NULL, -- search, display, pmax
  service_reference TEXT,
  headlines JSONB NOT NULL,
  descriptions JSONB NOT NULL,
  keywords JSONB,
  negative_keywords JSONB,
  audience_signals JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  campaign_brief TEXT,
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.google_ads_content ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can view google ads content" 
ON public.google_ads_content 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert google ads content" 
ON public.google_ads_content 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update google ads content" 
ON public.google_ads_content 
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete google ads content" 
ON public.google_ads_content 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_google_ads_content_updated_at
BEFORE UPDATE ON public.google_ads_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
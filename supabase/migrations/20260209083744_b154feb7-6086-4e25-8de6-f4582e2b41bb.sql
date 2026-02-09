-- Create table for storing YouTube content assets
CREATE TABLE public.content_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url TEXT NOT NULL,
  video_title TEXT,
  video_thumbnail TEXT,
  video_duration TEXT,
  video_description TEXT,
  published_date TIMESTAMPTZ,
  transcript TEXT,
  
  -- Generated assets (stored as JSONB for structured data)
  pdf_summary JSONB, -- {title, takeaways, summary, action_steps, product_cta, diagnostic_cta}
  linkedin_long TEXT,
  linkedin_short TEXT,
  short_form_scripts JSONB, -- [{hook, body, cta, onscreen_text}, ...]
  email_block JSONB, -- {subject, preview, body}
  blog_post JSONB, -- {title, meta_description, content}
  twitter_thread JSONB, -- [{tweet_1}, {tweet_2}, ...]
  
  -- Metadata
  relevant_product TEXT, -- which product the AI recommended
  relevant_diagnostic TEXT, -- which diagnostic to promote
  pdf_url TEXT, -- URL to generated PDF in storage
  status TEXT NOT NULL DEFAULT 'processing', -- processing, completed, error
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;

-- RLS policies for content_assets - only authenticated users can access
CREATE POLICY "Authenticated users can view content assets"
ON public.content_assets FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert content assets"
ON public.content_assets FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update content assets"
ON public.content_assets FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete content assets"
ON public.content_assets FOR DELETE
USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_content_assets_updated_at
BEFORE UPDATE ON public.content_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for lead captures from PDF downloads
CREATE TABLE public.lead_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  resource_slug TEXT, -- which PDF they downloaded
  resource_title TEXT, -- human-readable title
  content_asset_id UUID REFERENCES public.content_assets(id),
  source TEXT, -- youtube, linkedin, website, email
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a lead capture (public form)
CREATE POLICY "Anyone can submit lead capture"
ON public.lead_captures FOR INSERT
WITH CHECK (true);

-- Only authenticated users can view
CREATE POLICY "Authenticated users can view lead captures"
ON public.lead_captures FOR SELECT
USING (auth.role() = 'authenticated');

-- Create storage bucket for lead magnet PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-magnets', 'lead-magnets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for lead-magnets bucket
CREATE POLICY "Lead magnets are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'lead-magnets');

CREATE POLICY "Authenticated users can upload lead magnets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lead-magnets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update lead magnets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lead-magnets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete lead magnets"
ON storage.objects FOR DELETE
USING (bucket_id = 'lead-magnets' AND auth.role() = 'authenticated');
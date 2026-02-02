-- Marketing content posts table
CREATE TABLE public.marketing_content (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Content type: 'social_linkedin', 'social_twitter', 'blog_post', 'email'
    content_type TEXT NOT NULL,
    
    -- The generated content
    title TEXT,
    content TEXT NOT NULL,
    hashtags TEXT[],
    
    -- Source context for AI generation
    source_type TEXT, -- 'service', 'diagnostic', 'blog', 'manual'
    source_reference TEXT, -- e.g., 'executive-coaching', 'shift-diagnostic'
    
    -- Workflow status: 'draft', 'pending_review', 'approved', 'scheduled', 'published', 'rejected'
    status TEXT NOT NULL DEFAULT 'pending_review',
    
    -- Scheduling
    scheduled_for TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Platform-specific data (for when we add API integrations)
    platform_post_id TEXT,
    platform_url TEXT,
    
    -- Analytics (future use)
    impressions INTEGER DEFAULT 0,
    engagements INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    
    -- Rejection/edit notes
    review_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.marketing_content ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can manage content (admin-only via existing auth)
CREATE POLICY "Authenticated users can view marketing content"
ON public.marketing_content FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert marketing content"
ON public.marketing_content FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update marketing content"
ON public.marketing_content FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete marketing content"
ON public.marketing_content FOR DELETE
USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE TRIGGER update_marketing_content_updated_at
BEFORE UPDATE ON public.marketing_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Marketing campaigns table (for email sequences)
CREATE TABLE public.marketing_campaigns (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    name TEXT NOT NULL,
    description TEXT,
    campaign_type TEXT NOT NULL, -- 'email_sequence', 'social_campaign'
    
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
    
    -- Target audience
    target_audience TEXT, -- 'all_leads', 'hot_leads', 'diagnostic_completers', etc.
    
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage campaigns"
ON public.marketing_campaigns FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE TRIGGER update_marketing_campaigns_updated_at
BEFORE UPDATE ON public.marketing_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
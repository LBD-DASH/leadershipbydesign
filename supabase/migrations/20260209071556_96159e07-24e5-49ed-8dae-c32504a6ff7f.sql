-- =====================================================
-- PROSPECTING SYSTEM UPGRADE: Database Schema Changes
-- =====================================================

-- 1. Create prospect_sequences table for multi-step email sequences
CREATE TABLE public.prospect_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES public.prospect_companies(id) ON DELETE CASCADE,
  sequence_step INTEGER DEFAULT 1,
  next_send_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active', -- active, paused, completed, replied, unsubscribed, engaged
  paused_at TIMESTAMPTZ,
  template_variant TEXT, -- hot, warm, cool
  original_subject TEXT, -- Store step 1 subject for "Re:" follow-ups
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add columns to prospect_outreach for sequence tracking
ALTER TABLE public.prospect_outreach 
  ADD COLUMN IF NOT EXISTS sequence_step INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS template_used TEXT;

-- 3. Add columns to prospect_companies for enhanced AI insights and engagement
ALTER TABLE public.prospect_companies 
  ADD COLUMN IF NOT EXISTS industry_insight TEXT,
  ADD COLUMN IF NOT EXISTS recommended_diagnostic TEXT,
  ADD COLUMN IF NOT EXISTS recommended_product TEXT,
  ADD COLUMN IF NOT EXISTS engagement_source TEXT,
  ADD COLUMN IF NOT EXISTS engaged_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS meeting_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS meeting_notes TEXT,
  ADD COLUMN IF NOT EXISTS meeting_outcome TEXT; -- converted, not_interested, follow_up_later

-- 4. Enable RLS on prospect_sequences
ALTER TABLE public.prospect_sequences ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for prospect_sequences (admin-only)
CREATE POLICY "Admins can view all sequences" 
ON public.prospect_sequences 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() 
  AND user_roles.role = 'admin'::app_role
));

CREATE POLICY "Admins can create sequences" 
ON public.prospect_sequences 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() 
  AND user_roles.role = 'admin'::app_role
));

CREATE POLICY "Admins can update sequences" 
ON public.prospect_sequences 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() 
  AND user_roles.role = 'admin'::app_role
));

CREATE POLICY "Admins can delete sequences" 
ON public.prospect_sequences 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() 
  AND user_roles.role = 'admin'::app_role
));

-- 6. Create indexes for performance
CREATE INDEX idx_sequences_next_send ON public.prospect_sequences(next_send_at) WHERE status = 'active';
CREATE INDEX idx_sequences_prospect ON public.prospect_sequences(prospect_id);
CREATE INDEX idx_sequences_status ON public.prospect_sequences(status);
CREATE INDEX idx_companies_status ON public.prospect_companies(status);
CREATE INDEX idx_companies_engaged ON public.prospect_companies(engaged_at) WHERE engaged_at IS NOT NULL;

-- 7. Add trigger for updated_at on prospect_sequences
CREATE TRIGGER update_prospect_sequences_updated_at
  BEFORE UPDATE ON public.prospect_sequences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
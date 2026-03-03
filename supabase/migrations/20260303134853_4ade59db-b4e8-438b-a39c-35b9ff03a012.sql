
-- Enhance apollo_sequence_tracking with email steps, priority scoring, agent context
ALTER TABLE public.apollo_sequence_tracking
  ADD COLUMN IF NOT EXISTS email_steps JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS current_step INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sequence_total_steps INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sequence_finished BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS industry_tag TEXT,
  ADD COLUMN IF NOT EXISTS offer_type TEXT,
  ADD COLUMN IF NOT EXISTS campaign_intent TEXT,
  ADD COLUMN IF NOT EXISTS priority_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS priority_reason TEXT,
  ADD COLUMN IF NOT EXISTS assigned_agent TEXT,
  ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS called_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS call_outcome TEXT,
  ADD COLUMN IF NOT EXISTS call_notes TEXT,
  ADD COLUMN IF NOT EXISTS suggested_opener TEXT,
  ADD COLUMN IF NOT EXISTS last_email_sent_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'apollo-auto';

-- Index for queue sorting
CREATE INDEX IF NOT EXISTS idx_apollo_tracking_priority ON public.apollo_sequence_tracking (priority_score DESC, last_email_sent_at DESC) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_apollo_tracking_agent ON public.apollo_sequence_tracking (assigned_agent) WHERE assigned_agent IS NOT NULL;

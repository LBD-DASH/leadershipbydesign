
ALTER TABLE leader_as_coach_assessments
  ADD COLUMN IF NOT EXISTS apollo_data JSONB,
  ADD COLUMN IF NOT EXISTS apollo_enriched_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS apollo_enrichment_status TEXT,
  ADD COLUMN IF NOT EXISTS ruflo_intelligence JSONB,
  ADD COLUMN IF NOT EXISTS ruflo_processed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS buying_intent_score INTEGER,
  ADD COLUMN IF NOT EXISTS buyer_type TEXT,
  ADD COLUMN IF NOT EXISTS urgency_level TEXT,
  ADD COLUMN IF NOT EXISTS ideal_next_step TEXT,
  ADD COLUMN IF NOT EXISTS ruflo_path TEXT,
  ADD COLUMN IF NOT EXISTS vip_email_sent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS vip_email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS vip_email_subject TEXT,
  ADD COLUMN IF NOT EXISTS vip_email_body TEXT,
  ADD COLUMN IF NOT EXISTS vip_email_outcome TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_lac_buying_intent ON leader_as_coach_assessments(buying_intent_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_lac_ruflo_path ON leader_as_coach_assessments(ruflo_path);
CREATE INDEX IF NOT EXISTS idx_lac_status ON leader_as_coach_assessments(status);

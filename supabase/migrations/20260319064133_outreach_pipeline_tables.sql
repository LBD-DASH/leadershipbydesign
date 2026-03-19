-- ═══════════════════════════════════════════════════════════
-- LBD Outreach Pipeline — New Tables
-- outreach_queue + email_outreach_log + views
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS outreach_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apollo_id TEXT, name TEXT NOT NULL, email TEXT, phone TEXT,
  company TEXT, title TEXT, linkedin_url TEXT,
  vertical TEXT NOT NULL DEFAULT 'fsi',
  tier TEXT NOT NULL DEFAULT 'COLD' CHECK (tier IN ('HOT', 'WARM', 'COLD')),
  product TEXT DEFAULT 'leader_as_coach', estimated_value NUMERIC,
  firecrawl_score INTEGER, firecrawl_signals JSONB DEFAULT '[]'::jsonb,
  email_sent_at TIMESTAMPTZ, email_subject TEXT, email_body TEXT,
  scheduled_call_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending_email' CHECK (status IN (
    'pending_email','emailed','pending_call','called','interested',
    'objection','no_answer','callback_scheduled','proposal_sent',
    'meeting_booked','closed_won','closed_lost','disqualified','unsubscribed')),
  call_date TIMESTAMPTZ, call_result TEXT, call_notes TEXT, called_by TEXT,
  next_action TEXT, next_action_date TIMESTAMPTZ,
  source TEXT DEFAULT 'claude_code',
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outreach_queue_call_ready
  ON outreach_queue (status, scheduled_call_date, tier);
CREATE INDEX IF NOT EXISTS idx_outreach_queue_status
  ON outreach_queue (status, updated_at);

CREATE TABLE IF NOT EXISTS email_outreach_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outreach_queue_id UUID REFERENCES outreach_queue(id),
  apollo_id TEXT, name TEXT, email TEXT NOT NULL, company TEXT, vertical TEXT,
  email_type TEXT DEFAULT 'cold_outreach', subject TEXT, body TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(), gmail_message_id TEXT,
  reply_received BOOLEAN DEFAULT FALSE, reply_received_at TIMESTAMPTZ,
  reply_body TEXT, reply_sentiment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_log_outreach
  ON email_outreach_log (outreach_queue_id);
CREATE INDEX IF NOT EXISTS idx_email_log_reply
  ON email_outreach_log (reply_received, sent_at);

-- Agent call queue view
CREATE OR REPLACE VIEW call_queue_agent_view AS
SELECT id, name, email, phone, company, title, vertical, tier,
  product, estimated_value, firecrawl_score, firecrawl_signals,
  email_sent_at, scheduled_call_date, status, next_action, next_action_date, created_at
FROM outreach_queue
WHERE status = 'pending_call' AND scheduled_call_date <= NOW()
ORDER BY CASE tier WHEN 'HOT' THEN 1 WHEN 'WARM' THEN 2 WHEN 'COLD' THEN 3 END, scheduled_call_date ASC;

-- Pipeline dashboard view
CREATE OR REPLACE VIEW pipeline_dashboard AS
SELECT vertical, tier, status, COUNT(*) as count, SUM(estimated_value) as total_value
FROM outreach_queue WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY vertical, tier, status ORDER BY vertical, tier;

-- RLS
ALTER TABLE outreach_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_outreach_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access_outreach" ON outreach_queue FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_full_access_email_log" ON email_outreach_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_read_call_queue" ON outreach_queue FOR SELECT USING (true);
CREATE POLICY "anon_update_call_result" ON outreach_queue FOR UPDATE USING (status = 'pending_call')
  WITH CHECK (status IN ('called','interested','objection','no_answer','callback_scheduled'));

-- Unified outreach channels table — tracks all touch points across channels
CREATE TABLE IF NOT EXISTS outreach_channels (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  apollo_id TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('google_ads', 'dux_soup', 'email', 'phone_call', 'unknown')),
  source TEXT,
  ga_event_name TEXT,
  ga_event_count INT DEFAULT 0,
  dux_soup_campaign_id TEXT,
  dux_soup_event TEXT,
  email_sent_date TIMESTAMPTZ,
  email_reply_received BOOLEAN DEFAULT FALSE,
  phone_call_date TIMESTAMPTZ,
  phone_call_result TEXT,
  overall_status TEXT CHECK (overall_status IN ('new', 'engaged', 'interested', 'objection', 'no_response', 'qualified', 'closed_won', 'closed_lost')),
  first_touch_date TIMESTAMPTZ,
  last_touch_date TIMESTAMPTZ,
  total_touches INT DEFAULT 1,
  estimated_deal_value INT,
  channel_cost DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outreach_channels_apollo_id ON outreach_channels(apollo_id);
CREATE INDEX IF NOT EXISTS idx_outreach_channels_channel ON outreach_channels(channel);
CREATE INDEX IF NOT EXISTS idx_outreach_channels_overall_status ON outreach_channels(overall_status);

-- Unified dashboard view — ROI by channel
CREATE OR REPLACE VIEW unified_dashboard AS
SELECT
  channel,
  COUNT(*) as total_touches,
  SUM(CASE WHEN overall_status IN ('interested', 'qualified', 'closed_won') THEN 1 ELSE 0 END) as positive_outcomes,
  ROUND(100.0 * SUM(CASE WHEN overall_status IN ('interested', 'qualified', 'closed_won') THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2) as conversion_rate_pct,
  ROUND(AVG(channel_cost), 2) as avg_cost_per_touch,
  SUM(estimated_deal_value) as total_pipeline_value
FROM outreach_channels
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY channel
ORDER BY conversion_rate_pct DESC;

-- RLS
ALTER TABLE outreach_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access_channels" ON outreach_channels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_read_channels" ON outreach_channels FOR SELECT USING (true);

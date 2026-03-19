CREATE TABLE IF NOT EXISTS outreach_channels (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  apollo_id TEXT NOT NULL,
  contact_email TEXT,
  contact_name TEXT,
  company TEXT,
  channel TEXT NOT NULL,
  channel_step TEXT,
  channel_status TEXT DEFAULT 'pending',
  overall_status TEXT DEFAULT 'active',
  touch_date TIMESTAMPTZ DEFAULT NOW(),
  channel_cost NUMERIC(10,2) DEFAULT 0,
  estimated_deal_value NUMERIC(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outreach_channels_apollo_id ON outreach_channels(apollo_id);
CREATE INDEX IF NOT EXISTS idx_outreach_channels_channel ON outreach_channels(channel);
CREATE INDEX IF NOT EXISTS idx_outreach_channels_overall_status ON outreach_channels(overall_status);

CREATE OR REPLACE VIEW channel_roi_dashboard AS
SELECT
  channel,
  COUNT(*) as total_touches,
  COUNT(DISTINCT apollo_id) as unique_contacts,
  COUNT(*) FILTER (WHERE channel_status = 'replied') as replies,
  COUNT(*) FILTER (WHERE channel_status = 'booked') as bookings,
  ROUND(AVG(channel_cost), 2) as avg_cost_per_touch,
  SUM(estimated_deal_value) as total_pipeline_value
FROM outreach_channels
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY channel
ORDER BY bookings DESC;

ALTER TABLE outreach_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access_channels" ON outreach_channels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_read_channels" ON outreach_channels FOR SELECT USING (true);
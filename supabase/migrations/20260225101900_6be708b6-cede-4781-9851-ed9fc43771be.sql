ALTER TABLE public.newsletter_sends
  ADD COLUMN IF NOT EXISTS slack_open_alert_sent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS slack_click_alert_sent boolean DEFAULT false;
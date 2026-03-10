ALTER TABLE public.warm_outreach_queue 
ADD COLUMN IF NOT EXISTS sequence_step integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS step2_sent_at timestamptz,
ADD COLUMN IF NOT EXISTS step3_sent_at timestamptz,
ADD COLUMN IF NOT EXISTS step4_sent_at timestamptz,
ADD COLUMN IF NOT EXISTS reply_received boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS unsubscribed boolean DEFAULT false;
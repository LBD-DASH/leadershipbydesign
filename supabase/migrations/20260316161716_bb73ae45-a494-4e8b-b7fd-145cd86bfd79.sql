
ALTER TABLE public.warm_outreach_queue ADD COLUMN IF NOT EXISTS needs_day1 boolean NOT NULL DEFAULT false;

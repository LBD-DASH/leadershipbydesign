
ALTER TABLE public.warm_outreach_queue ADD COLUMN IF NOT EXISTS industry text;
ALTER TABLE public.warm_outreach_queue ADD COLUMN IF NOT EXISTS score integer DEFAULT 0;
ALTER TABLE public.warm_outreach_queue ADD COLUMN IF NOT EXISTS disqualified boolean DEFAULT false;
ALTER TABLE public.warm_outreach_queue ADD COLUMN IF NOT EXISTS disqualified_reason text;

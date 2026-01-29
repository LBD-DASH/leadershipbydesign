-- Add lead scoring columns to all diagnostic submission tables

-- Leadership diagnostic submissions
ALTER TABLE public.leadership_diagnostic_submissions
ADD COLUMN IF NOT EXISTS lead_score integer,
ADD COLUMN IF NOT EXISTS lead_temperature text,
ADD COLUMN IF NOT EXISTS buyer_persona text,
ADD COLUMN IF NOT EXISTS company_size text,
ADD COLUMN IF NOT EXISTS urgency text,
ADD COLUMN IF NOT EXISTS ai_analysis text,
ADD COLUMN IF NOT EXISTS next_action text,
ADD COLUMN IF NOT EXISTS scoring_breakdown jsonb;

-- Team diagnostic submissions
ALTER TABLE public.diagnostic_submissions
ADD COLUMN IF NOT EXISTS lead_score integer,
ADD COLUMN IF NOT EXISTS lead_temperature text,
ADD COLUMN IF NOT EXISTS buyer_persona text,
ADD COLUMN IF NOT EXISTS company_size text,
ADD COLUMN IF NOT EXISTS urgency text,
ADD COLUMN IF NOT EXISTS ai_analysis text,
ADD COLUMN IF NOT EXISTS next_action text,
ADD COLUMN IF NOT EXISTS scoring_breakdown jsonb;

-- Shift diagnostic submissions
ALTER TABLE public.shift_diagnostic_submissions
ADD COLUMN IF NOT EXISTS lead_score integer,
ADD COLUMN IF NOT EXISTS lead_temperature text,
ADD COLUMN IF NOT EXISTS buyer_persona text,
ADD COLUMN IF NOT EXISTS company_size text,
ADD COLUMN IF NOT EXISTS urgency text,
ADD COLUMN IF NOT EXISTS ai_analysis text,
ADD COLUMN IF NOT EXISTS next_action text,
ADD COLUMN IF NOT EXISTS scoring_breakdown jsonb;

-- Lead magnet downloads
ALTER TABLE public.lead_magnet_downloads
ADD COLUMN IF NOT EXISTS lead_score integer,
ADD COLUMN IF NOT EXISTS lead_temperature text,
ADD COLUMN IF NOT EXISTS buyer_persona text,
ADD COLUMN IF NOT EXISTS ai_analysis text;
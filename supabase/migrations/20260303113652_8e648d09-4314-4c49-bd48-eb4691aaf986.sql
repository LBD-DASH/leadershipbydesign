
-- Add source column to distinguish CSV uploads from agent-sourced contacts
ALTER TABLE public.call_list_prospects
ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'csv-upload';

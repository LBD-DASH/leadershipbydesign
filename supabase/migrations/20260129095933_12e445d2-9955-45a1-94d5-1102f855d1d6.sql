-- Add phone column to diagnostic_submissions
ALTER TABLE public.diagnostic_submissions ADD COLUMN IF NOT EXISTS phone text;

-- Add phone column to leadership_diagnostic_submissions
ALTER TABLE public.leadership_diagnostic_submissions ADD COLUMN IF NOT EXISTS phone text;

-- Add phone column to shift_diagnostic_submissions
ALTER TABLE public.shift_diagnostic_submissions ADD COLUMN IF NOT EXISTS phone text;

-- Add phone column to contact_form_submissions
ALTER TABLE public.contact_form_submissions ADD COLUMN IF NOT EXISTS phone text;

-- Add phone column to lead_magnet_downloads
ALTER TABLE public.lead_magnet_downloads ADD COLUMN IF NOT EXISTS phone text;
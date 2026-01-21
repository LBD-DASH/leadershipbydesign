-- Add waiting list columns to leadership_diagnostic_submissions
ALTER TABLE public.leadership_diagnostic_submissions
ADD COLUMN organisation text,
ADD COLUMN role text,
ADD COLUMN waiting_list boolean DEFAULT false,
ADD COLUMN follow_up_preference text;

-- Add waiting list columns to diagnostic_submissions
ALTER TABLE public.diagnostic_submissions
ADD COLUMN organisation text,
ADD COLUMN role text,
ADD COLUMN waiting_list boolean DEFAULT false,
ADD COLUMN follow_up_preference text;
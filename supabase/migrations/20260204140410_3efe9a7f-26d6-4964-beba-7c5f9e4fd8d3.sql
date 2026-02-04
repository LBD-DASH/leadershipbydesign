-- Add contact fields to prospect_companies
ALTER TABLE public.prospect_companies ADD COLUMN IF NOT EXISTS contact_email text;
ALTER TABLE public.prospect_companies ADD COLUMN IF NOT EXISTS contact_phone text;
ALTER TABLE public.prospect_companies ADD COLUMN IF NOT EXISTS physical_address text;
ALTER TABLE public.prospect_companies ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE public.prospect_companies ADD COLUMN IF NOT EXISTS contact_name text;
ALTER TABLE public.prospect_companies ADD COLUMN IF NOT EXISTS contact_role text;

-- Create prospect outreach table for email tracking
CREATE TABLE IF NOT EXISTS public.prospect_outreach (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_id uuid REFERENCES public.prospect_companies(id) ON DELETE CASCADE,
  email_subject text NOT NULL,
  email_body text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  sent_at timestamp with time zone,
  opened_at timestamp with time zone,
  replied_at timestamp with time zone,
  bounced_at timestamp with time zone,
  unsubscribed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on prospect_outreach
ALTER TABLE public.prospect_outreach ENABLE ROW LEVEL SECURITY;

-- RLS policies for prospect_outreach (admin only access via user_roles)
CREATE POLICY "Admins can view all outreach" 
ON public.prospect_outreach 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Admins can create outreach" 
ON public.prospect_outreach 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Admins can update outreach" 
ON public.prospect_outreach 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete outreach" 
ON public.prospect_outreach 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_prospect_outreach_prospect_id ON public.prospect_outreach(prospect_id);
CREATE INDEX IF NOT EXISTS idx_prospect_outreach_status ON public.prospect_outreach(status);
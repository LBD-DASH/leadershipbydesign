
-- Table to track Apollo sequence enrollments and engagement signals
CREATE TABLE public.apollo_sequence_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  apollo_contact_id TEXT NOT NULL,
  apollo_sequence_id TEXT NOT NULL,
  apollo_sequence_name TEXT,
  contact_email TEXT NOT NULL,
  contact_name TEXT,
  contact_company TEXT,
  contact_title TEXT,
  call_list_prospect_id UUID REFERENCES public.call_list_prospects(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active',
  total_emails_sent INTEGER DEFAULT 0,
  total_opens INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  total_replies INTEGER DEFAULT 0,
  has_bounced BOOLEAN DEFAULT false,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  call_alert_sent BOOLEAN DEFAULT false,
  call_alert_sent_at TIMESTAMP WITH TIME ZONE,
  added_to_call_list_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(apollo_contact_id, apollo_sequence_id)
);

-- Enable RLS
ALTER TABLE public.apollo_sequence_tracking ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "Admins can manage apollo tracking"
  ON public.apollo_sequence_tracking
  FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

-- Service role can insert/update (for edge functions)
CREATE POLICY "Service role can manage apollo tracking"
  ON public.apollo_sequence_tracking
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_apollo_sequence_tracking_updated_at
  BEFORE UPDATE ON public.apollo_sequence_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- Create a function that auto-adds leads to email_subscribers from any submission table
CREATE OR REPLACE FUNCTION public.sync_lead_to_subscribers()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only sync if email is provided
  IF NEW.email IS NOT NULL AND NEW.email != '' THEN
    INSERT INTO public.email_subscribers (email, name, company, source, tags, status)
    VALUES (
      lower(trim(NEW.email)),
      COALESCE(NEW.name, ''),
      CASE 
        WHEN TG_TABLE_NAME IN ('contact_form_submissions') THEN NEW.company
        WHEN TG_TABLE_NAME IN ('contagious_identity_interests') THEN NEW.company
        ELSE COALESCE(NEW.organisation, NULL)
      END,
      TG_TABLE_NAME,
      ARRAY[TG_TABLE_NAME, 'auto-synced'],
      'active'
    )
    ON CONFLICT (email) DO UPDATE SET
      name = CASE WHEN email_subscribers.name IS NULL OR email_subscribers.name = '' 
             THEN EXCLUDED.name ELSE email_subscribers.name END,
      company = CASE WHEN email_subscribers.company IS NULL OR email_subscribers.company = '' 
               THEN EXCLUDED.company ELSE email_subscribers.company END,
      tags = (
        SELECT array_agg(DISTINCT t) 
        FROM unnest(array_cat(email_subscribers.tags, EXCLUDED.tags)) AS t
      );
  END IF;
  RETURN NEW;
END;
$$;

-- Add triggers to all lead capture tables
CREATE TRIGGER sync_contact_form_to_subscribers
  AFTER INSERT ON public.contact_form_submissions
  FOR EACH ROW EXECUTE FUNCTION public.sync_lead_to_subscribers();

CREATE TRIGGER sync_diagnostic_to_subscribers
  AFTER INSERT ON public.diagnostic_submissions
  FOR EACH ROW EXECUTE FUNCTION public.sync_lead_to_subscribers();

CREATE TRIGGER sync_leadership_diagnostic_to_subscribers
  AFTER INSERT ON public.leadership_diagnostic_submissions
  FOR EACH ROW EXECUTE FUNCTION public.sync_lead_to_subscribers();

CREATE TRIGGER sync_shift_diagnostic_to_subscribers
  AFTER INSERT ON public.shift_diagnostic_submissions
  FOR EACH ROW EXECUTE FUNCTION public.sync_lead_to_subscribers();

CREATE TRIGGER sync_ai_readiness_to_subscribers
  AFTER INSERT ON public.ai_readiness_submissions
  FOR EACH ROW EXECUTE FUNCTION public.sync_lead_to_subscribers();

CREATE TRIGGER sync_lead_magnet_to_subscribers
  AFTER INSERT ON public.lead_magnet_downloads
  FOR EACH ROW EXECUTE FUNCTION public.sync_lead_to_subscribers();

CREATE TRIGGER sync_contagious_identity_to_subscribers
  AFTER INSERT ON public.contagious_identity_interests
  FOR EACH ROW EXECUTE FUNCTION public.sync_lead_to_subscribers();

CREATE TRIGGER sync_product_purchases_to_subscribers
  AFTER INSERT ON public.product_purchases
  FOR EACH ROW EXECUTE FUNCTION public.sync_lead_to_subscribers();

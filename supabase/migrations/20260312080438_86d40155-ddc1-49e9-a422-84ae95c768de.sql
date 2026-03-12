CREATE OR REPLACE FUNCTION public.sync_lead_to_subscribers()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.email IS NOT NULL AND NEW.email != '' THEN
    INSERT INTO public.email_subscribers (email, name, company, source, tags, status)
    VALUES (
      lower(trim(NEW.email)),
      COALESCE(NEW.name, ''),
      CASE 
        WHEN TG_TABLE_NAME IN ('contact_form_submissions', 'contagious_identity_interests') THEN NEW.company
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
$function$;
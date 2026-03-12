CREATE OR REPLACE FUNCTION public.sync_lead_to_subscribers()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF (to_jsonb(NEW)->>'email') IS NOT NULL AND (to_jsonb(NEW)->>'email') != '' THEN
    INSERT INTO public.email_subscribers (email, name, company, source, tags, status)
    VALUES (
      lower(trim(to_jsonb(NEW)->>'email')),
      COALESCE(NULLIF(trim(to_jsonb(NEW)->>'name'), ''), ''),
      COALESCE(
        NULLIF(trim(to_jsonb(NEW)->>'company'), ''),
        NULLIF(trim(to_jsonb(NEW)->>'organisation'), '')
      ),
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

CREATE OR REPLACE FUNCTION public.auto_create_pipeline_deal()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.pipeline_deals (
    lead_source_table,
    lead_source_id,
    lead_name,
    lead_email,
    lead_company,
    lead_phone,
    lead_temperature,
    lead_score,
    stage
  )
  VALUES (
    TG_TABLE_NAME,
    NEW.id,
    COALESCE(NULLIF(trim(to_jsonb(NEW)->>'name'), ''), ''),
    to_jsonb(NEW)->>'email',
    COALESCE(
      NULLIF(trim(to_jsonb(NEW)->>'company'), ''),
      NULLIF(trim(to_jsonb(NEW)->>'organisation'), '')
    ),
    to_jsonb(NEW)->>'phone',
    to_jsonb(NEW)->>'lead_temperature',
    NULLIF(to_jsonb(NEW)->>'lead_score', '')::integer,
    'new_lead'
  )
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$function$;
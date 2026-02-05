-- Enable required extensions for scheduled HTTP calls
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema extensions;

-- (Optional) helpful comment
comment on extension pg_cron is 'Job scheduler for automated prospecting pipeline';
comment on extension pg_net is 'HTTP client for scheduled edge function invocations';
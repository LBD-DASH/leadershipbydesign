
-- Remove old auto-outreach schedules
SELECT cron.unschedule('auto-outreach-morning');
SELECT cron.unschedule('auto-outreach-afternoon');
SELECT cron.unschedule('auto-outreach-daily');

-- Remove old system-heartbeat schedules
SELECT cron.unschedule('system-heartbeat-morning');
SELECT cron.unschedule('system-heartbeat-evening');
SELECT cron.unschedule('system-heartbeat-daily');

-- Auto-outreach 4x daily: 07:05, 10:05, 13:05, 16:05 SAST
SELECT cron.schedule(
  'auto-outreach-4x-daily',
  '5 5,8,11,14 * * *',
  $$
  SELECT net.http_post(
    url:='https://fdtlljyfjdlrymfeguoa.supabase.co/functions/v1/auto-outreach',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkdGxsanlmamRscnltZmVndW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTQ0MjAsImV4cCI6MjA3OTE3MDQyMH0.Pm_LoyKm14CcjIYEVY_2qhkRhIqQUqwKjQTc3zGqCbM"}'::jsonb,
    body:='{"time": "scheduled"}'::jsonb
  ) AS request_id;
  $$
);

-- System-heartbeat 4x daily: 07:00, 11:00, 15:00, 18:00 SAST
SELECT cron.schedule(
  'system-heartbeat-4x-daily',
  '0 5,9,13,16 * * *',
  $$
  SELECT net.http_post(
    url:='https://fdtlljyfjdlrymfeguoa.supabase.co/functions/v1/system-heartbeat',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkdGxsanlmamRscnltZmVndW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTQ0MjAsImV4cCI6MjA3OTE3MDQyMH0.Pm_LoyKm14CcjIYEVY_2qhkRhIqQUqwKjQTc3zGqCbM"}'::jsonb,
    body:='{"time": "scheduled"}'::jsonb
  ) AS request_id;
  $$
);

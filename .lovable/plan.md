

# Status Report: Today's Build

## What's Working

| Component | Status | Notes |
|-----------|--------|-------|
| **Database: `pipeline_deals`** | Live | Table exists, triggers firing on all 6 source tables |
| **Database: `diagnostic_nurture_sequences`** | Live | Table exists with RLS policies |
| **Database: `admin_settings`** | Live | Booking link stored: `https://calendar.google.com/calendar/appointments/schedules/` |
| **Pipeline triggers** | Live | 6 auto-pipeline triggers + 8 subscriber sync triggers all active |
| **Cron jobs** | Live | All 5 new jobs scheduled and active |
| **Edge functions deployed** | Live | `web-scraper-leads`, `auto-outreach`, `auto-follow-up`, `daily-pipeline-report`, `process-diagnostic-nurture` all in config |
| **Booking widget** | Live | Component created, admin-configurable link via `useBookingLink` hook |
| **Sales Pipeline UI** | Live | `SalesPipeline.tsx` in Marketing Dashboard |

## Issues Found

### 1. `warm_outreach_queue` table is MISSING
The `web-scraper-leads`, `auto-outreach`, and `auto-follow-up` edge functions all depend on this table, but it was **not created** in the database. The migration file (`20260306115344`) contains only `SELECT 1;` — it's a no-op. This means all three zero-touch functions will fail when their cron jobs fire.

### 2. `bookings` table is MISSING
Referenced in earlier plans for booking confirmations but never created.

### 3. Edge functions have never executed
No logs exist for any of the new functions. The cron jobs are scheduled but the functions likely error silently because `warm_outreach_queue` doesn't exist.

## Recommended Fix

Create a migration to add the two missing tables:

- **`warm_outreach_queue`** — columns: `id`, `company_name`, `company_website`, `contact_name`, `contact_title`, `contact_email`, `contact_phone`, `contact_linkedin`, `apollo_person_id`, `source_keyword`, `status` (pending/emailed/followed_up/booked), `email_sent_at`, `follow_up_sent_at`, `booked_at`, `email_subject`, `email_body`, `follow_up_body`, `scrape_summary`, `created_at`, `updated_at`. Open INSERT policy for service role, SELECT/UPDATE for authenticated.

- **`bookings`** — columns: `id`, `prospect_email`, `prospect_name`, `prospect_company`, `meeting_datetime`, `meeting_type`, `source_table`, `source_id`, `confirmation_sent`, `diagnostic_sent`, `notes`, `created_at`. Open INSERT for service role, SELECT/UPDATE for authenticated.

This is a single migration — no code changes needed since the edge functions already reference the correct column names.


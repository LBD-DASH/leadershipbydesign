

## Plan: Replace web-scraper-leads with Apollo-first prospecting pipeline

### Problem
The current `web-scraper-leads` function uses Firecrawl keyword search to find companies on the web, then tries to match them in Apollo or scrape emails from contact pages. This yields generic/irrelevant results (NGOs, news sites, generic emails) and has been returning 0 usable prospects.

### Solution
Completely rewrite `web-scraper-leads` to query Apollo's People Search API directly as the lead source. Remove all Firecrawl/web scraping logic. Add a "Run Now" button to the admin settings panel.

### Changes

**1. Rewrite `supabase/functions/web-scraper-leads/index.ts`**

Replace entirely with an Apollo-first pipeline:
- Query Apollo People Search API with fixed filters:
  - `person_titles`: HR Director, Head of L&D, Learning and Development Manager, Talent Director, HR Executive, COO
  - `organization_industry_tag_ids` or `q_keywords`: Financial Services, Insurance, Banking
  - `person_locations`: South Africa
  - `organization_num_employees_ranges`: ["201-500", "501-1000", "1001-5000", "5001-10000"]
  - `email_status`: "verified" (Apollo filter for verified emails only)
- Paginate through results (up to 3 pages of 25)
- Email quality gate: reject prefixes `info`, `support`, `admin`, `news`, `documents`, `membership`, `hello`, `contact`, `sales`, `enquiries`, `reception`, `office`, `no-reply`, `noreply`, `webmaster`, `marketing`
- Dedup against existing `warm_outreach_queue` by email (case-insensitive)
- Insert directly into `warm_outreach_queue` with status `pending`
- Slack notification with results summary
- No Firecrawl dependency at all (only needs `APOLLO_API_KEY`)
- Accepts optional `{ industry_index }` in body to rotate through industries across runs (Financial Services day 1, Insurance day 2, Banking day 3, then repeat)

**2. Update `src/components/admin/AdminSettingsPanel.tsx`**

Add a "Run Prospecting Now" button card:
- Calls `supabase.functions.invoke('web-scraper-leads')` 
- Shows loading state and result toast (prospects added count)
- Placed above the campaign mode card

### No other files change. The cron schedule stays as-is (already calls `web-scraper-leads` at 7 AM SAST). The `auto-outreach` function already reads from `warm_outreach_queue` where `status = 'pending'`, so no changes needed there.


Check the warm_outreach_queue in Supabase. Query the database for:

1. Total pending prospects (status = 'pending')
2. Total emailed today (status = 'emailed', email_sent_at >= today)
3. Total disqualified
4. Breakdown by source_keyword (how many from apollo:import, signal-search, firecrawl, etc.)
5. Breakdown by industry
6. Top 5 pending prospects by score (show name, company, title, industry, score)

Use the Supabase Edge Function or direct DB query via the supabase CLI if available.
If neither is available, explain how to check this in the Supabase dashboard.

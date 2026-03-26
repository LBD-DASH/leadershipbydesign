Run a health check across all LBD AI agents to ensure alignment.

Check these files for consistency:
1. `supabase/functions/apollo-prospect-import/index.ts` — verify EXCLUDED_INDUSTRIES includes: financial services, insurance, banking, education, consulting, management consulting
2. `supabase/functions/web-scraper-leads/index.ts` — verify same exclusions
3. `supabase/functions/auto-outreach/index.ts` — verify reply_to is hello@leadershipbydesign.co, verify no .neq("source_keyword", "apollo:sequence") filter
4. `supabase/functions/claude-context/index.ts` — verify ICP line excludes banks, FSI, insurance, education, consulting
5. `supabase/functions/leadership-chat/index.ts` — verify no FSI/financial services in best fit line
6. `supabase/functions/enrich-queue-emails/index.ts` — verify no FSI industries in list
7. `supabase/functions/prospeo-pipeline/index.ts` — verify no FSI industries in search configs

Report: PASS or FAIL for each, with the specific issue if FAIL.

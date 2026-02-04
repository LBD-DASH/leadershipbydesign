
# Automated Daily Prospecting Pipeline

## Why It Doesn't Work Automatically Yet

The system currently has all the **building blocks** but lacks the **orchestration layer**:

| What We Have | What's Missing |
|--------------|----------------|
| `find-companies` function (discovers 8-10 companies) | No scheduler to trigger it daily |
| `firecrawl-company-research` function (deep research) | No automation to chain discovery → research → save |
| `prospect_companies` database table | No deduplication to avoid re-researching |
| Quality scoring system | No configuration for which industries to target |

## The Solution: Automated Prospecting Pipeline

We'll create a fully automated system that runs daily and populates your prospects with **researched, scored leads**.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    DAILY PROSPECTING PIPELINE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────┐ │
│   │ CRON JOB │───▶│   DISCOVER   │───▶│   RESEARCH   │───▶│ SAVE │ │
│   │ (6am)    │    │ 10 companies │    │ Each company │    │ + DB │ │
│   └──────────┘    │ per industry │    │ via Firecrawl│    │Score │ │
│                   └──────────────┘    └──────────────┘    └──────┘ │
│                                                                     │
│   Industries: Financial Services, Technology, Manufacturing,       │
│               Professional Services, Healthcare                     │
│                                                                     │
│   = 50 NEW RESEARCHED PROSPECTS PER DAY                            │
└─────────────────────────────────────────────────────────────────────┘
```

## Implementation Plan

### 1. Create Orchestration Edge Function
**New file**: `supabase/functions/auto-prospect-pipeline/index.ts`

This function will:
- Accept a list of target industries as configuration
- For each industry: call `find-companies` to discover 10 companies
- Check database to skip already-researched companies (deduplication)
- For each new company: call `firecrawl-company-research`
- Save fully-researched prospects to `prospect_companies` table
- Log results for monitoring

### 2. Create Configuration Table
**New table**: `prospecting_config`

Stores which industries to target and settings:
- `id`, `industry`, `location`, `company_size`, `is_active`, `last_run_at`
- Default industries: Financial Services, Technology, Manufacturing, Professional Services, Healthcare

### 3. Create Run History Table
**New table**: `prospecting_runs`

Tracks each automated run:
- `id`, `started_at`, `completed_at`, `status`, `companies_discovered`, `companies_researched`, `companies_saved`, `errors`

### 4. Set Up pg_cron Scheduler
Schedule the pipeline to run daily at 6am:

```sql
SELECT cron.schedule(
  'daily-prospecting-pipeline',
  '0 6 * * *',  -- 6am every day
  $$ SELECT net.http_post(...) $$
);
```

### 5. Add Admin UI for Monitoring
Update the Marketing Dashboard to show:
- Last run status and results
- Enable/disable industries
- Manual "Run Now" button
- Error logs if any failures

## Technical Details

### Edge Function Logic (Pseudocode)

```text
1. Fetch active industries from prospecting_config
2. For each industry:
   a. Call find-companies API → get 10 companies
   b. Check prospect_companies for existing URLs (skip duplicates)
   c. For each new company (with 2-second delay to avoid rate limits):
      - Call firecrawl-company-research API
      - Calculate quality score
      - Insert into prospect_companies with status='new'
   d. Update prospecting_config.last_run_at
3. Log summary to prospecting_runs table
4. Return success/failure report
```

### Rate Limit Handling

- Add 2-3 second delays between Firecrawl calls
- Process industries sequentially to spread load
- If rate limited (429), retry with exponential backoff
- Maximum 50 companies per run (5 industries × 10 companies)

### Deduplication Strategy

Before researching a company, check if `website_url` already exists in `prospect_companies`:

```sql
SELECT id FROM prospect_companies 
WHERE website_url = $1 OR company_name ILIKE $2
```

### Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `supabase/functions/auto-prospect-pipeline/index.ts` | Create | Main orchestration function |
| `supabase/config.toml` | Modify | Add function config |
| Database migration | Create | Add `prospecting_config` and `prospecting_runs` tables |
| `src/components/marketing/ProspectingAutomation.tsx` | Create | Admin UI for monitoring |
| `src/pages/MarketingDashboard.tsx` | Modify | Add automation tab/section |

## Cost Considerations

Per daily run (50 companies):
- **Lovable AI (Discovery)**: 5 calls × ~3000 tokens = minimal
- **Firecrawl (Scraping)**: 50 scrapes × $0.001 = ~$0.05/day
- **Anthropic (Analysis)**: 50 calls × ~2000 tokens = ~$0.10/day

**Monthly cost**: ~$4.50 for 1,500 fully-researched prospects

## Outcome

After implementation, every morning at 6am you'll wake up to:
- 50 new companies discovered and researched
- Each prospect scored with Green/Yellow/Red quality indicator
- Contact details, pain points, and personalised pitches ready
- HR/L&D decision makers identified with LinkedIn links
- Zero manual effort required

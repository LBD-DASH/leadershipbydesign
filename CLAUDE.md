# Leadership by Design — Claude Code Context

## Quick Recognition
When the user starts a message with **"LBD"**, they are referring to this system — the Leadership by Design AI agent army, Lovable app, Supabase edge functions, n8n workflows, Apollo integration, and outreach automation. Treat it as full context for this repo. The user is Kevin Britz, founder.

## What This Is
LBD is a South African leadership development practice founded by Kevin Britz. The codebase powers the website, CRM, and a fully automated outreach + nurture engine ("agent army") built on Supabase Edge Functions, n8n workflows, and GitHub Actions.

## Ideal Customer Profile (ICP)
- **Target**: HR Directors, L&D Heads, COOs, Talent Executives, Chief People Officers
- **Company size**: Under 500 employees
- **Location**: South Africa
- **Industries**: ALL industries EXCEPT the excluded list below
- **EXCLUDED industries (hard block, never target)**:
  - Banks, Financial Services, Insurance
  - Education (universities, colleges, schools)
  - Consulting / Management Consulting
  - Investment banking, Venture capital, Private equity
  - Fund management, Capital markets, Securities, Wealth management, Asset management

## Agent Architecture
The system runs an automated prospecting + outreach pipeline:

### Supabase Edge Functions (the agents)
| Function | Purpose |
|----------|---------|
| `apollo-prospect-import` | Pulls contacts from Apollo API, enriches emails, adds to warm_outreach_queue. **Rotates through 8 industry groups every 3 days.** |
| `apollo-enroll-sequence` | Enrolls contacts into Apollo email sequences |
| `apollo-webhook` | Receives Apollo campaign events (opens, clicks, replies) |
| `apollo-sync-engagement` | Polls Apollo for engagement metrics, triggers call alerts |
| `apollo-sequence-sync` | Syncs email templates from Supabase to Apollo |
| `apollo-call-queue` | Prioritised call queue engine with agent context |
| `apollo-search` | Backend search wrapper for Apollo API |
| `web-scraper-leads` | Firecrawl + Apollo dual-source lead discovery. **Same 3-day industry rotation.** |
| `auto-outreach` | Claude-generated cold emails sent via Resend. Scrapes company with Firecrawl for personalisation. |
| `auto-follow-up` | 4-step follow-up sequence (Day 1, 4, 9, 16) |
| `process-diagnostic-nurture` | Nurture sequence for diagnostic completers |
| `lac-follow-up` | Leader as Coach assessment follow-up emails |
| `generate-ai-newsletter` | AI-generated weekly newsletter |
| `claude-context` | Live operating system context (pipeline stats, project status) — read by all agents |
| `leadership-chat` | Website chat agent |
| `find-companies` | AI-powered company discovery |
| `ruflo-update-lead` | n8n integration — receives scored/enriched data from Ollama |
| `enrich-queue-emails` | Enriches queue contacts via Apollo |
| `prospeo-pipeline` | Prospeo API lead discovery |

### GitHub Actions Workflow (`lbd-prospecting.yml`)
| Schedule | Phase | What runs |
|----------|-------|-----------|
| 07:00 SAST daily | Phase 1 | `web-scraper-leads`, `auto-outreach` |
| Every 30 min (06:00-18:00) | Nurture | `process-diagnostic-nurture`, `lac-follow-up`, `process-follow-up-sequences` |
| Every 4 hours | Phase 4 | Reply monitoring, `gmail-reply-classifier` |
| 20:30 SAST daily | Phase 6 | Evening dashboard to Slack |
| Sunday 19:00 SAST | Weekly | Summary report |

### n8n Workflows
- Ollama scoring + Apollo enrichment pipeline
- Results sent to `ruflo-update-lead` function
- Classifications: `ruflo_path`, `buying_intent_score`, `buyer_type`

## Key Database Tables
- `warm_outreach_queue` — main prospect queue (source_keyword tracks origin)
- `apollo_sequence_tracking` — Apollo sequence engagement data
- `apollo_sequence_templates` — email templates synced to Apollo
- `pipeline_deals` — CRM pipeline
- `prospect_outreach` — sent email log
- `leader_as_coach_assessments` — LAC diagnostic completions
- `admin_settings` — campaign config (booking_link, campaign_mode)

## Email Configuration
- **From**: `Kevin Britz <hello@leadershipbydesign.co>`
- **Reply-to**: `hello@leadershipbydesign.co` (forwards to kevin@kevinbritz.com)
- **Provider**: Resend
- **Cold email style**: Under 80 words, no corporate language, no flattery, written as Kevin (first person "I")

## Industry Rotation (every 3 days)
Both `apollo-prospect-import` and `web-scraper-leads` rotate through these groups:
0. Professional Services (Accounting, Legal, Staffing, HR, Professional Training)
1. Technology & Telecoms
2. Manufacturing & Engineering
3. Retail & FMCG
4. Healthcare & Pharma
5. Construction & Real Estate
6. Logistics & Mining
7. Media & Hospitality

## Commercial Offer
- **Primary**: Leader as Coach — 90-Day Manager Coaching Accelerator
- **Frameworks**: SHIFT, Leader as Coach, Contagious Identity
- **Stats**: 4,000+ leaders | 30+ organisations | 30+ programmes | 11 years

## Rules for Claude Code
- When modifying any agent/function, always check if ICP targeting is involved and ensure excluded industries are respected
- Never add banks, FSI, insurance, education, or consulting back into any targeting
- All outreach emails must use `hello@leadershipbydesign.co` as reply-to
- Company size filters must stay under 500
- When updating agent prompts or system context, also update `claude-context/index.ts` to keep the live operating system in sync
- Keep Lovable (deploys from `main`) and GitHub aligned — use feature branches + PRs

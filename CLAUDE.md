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

#### FIND PROSPECTS
| Function | Purpose |
|----------|---------|
| `apollo-prospect-import` | Pulls contacts from Apollo API, enriches emails, adds to warm_outreach_queue. **Rotates through 8 industry groups every 3 days.** |
| `web-scraper-leads` | Firecrawl + Apollo dual-source lead discovery. **Same 3-day industry rotation.** |
| `apollo-list-builder` | Builds targeted prospect lists from Apollo based on ICP criteria |
| `find-companies` | AI-powered company discovery |
| `stale-lead-reengager` | Re-engages cold/stale leads with fresh outreach angles |

#### SEND EMAILS
| Function | Purpose |
|----------|---------|
| `auto-outreach` | Claude-generated cold emails sent via Resend. Scrapes company with Firecrawl for personalisation. **Now supports A/B template variants: problem-pattern, question-hook, stat-lead.** |
| `auto-follow-up` | 4-step follow-up sequence (Day 1, 4, 9, 16) |
| `process-diagnostic-nurture` | Nurture sequence for diagnostic completers |
| `lac-follow-up` | Leader as Coach assessment follow-up emails |

#### LEARN & OPTIMIZE
| Function | Purpose |
|----------|---------|
| `conversion-tracker` | Tracks lead-to-deal conversion rates and funnel progression |
| `deliverability-monitor` | Monitors email deliverability, bounce rates, and sender reputation |
| `outreach-optimizer` | Analyses outreach performance and recommends improvements to templates and targeting |
| `performance-dashboard` | Aggregates pipeline metrics for reporting and Slack dashboards |
| `win-loss-tracker` | Tracks deal outcomes to identify winning patterns and lost-deal reasons |

#### MONITOR & ALERT
| Function | Purpose |
|----------|---------|
| `system-heartbeat` | System health checks — emails kevin@kevinbritz.com on detected issues |
| `apollo-sync-engagement` | Polls Apollo for engagement metrics, triggers call alerts |
| `gmail-reply-classifier` | Classifies Gmail replies (interested, not now, unsubscribe, etc.) |
| `competitor-monitor` | Monitors competitor activity and market positioning |

#### CONTENT
| Function | Purpose |
|----------|---------|
| `generate-ai-newsletter` | AI-generated weekly newsletter |
| `blog-repurposer` | Repurposes blog content into other formats (social posts, emails, etc.) |
| `newsletter-curator` | Curates relevant industry content for newsletters |
| `linkedin-scheduler` | Schedules and manages LinkedIn post publishing |

#### SUPPORT
| Function | Purpose |
|----------|---------|
| `claude-context` | Live operating system context (pipeline stats, project status) — read by all agents |
| `leadership-chat` | Website chat agent |
| `apollo-search` | Backend search wrapper for Apollo API |
| `enrich-queue-emails` | Enriches queue contacts via Apollo |

### GitHub Actions Workflow (`lbd-prospecting.yml`)
| Schedule | Phase | What runs |
|----------|-------|-----------|
| 07:00 SAST daily | Phase 1 | `web-scraper-leads`, `auto-outreach` |
| 09:05 + 15:05 SAST | Outreach | `auto-outreach` (additional runs) |
| Every 30 min (06:00-18:00) | Nurture | `process-diagnostic-nurture`, `lac-follow-up`, `process-follow-up-sequences` |
| Every 4 hours | Phase 4 | Reply monitoring, `gmail-reply-classifier` |
| 09:00 + 18:00 SAST | Health | `system-heartbeat` (emails Kevin on issues) |
| 09:30 SAST daily | Agent Health | Agent Health Check (Python agent in ~/lbd-agents/) — validates all agents are running and responsive |
| 20:30 SAST daily | Phase 6 | Evening dashboard to Slack |
| Sunday 19:00 SAST | Weekly | Summary report |

### n8n Workflows
- Ollama scoring + Apollo enrichment pipeline
- Results sent to `ruflo-update-lead` function
- Classifications: `ruflo_path`, `buying_intent_score`, `buyer_type`

### Lead Sources
- **Apollo.io** — Primary prospecting source (API search + sequences)
- **Web Scraper** — Firecrawl-powered company/contact discovery
- **Vibe Prospecting** — Active lead source, connected via MCP for enrichment and prospect matching
- **Buying Signal Hunter** — Uses Apollo `api_search` endpoint + Firecrawl for signal detection (fixed: no longer uses Google scraping)
- **Contract Scraper** — Firecrawl scrapes job boards for leadership development contract opportunities
- **Google Ads** — Paid leads via LAC Diagnostic funnel

## Key Database Tables
- `warm_outreach_queue` — main prospect queue (source_keyword tracks origin)
- `apollo_sequence_tracking` — Apollo sequence engagement data
- `apollo_sequence_templates` — email templates synced to Apollo
- `pipeline_deals` — CRM pipeline
- `prospect_outreach` — sent email log
- `leader_as_coach_assessments` — LAC diagnostic completions
- `admin_settings` — campaign config (booking_link, campaign_mode)
- `conversion_snapshots` — point-in-time snapshots of funnel conversion metrics
- `outreach_insights` — aggregated outreach performance data (open rates, reply rates, template effectiveness)

## Email Configuration
- **From**: `Kevin Britz <hello@leadershipbydesign.co>`
- **Reply-to**: `hello@leadershipbydesign.co` (forwards to kevin@kevinbritz.com)
- **Provider**: Resend
- **Cold email style**: Under 80 words, no corporate language, no flattery, written as Kevin (first person "I")
- **A/B template variants**: `problem-pattern` (pain-point opener), `question-hook` (curiosity question), `stat-lead` (data-driven opener) — auto-outreach rotates between these

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

## Google Ads Integration
- GTM conversion tracking v4 live
- Flow: Google Ad click → LAC Diagnostic → Conversion fires back to Google → Agents prioritise lead (score 95) → 2-min fast nurture → PAID LEAD Slack alert → Call
- Paid leads get highest priority in outreach queue

## LinkedIn Automation (~/lbd-agents/)
- Direct LinkedIn REST API posting (no Zapier)
- Schedule: Sun–Thu, random time 06:30–08:30 SAST
- Content pipeline: pre-written posts in `data/linkedin_posts_mar_apr_2026.md`
- Tracking: `data/linkedin_posted.json`
- Token expires ~60 days from creation (needs refresh mechanism)

## Contract Scraper (~/contract-scraper/)
- Firecrawl scrapes 30+ job boards + Google search queries
- Ollama/Mistral classifies results locally
- Posts leads to Slack, saves to `results.json`
- Recency filter: only jobs posted within 7 days
- URL validation: rejects dead links, listing pages, article URLs

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
- Auto-outreach uses `claude-sonnet-4-6-20250610` — do not downgrade
- System heartbeat emails kevin@kevinbritz.com on any detected issues
- LinkedIn posts go out Sun–Thu only, never Friday/Saturday
- When leads reply, agents alert and step back — Kevin handles all direct conversations personally
- After fixing any Supabase edge function, push to GitHub and tell user to redeploy via Lovable

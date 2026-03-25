# n8n Workflows — Leadership by Design

Claude Connector + Ollama pipeline replacing Apollo. Two workflows that find, score, and nurture leads at 98% lower cost.

## Workflows

### 1. Leadership Diagnostic (`leadership-diagnostic-workflow.json`)

**Purpose:** Proactive prospecting — finds FSI companies showing leadership pain signals, scores them, generates emails in Kevin's voice.

**10-node pipeline:**

| Node | Name | Type | Cost |
|------|------|------|------|
| 1 | Claude Connector Finder | Claude API | ~R0.50/10 prospects |
| 2 | Parse Prospects to Rows | Code | R0 |
| 3 | Filter HOT Prospects | Filter (score 7+) | R0 |
| 4 | Ollama Lead Scoring | Ollama local | R0 |
| 5 | Ollama Email Generation | Ollama local | R0 |
| 6 | Claude Email Polish | Claude API (optional) | R0.05/email |
| 7 | Supabase Insert | `warm_outreach_queue` | R0 |
| 8 | Slack Alert | #leads-and-signups | R0 |
| 9 | Gmail Send | Gmail API (disabled) | R0 |
| 10 | Dashboard Update | `pipeline_dashboard` | R0 |

**Total cost:** ~R1 per 10 prospects (vs R50 with Apollo)

### 2. Contact Form Lead Scoring (`contact-form-lead-scoring.json`)

**Purpose:** Reactive lead handling — scores inbound contact form submissions and routes VIP vs nurture.

**11-node pipeline with VIP split:**

| Node | Name | Type | Cost |
|------|------|------|------|
| 1 | Contact Form Webhook | Webhook trigger | R0 |
| 2 | Validate & Enrich | Code (signal detection) | R0 |
| 3 | Ollama Lead Scoring | Ollama local (ICP rubric) | R0 |
| 4 | Merge Scoring Data | Code (VIP threshold) | R0 |
| 5 | Supabase Insert | `contact_form_submissions` | R0 |
| 6 | VIP Router | If (score >= 15) | R0 |
| 7 | VIP Slack Alert | #leads-and-signups | R0 |
| 8 | VIP Email Generation | Ollama local (Kevin's voice) | R0 |
| 9 | VIP Outreach Queue | `warm_outreach_queue` | R0 |
| 10 | Nurture Sequence | `diagnostic_nurture_sequences` | R0 |
| 11 | Nurture Slack Notify | #leads-and-signups | R0 |

**VIP threshold:** Score >= 15 (lowered from 20)

## Environment Variables Required

```bash
# Anthropic API (for Claude Connector Finder + Email Polish)
ANTHROPIC_API_KEY=sk-...

# Supabase
SUPABASE_URL=https://fdtlljyfjdlrymfeguoa.supabase.co
SUPABASE_ANON_KEY=eyJ...

# Gmail (OAuth2 for email sending)
GMAIL_AUTH=your_gmail_oauth_token

# Slack
SLACK_WEBHOOK_LEADS=https://hooks.slack.com/services/T.../B.../xxxxx

# Ollama (local LLM)
OLLAMA_HOST=http://localhost:11434
```

## Import into n8n

1. Open n8n UI (or Ruflo at localhost:3000)
2. Click **Import Workflow**
3. Select `leadership-diagnostic-workflow.json`
4. Repeat for `contact-form-lead-scoring.json`
5. Configure credentials (Anthropic API key, Supabase keys, Slack webhook, Gmail OAuth)
6. Test each workflow manually first

## Supabase Tables Used

- `warm_outreach_queue` — Stores prospect + email drafts (both workflows)
- `contact_form_submissions` — Scored contact form data (workflow 2)
- `diagnostic_nurture_sequences` — Nurture drip for non-VIP leads (workflow 2)
- `pipeline_dashboard` — Metrics view (workflow 1)

## Cost Comparison

| | Apollo (OLD) | Claude Connector (NEW) |
|---|---|---|
| Find 10 prospects | R50 | R0.50 |
| Score 10 prospects | Basic | R0 (Ollama) |
| Generate 10 emails | Manual | R0 (Ollama) |
| Polish emails | Manual | R0.05 (optional) |
| **Monthly (50/day)** | **R1,500** | **R30** |

## Key Configuration

- **VIP threshold:** `lead_score >= 15` (lowered from 20)
- **HOT filter:** `os_readiness_score >= 7`
- **Ollama model:** `llama3.3:70b`
- **Claude model:** `claude-sonnet-4-20250514`
- **Gmail Send:** Disabled by default (Node 9 in workflow 1) — requires manual approval via Slack

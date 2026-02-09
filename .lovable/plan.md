
# Prospecting System Upgrade: Automated Lead Warming & Conversion

## Overview

This upgrade transforms the existing prospecting system from a "discover and cold email" approach into a sophisticated "discover, warm, engage, and convert" pipeline with automated multi-touch sequences, diagnostic funnel integration, and comprehensive analytics.

## Current System Analysis

The existing system includes:
- **Discovery Pipeline** (`find-companies`): Uses Gemini AI to identify 8-10 companies per industry
- **Deep Research** (`firecrawl-company-research`): Scrapes websites and uses Claude to extract intelligence
- **Prospect Scoring** (`prospectScoring.ts`): Traffic light system (Hot 60+, Warm 35-59, Cool <35)
- **Outreach Composer**: Manual email sending via Resend with POPIA compliance
- **Automation Pipeline** (`auto-prospect-pipeline`): Daily discovery at 8:00 AM SAST via pg_cron
- **Database**: `prospect_companies`, `prospect_outreach`, `prospecting_runs`, `prospecting_config`

## Upgrade Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        DISCOVERY LAYER (8:00 AM)                        │
│  find-companies → firecrawl-company-research → prospect_companies       │
│  (Enhanced: Now generates industry insights + recommended diagnostics)  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     SEQUENCE ENGINE (9:00 AM Daily)                     │
│  process-follow-up-sequences                                            │
│  • Selects template by prospect score (Hot/Warm/Cool)                   │
│  • Schedules Step 1-4 follow-ups (Day 0, 3, 7, 14)                     │
│  • Rate limiting: 10 new outreach + 15 follow-ups/day                  │
│  • Smart scheduling: Tue-Thu, 8-10 AM only                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     ENGAGEMENT TRACKING                                 │
│  • UTM-tagged diagnostic links in all emails                            │
│  • Prospect-to-diagnostic matching on submission                        │
│  • Status updates: researched → contacted → engaged → replied → converted│
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     DAILY DIGEST (9:30 AM)                              │
│  send-daily-digest                                                      │
│  • New prospects discovered                                             │
│  • Follow-ups sent                                                      │
│  • Engaged/replied prospects                                            │
│  • Top 3 hot leads ready for outreach                                  │
│  • Weekly funnel stats                                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Database Schema Changes

### New Table: `prospect_sequences`

Tracks the multi-step email sequence for each prospect.

```sql
CREATE TABLE prospect_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES prospect_companies(id) ON DELETE CASCADE,
  sequence_step INTEGER DEFAULT 1,
  next_send_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  paused_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Status values: active, paused, completed, replied, unsubscribed, engaged
-- RLS policies for admin-only access
```

### Update: `prospect_outreach` Table

Add columns to track sequence steps and templates:

```sql
ALTER TABLE prospect_outreach 
  ADD COLUMN sequence_step INTEGER DEFAULT 1,
  ADD COLUMN template_used TEXT;
```

### Update: `prospect_companies` Table

Add columns for enhanced AI insights:

```sql
ALTER TABLE prospect_companies 
  ADD COLUMN industry_insight TEXT,
  ADD COLUMN recommended_diagnostic TEXT,
  ADD COLUMN recommended_product TEXT,
  ADD COLUMN engagement_source TEXT,
  ADD COLUMN engaged_at TIMESTAMPTZ;
```

---

## Phase 2: Email Template System

### Template Selection Logic

Based on prospect quality score:
- **Hot Lead (60+)**: Direct, confident approach
- **Warm Lead (35-59)**: Value-first with diagnostic link
- **Cool Lead (<35)**: Curiosity-based industry insight

### 4-Step Sequence Templates

| Step | Timing | Subject Pattern | Purpose |
|------|--------|-----------------|---------|
| 1 | Day 0 | Score-based template | Initial outreach |
| 2 | Day 3 | "Re: [Original]" | Simple follow-up |
| 3 | Day 7 | "A resource for [Company]" | Value-add with diagnostic |
| 4 | Day 14 | "Last note from me" | Door-open close |

All emails include:
- UTM tracking: `?utm_source=outreach&utm_medium=email&utm_campaign=sequence&utm_content=prospect_[id]`
- SHIFT Diagnostic link
- POPIA-compliant unsubscribe

---

## Phase 3: Edge Functions

### 1. `process-follow-up-sequences` (New)

Scheduled daily at 9:00 AM SAST via pg_cron.

**Responsibilities:**
- Query all `prospect_sequences` where `status = 'active'` and `next_send_at <= NOW()`
- For each sequence, select the appropriate template based on step and score
- Send email via Resend
- Update sequence step and schedule next send
- Apply rate limiting (max 15 follow-ups/day)
- Smart scheduling: only send Tue-Thu, 8-10 AM

**Flow:**
```text
1. Fetch active sequences due for sending
2. Group by step (1, 2, 3, 4)
3. Apply daily rate limit (15 max)
4. For each:
   a. Load prospect data
   b. Select template by step + score
   c. Personalise with company data
   d. Send via Resend
   e. Record in prospect_outreach
   f. Update sequence (step++, next_send_at)
   g. Mark completed after step 4
```

### 2. `send-prospect-outreach` (Enhance)

Update existing function to:
- Accept `sequence_step` and `template_used` parameters
- Auto-create sequence record when step 1 is sent
- Schedule follow-up steps automatically

### 3. `send-daily-digest` (New)

Scheduled daily at 9:30 AM SAST via pg_cron.

**Contents:**
- New prospects discovered today
- Follow-ups sent today by step
- Engaged prospects (clicked diagnostic)
- Replied prospects
- Weekly funnel stats
- Top 3 hot leads not yet contacted

**Recipients:** kevin@kevinbritz.com, lauren@kevinbritz.com

### 4. `firecrawl-company-research` (Enhance)

Update AI prompt to also extract:
- `industry_insight`: One industry-specific observation for email personalisation
- `recommended_diagnostic`: Which diagnostic fits this company (SHIFT, Values Blueprint, etc.)
- `recommended_product`: Which workshop/product is most relevant

---

## Phase 4: Diagnostic Funnel Integration

### UTM Tracking in Emails

All diagnostic links include UTM parameters:
```
https://leadershipbydesign.co/shift-diagnostic?utm_source=outreach&utm_medium=email&utm_campaign=prospect_[prospect_id]
```

### Prospect-Diagnostic Matching

When a diagnostic is submitted:
1. Check if `utm_campaign` matches pattern `prospect_[uuid]`
2. Extract prospect ID from UTM
3. Update prospect record:
   - `status = 'engaged'`
   - `engaged_at = NOW()`
   - `engagement_source = 'shift_diagnostic'`
4. Update sequence: `status = 'engaged'`
5. Send hot notification to Kevin

### Implementation Location

Modify the diagnostic submission handlers (`ShiftDiagnostic.tsx`, etc.) to:
- Parse UTM parameters on results page
- Call new `check-prospect-engagement` edge function
- Trigger notification if match found

---

## Phase 5: Dashboard Enhancements

### Pipeline Funnel Visualization

New component showing:
```text
Discovered → Researched → Contacted → Engaged → Replied → Converted
    42          38           24          8          4          2
         90%         63%         33%         50%        50%
```

### Sequence Status View

New tab in Marketing Dashboard showing:
- All active sequences
- Current step (1-4)
- Next scheduled send date
- Quick actions: Pause, Skip, Advance

### Meeting Logger

When prospect status = 'replied', show form:
- Meeting date/time
- Notes
- Outcome dropdown (Converted, Not Interested, Follow Up Later)

---

## Phase 6: Smart Scheduling & Rate Limiting

### Timing Configuration

| Task | Time (SAST) | Day Restriction |
|------|-------------|-----------------|
| Discovery Pipeline | 8:00 AM | Daily |
| Follow-up Sequences | 9:00 AM | Daily (sends only Tue-Thu) |
| Daily Digest | 9:30 AM | Weekdays only |
| New Outreach Emails | 8-10 AM | Tue-Thu only |

### Rate Limits (POPIA Compliance)

- Max 10 new outreach emails per day
- Max 15 follow-up emails per day
- Queue overflow for next business day

### Deliverability

- 2-second delay between sends
- Different subject lines per step
- Plain-text alternative for all HTML

---

## Phase 7: Enhanced AI Research

### Updated Claude Prompt

The `firecrawl-company-research` prompt will be enhanced to return:

```json
{
  "industry_insight": "Mining companies scaling past 500 employees typically see a 40% drop in frontline supervisor effectiveness due to...",
  "recommended_diagnostic": "shift_diagnostic",
  "recommended_product": "team_workshop",
  ...existing fields
}
```

This data auto-populates in email templates for hyper-personalisation.

---

## Implementation Phases

### Week 1: Core Infrastructure
1. Database migrations (new tables + columns)
2. Update `prospect_outreach` table structure
3. Create `prospect_sequences` with RLS policies
4. Enhance `firecrawl-company-research` with new AI fields

### Week 2: Sequence Engine
1. Build email template constants/utilities
2. Create `process-follow-up-sequences` edge function
3. Update `send-prospect-outreach` to auto-create sequences
4. Set up pg_cron job for 9:00 AM

### Week 3: Engagement & Notifications
1. Create `send-daily-digest` edge function
2. Set up pg_cron for 9:30 AM
3. Add prospect-diagnostic matching logic
4. Create engagement notification handler

### Week 4: Dashboard & Polish
1. Build Pipeline Funnel component
2. Build Sequence Status view
3. Build Meeting Logger component
4. Add rate limiting UI indicators
5. Testing and refinement

---

## Technical Specifications

### New Edge Functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `process-follow-up-sequences` | pg_cron 9:00 AM | Send scheduled follow-ups |
| `send-daily-digest` | pg_cron 9:30 AM | Summary email to Kevin |
| `check-prospect-engagement` | API call | Match diagnostic to prospect |

### New Frontend Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `PipelineFunnel` | Marketing Dashboard | Visual funnel stats |
| `SequenceStatusView` | Marketing Dashboard | Manage active sequences |
| `MeetingLogger` | Prospect detail | Log meeting outcomes |
| `EmailTemplatePreview` | Outreach composer | Preview step templates |

### Database Indexes

```sql
CREATE INDEX idx_sequences_next_send ON prospect_sequences(next_send_at) WHERE status = 'active';
CREATE INDEX idx_sequences_prospect ON prospect_sequences(prospect_id);
CREATE INDEX idx_companies_status ON prospect_companies(status);
CREATE INDEX idx_companies_engaged ON prospect_companies(engaged_at) WHERE engaged_at IS NOT NULL;
```

---

## Success Metrics

After implementation:
- **Discovery to Contact Rate**: Target 80% (from current manual process)
- **Sequence Completion Rate**: Target 90% (all 4 steps sent)
- **Diagnostic Engagement Rate**: Target 5% of contacted prospects
- **Reply Rate**: Target 10% (industry average 1-5%)
- **Time Saved**: ~2 hours/day in manual outreach

This upgrade transforms the prospecting system into a comprehensive lead warming engine that automatically nurtures prospects through a proven sequence while integrating seamlessly with your diagnostic tools.

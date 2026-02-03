
# Lead Prospecting & Research System

## The Strategic Question

You're asking the right question: **How do we proactively find leads rather than just waiting for them to find us?**

Currently, your machine is **inbound-focused** - people find you through:
- Google Ads → Diagnostics → Lead capture
- Lead magnets → Email nurture
- Organic content → Contact form

To "make the machine work hard," we need to add **outbound prospecting** capabilities.

---

## Important: Legal & Ethical Boundaries

### What We CAN Do (Ethical)
| Approach | Description |
|----------|-------------|
| **Company Research** | Scrape company websites to understand their needs, culture, challenges |
| **Industry Intelligence** | Monitor news, trends, company announcements that signal leadership needs |
| **LinkedIn Company Pages** | Research company info (public data) |
| **Job Posting Analysis** | Companies hiring leadership roles = signal they need development |
| **Event Attendee Research** | Research companies attending HR/leadership conferences |

### What We SHOULDN'T Do (Problematic)
| Approach | Why It's Risky |
|----------|----------------|
| **Scraping Personal Emails** | Violates POPIA (SA privacy law), GDPR |
| **LinkedIn Profile Scraping** | Violates LinkedIn ToS, can get banned |
| **Cold Email Lists** | Poor deliverability, reputation damage |
| **Contact Database Purchases** | Often outdated, consent issues |

---

## Recommended: Company Intelligence System

Instead of scraping for individual contacts, we build a **Company Intelligence Engine** that:

1. **Identifies target companies** through signals
2. **Researches their needs** automatically
3. **Generates personalised outreach** for you to send

### How It Works

```
[Company Signal Detected]
        ↓
[Firecrawl: Research Company Website]
        ↓
[AI: Analyze Leadership Challenges]
        ↓
[Generate Personalized Pitch]
        ↓
[Kevin/Lauren: Review & Send]
```

---

## Implementation Plan

### Phase 1: Company Research Tool

**New Tab: "Prospects" in Marketing Dashboard**

| Feature | Description |
|---------|-------------|
| **Company Lookup** | Enter company URL → AI researches & profiles them |
| **Leadership Signal Detection** | Identifies pain points from About pages, careers, news |
| **Personalised Pitch Generator** | Creates custom outreach based on their specific situation |

**Technical Requirements:**
- Connect Firecrawl (already available in workspace)
- Create `prospect_companies` table
- Build `firecrawl-company-research` edge function
- Build `ProspectingTool.tsx` component

### Phase 2: Job Posting Monitor

**Automated Signal Detection:**

| Signal | Interpretation |
|--------|----------------|
| "Hiring Head of People/HR" | Company scaling, needs leadership alignment |
| "Hiring multiple managers" | Growth phase, leadership development needed |
| "Looking for L&D Manager" | Active investment in development |
| "Senior leadership restructure" | Transition period, coaching opportunity |

**How:**
- Daily search via Firecrawl: "site:linkedin.com/jobs leadership development south africa"
- AI analyses job posts for signals
- Queue for review

### Phase 3: News & Event Monitor

| Source | Signals |
|--------|---------|
| **Company News** | Mergers, new CEOs, restructures = coaching needs |
| **Conference Attendees** | HR Summit, Leadership events = engaged buyers |
| **Industry Reports** | Companies mentioned in "Top Employers" etc |

---

## Database Schema

```sql
CREATE TABLE prospect_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  company_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  industry TEXT,
  company_size TEXT,
  
  -- Scraped intelligence
  about_summary TEXT,
  leadership_team JSONB,
  pain_points JSONB,
  opportunity_signals JSONB,
  
  -- AI-generated outreach
  personalised_pitch TEXT,
  suggested_approach TEXT,
  
  -- Workflow
  status TEXT DEFAULT 'researched', -- researched, contacted, responded, converted
  contacted_at TIMESTAMPTZ,
  notes TEXT
);
```

---

## New Components

### ProspectingTool.tsx
- Company URL input
- One-click "Research Company" button
- Displays: Company profile, pain points, pitch

### ProspectList.tsx
- Table of researched companies
- Status tracking (Research → Contact → Response → Conversion)
- Bulk actions

### Edge Function: firecrawl-company-research
- Scrapes company website via Firecrawl
- Sends to AI for analysis
- Returns structured intelligence

---

## Workflow for Kevin

1. **Daily (5 mins):** Check "Prospects" tab for new signals
2. **Research (1 click):** Enter company URL → Get instant intelligence
3. **Review pitch:** AI generates personalised outreach
4. **Send via LinkedIn/Email:** Copy pitch, personalise, send
5. **Track:** Mark as contacted, note responses

---

## What You'll Need

| Requirement | Status |
|-------------|--------|
| **Firecrawl Connector** | Available (needs linking) |
| **AI (Lovable AI)** | Ready (no API key needed) |
| **Database table** | Will create |
| **UI Components** | Will build |

---

## Summary

This transforms your marketing machine from **passive** (waiting for leads) to **active** (finding and researching prospects):

| Current State | Future State |
|---------------|--------------|
| Wait for diagnostic completions | Proactively identify target companies |
| React to contact form submissions | Research companies before reaching out |
| Generic cold outreach | AI-personalised pitches based on research |
| Manual prospecting | Automated signal detection |

All while staying ethical - researching companies, not scraping personal data.

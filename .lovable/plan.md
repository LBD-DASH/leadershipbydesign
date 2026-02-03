

# Google Ads AI Integration for Marketing Engine

## Overview

This plan adds a **Google Ads** tab to the existing Marketing Engine (`/marketing`) that leverages AI to generate optimised ad copy, suggest targeting strategies, and manage ad campaigns - positioning Leadership by Design to drive maximum qualified traffic using the buyer psychology principles already established.

---

## What You'll Get

### 1. AI-Powered Ad Copy Generator
Generate Google Ads (Search, Display, Performance Max) optimised for:
- **Responsive Search Ads**: 15 headlines (30 chars) + 4 descriptions (90 chars)
- **Display Ads**: Headlines, descriptions, and image suggestions
- **Performance Max**: Full asset group with multiple variations

### 2. Audience Targeting Recommendations
AI-generated audience suggestions based on:
- Your services (Executive Coaching, SHIFT, Workshops)
- South African market context
- Buyer personas (Move Toward / Move Away psychology)
- High-intent keywords for leadership development

### 3. Campaign Brief Generator
Create structured campaign briefs ready for Google Ads, including:
- Campaign objectives
- Suggested keywords
- Negative keywords
- Audience signals
- Budget recommendations

---

## Implementation Architecture

```
Marketing Dashboard
├── Generate Tab (existing)
├── Queue Tab (existing)
├── Google Ads Tab (NEW)
│   ├── Ad Copy Generator
│   │   ├── Responsive Search Ads
│   │   ├── Display Ads
│   │   └── Performance Max Assets
│   ├── Audience Suggestions
│   └── Campaign Briefs
└── Analytics Tab (existing)
```

---

## Important: Google Ads API Limitations

### Why Direct API Integration Is Complex

| Requirement | Complexity |
|-------------|------------|
| **Developer Token** | Requires Google Ads Manager account, application process, and approval (can take weeks) |
| **OAuth2 Flow** | Full OAuth consent screen, refresh tokens, user authentication flow |
| **Customer ID** | Requires linking to your actual Google Ads account |
| **API Access Levels** | Test → Basic → Standard progression with usage limits |

### Recommended Approach: Manual Workflow + AI Generation

Rather than direct API integration, we'll build:

1. **AI generates optimised ad copy** using the buyer psychology framework
2. **You copy/paste into Google Ads** (same workflow as social content)
3. **Track campaign performance** manually or via future integration

This approach:
- Works immediately without waiting for API approval
- Follows the same proven pattern as your social content workflow
- Can be upgraded to direct API integration later if needed

---

## Phase 1: Ad Content Generator

### New UI Component: GoogleAdsGenerator

Adds to the Marketing Dashboard as a fourth tab:

| Ad Type | What It Generates |
|---------|-------------------|
| **Responsive Search Ads** | 15 headlines (30 chars each) + 4 descriptions (90 chars each) |
| **Display Ads** | Headlines, descriptions, call-to-action suggestions |
| **Performance Max** | Full asset group: headlines, descriptions, images, audience signals |

### AI Prompt Strategy

The generator will use the buyer psychology framework:

- **Move Toward**: "Become the leader your team needs", "Get clarity in 6 weeks"
- **Move Away**: "Stop making costly leadership mistakes", "Eliminate AI adoption anxiety"
- **Specificity**: Include measurable outcomes (35%, 6 weeks, 90 days)
- **SA Context**: South African market targeting

---

## Phase 2: Audience & Keyword Suggestions

### AI-Generated Targeting Recommendations

| Category | Examples |
|----------|----------|
| **In-Market Audiences** | Business consulting, Executive coaching, Leadership training |
| **Affinity Audiences** | Business professionals, Management decision-makers |
| **Keywords** | "leadership development South Africa", "executive coaching", "team workshops" |
| **Negative Keywords** | "free leadership courses", "leadership quotes", "management books PDF" |

---

## Phase 3: Campaign Brief Generator

### Structured Output for Each Service

When you select "Executive Coaching" as the source:

```
CAMPAIGN BRIEF: Executive Coaching
=====================================
Objective: Lead generation for diagnostic completions
Target CPA: R500-R1000 per qualified lead

HEADLINES (15):
1. "Transform Your Leadership in 90 Days"
2. "Strategic Clarity for Executives"
3. "One-on-One Executive Coaching SA"
... (12 more)

DESCRIPTIONS (4):
1. "Book your free strategy call. Get 2x clarity..."
2. "Most leaders struggle alone. Kevin Britz has..."
... (2 more)

KEYWORDS:
• executive coaching south africa
• leadership development johannesburg
• one on one leadership coaching
...

NEGATIVE KEYWORDS:
• free executive coaching
• leadership courses online free
...

AUDIENCE SIGNALS:
• Job titles: CEO, MD, Director, VP, C-Suite
• Industries: Finance, Professional Services, Tech
• Behaviours: Business consulting, Executive education
```

---

## Technical Implementation

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/marketing/GoogleAdsGenerator.tsx` | Main ad generator UI component |
| `src/components/marketing/AdPreviewCard.tsx` | Display generated ad previews |
| `src/components/marketing/CampaignBriefModal.tsx` | Campaign brief output display |
| `supabase/functions/generate-google-ads/index.ts` | Edge function for AI generation |

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/MarketingDashboard.tsx` | Add fourth "Google Ads" tab |
| `src/components/marketing/MarketingStats.tsx` | Add Google Ads stats (ad drafts count) |

### Database Schema Update

Add table to store generated Google Ads content:

```sql
CREATE TABLE google_ads_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  campaign_type TEXT NOT NULL, -- search, display, pmax
  service_reference TEXT,
  headlines JSONB NOT NULL,
  descriptions JSONB NOT NULL,
  keywords JSONB,
  negative_keywords JSONB,
  audience_signals JSONB,
  status TEXT DEFAULT 'draft',
  campaign_brief TEXT,
  notes TEXT
);
```

---

## Edge Function: generate-google-ads

### AI Prompt Structure

The edge function will use Lovable AI (no API key required) with specialised prompts:

**For Responsive Search Ads:**
- Generate exactly 15 headlines (≤30 characters each)
- Generate exactly 4 descriptions (≤90 characters each)
- Apply buyer psychology: Move Toward + Move Away
- Include specific outcomes and SA context

**For Display Ads:**
- Short headline (25 chars)
- Long headline (90 chars)
- Description (90 chars)
- Business name suggestion
- CTA options

**For Performance Max:**
- All headline variations
- All description variations
- Audience signal suggestions
- Image concept descriptions

---

## User Workflow

1. **Select Ad Type**: Responsive Search / Display / Performance Max
2. **Choose Service**: Executive Coaching, SHIFT, Workshop, etc.
3. **Generate**: AI creates optimised ad copy
4. **Review & Edit**: Adjust headlines/descriptions as needed
5. **Copy to Clipboard**: One-click copy formatted for Google Ads
6. **Save Campaign Brief**: Store for reference

---

## Future Enhancement: Direct API Integration

If you decide to pursue direct Google Ads API integration later:

### Requirements
1. **Google Ads Manager Account** with API access
2. **Developer Token** (apply via API Center)
3. **OAuth2 Credentials** (client ID, client secret)
4. **Refresh Token** for ongoing access

### Secrets Needed
- `GOOGLE_ADS_DEVELOPER_TOKEN`
- `GOOGLE_ADS_CLIENT_ID`
- `GOOGLE_ADS_CLIENT_SECRET`
- `GOOGLE_ADS_REFRESH_TOKEN`
- `GOOGLE_ADS_CUSTOMER_ID`

This can be added as a Phase 2 enhancement once the manual workflow is proven.

---

## Summary

| Phase | Deliverable | Effort |
|-------|-------------|--------|
| 1 | Google Ads tab + AI generator | Core implementation |
| 2 | Audience/keyword suggestions | Enhances targeting |
| 3 | Campaign brief generator | Ready-to-use output |
| Future | Direct API integration | Optional upgrade |

This approach gives you immediate AI-powered ad generation following the same proven workflow as your social content, with the option to add direct Google Ads API integration later.


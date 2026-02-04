
# Master Lead Generation System Enhancement

## Overview
Transform the existing prospecting tool into a comprehensive B2B lead generation system that can discover companies by criteria, extract contact information, and send personalised outreach emails.

## What You Have Now
- Single URL research via Firecrawl + AI analysis
- Company intelligence extraction (pain points, opportunities)
- Prospect database with status tracking
- Email sending infrastructure via Resend

## What We'll Build

### Phase 1: Enhanced Company Discovery

**Option A: Perplexity Web Search (Recommended)**
We need to connect Perplexity to enable AI-powered company discovery by criteria. This will allow searches like:
- "Engineering companies in Johannesburg with 50-500 employees"
- "Mining companies in Gauteng hiring HR managers"

**Option B: Lovable AI with Web Context**
Use Lovable AI gateway with Firecrawl's search endpoint to find and research companies matching your criteria.

### Phase 2: Batch Lead Search UI

**New "Lead Discovery" Tab** with input fields:
| Field | Example |
|-------|---------|
| Industry | Engineering, Mining, Manufacturing, Tech |
| Location | JHB, Pretoria, Midrand, East/West Rand |
| Company Size | 50-200 (SME), 200-500 (Mid-market) |
| Target Contacts | HR/People, C-Suite, or Both |

**Results Table** displaying:
- Company Name
- Industry Sub-sector
- Website URL (validated)
- Key Contact Name & Role
- Contact Method (email or Contact Us link)
- Location
- "Research" action button (deep-dives using Firecrawl)

### Phase 3: Enhanced Contact Extraction

Update the Firecrawl research function to also extract:
- **Email addresses** (from Contact, Team, or About pages)
- **Physical address** (focus on Gauteng HQ)
- **Key decision makers** by title:
  - HR Focus: Head of HR, People & Culture Manager, Talent Director
  - C-Suite Focus: CEO, MD, COO, Founder
- **LinkedIn profile URLs** (if visible on site)

### Phase 4: Outreach Email System

**New Database Table**: `prospect_outreach`
- Links to prospect_companies
- Stores email content, status, sent_at, opened_at
- Tracks consent/opt-in for POPIA compliance

**New Edge Function**: `send-prospect-outreach`
- Uses Resend to send personalised emails
- Includes unsubscribe link for compliance
- Tracks delivery status

**UI Features**:
- Preview email before sending
- Edit AI-generated pitch
- Batch send with rate limiting
- Status tracking (Sent, Opened, Replied, Bounced)

### Phase 5: POPIA/Compliance Safeguards

- Consent checkbox before batch operations
- Unsubscribe handling
- Email rate limiting (max 50/day recommended)
- Clear sender identification (from hello@leadershipbydesign.co)

---

## Technical Implementation

### Database Changes
```sql
-- Add contact fields to prospect_companies
ALTER TABLE prospect_companies ADD COLUMN contact_email text;
ALTER TABLE prospect_companies ADD COLUMN contact_phone text;
ALTER TABLE prospect_companies ADD COLUMN physical_address text;
ALTER TABLE prospect_companies ADD COLUMN linkedin_url text;

-- New outreach tracking table
CREATE TABLE prospect_outreach (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid REFERENCES prospect_companies(id),
  email_subject text NOT NULL,
  email_body text NOT NULL,
  status text DEFAULT 'draft',
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

### New Edge Functions
1. **`find-companies`** - Uses Perplexity or Lovable AI to search for companies matching criteria
2. **`send-prospect-outreach`** - Sends personalised emails via Resend
3. Updates to **`firecrawl-company-research`** - Extract email addresses and contact details

### Frontend Components
1. **LeadDiscoveryForm** - Industry/location/size filters
2. **CompanySearchResults** - Batch results table with actions
3. **OutreachComposer** - Email preview/edit before sending
4. **OutreachTracker** - Status dashboard for sent emails

---

## Connector Requirement

**Important**: To enable web search by criteria (finding companies without URLs), we need to connect the **Perplexity** connector. This will allow the system to search the web for companies matching your target criteria.

Would you like me to proceed with connecting Perplexity, or should we use a URL-based approach (you provide URLs, we batch research them)?

---

## Summary of Changes

| Component | Action |
|-----------|--------|
| Database | Add contact fields + outreach table |
| `firecrawl-company-research` | Enhanced to extract emails/addresses |
| New: `find-companies` | Perplexity-powered company discovery |
| New: `send-prospect-outreach` | Email sending with tracking |
| ProspectingTool.tsx | Add discovery form + batch operations |
| ProspectList.tsx | Add email action buttons |

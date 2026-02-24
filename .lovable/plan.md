

# Leader as Coach — "Request a Proposal" Funnel Build

## Current State

The `/leader-as-coach` page (LeaderAsCoachSales.tsx) is already a well-built sales page with:
- Problem/solution narrative, 5-phase structure, outcomes, testimonials, facilitator section
- "Request a Proposal" enquiry modal capturing name, company, email, phone, message
- Submissions go to `contact_form_submissions` table
- No header/footer (distraction-free), sticky nav with CTA

The `/leader-as-coach-programme` page (LeaderAsCoachProgramme.tsx) is a more detailed product page with SHIFT framework, assessments, pain points, and personas.

**What's missing for a proper Google Ads funnel:**
1. The enquiry form doesn't capture enough qualifying data (team size, timeline, budget authority)
2. No lead notification email sent to the sales team when someone submits
3. No confirmation email sent to the prospect
4. No UTM tracking on form submissions
5. No post-submission nurture trigger

## The Plan

### 1. Upgrade the Enquiry Form (Both Pages)

Add qualifying fields to both enquiry modals so you can prioritise hot leads:

- **Number of Participants** (dropdown: 5-10, 11-20, 21-50, 50+)
- **Preferred Start Date** (dropdown: Next month, Next quarter, Next 6 months, Just exploring)
- **Role** (text input -- to confirm they're HR/L&D decision-makers)

These fields will be stored in the existing `contact_form_submissions` table using the `message` field (structured as a formatted string) and the `role` field.

### 2. Add UTM Tracking

Both pages will capture UTM parameters from the URL and include them in the database submission. This lets you measure which Google Ads campaigns drive the most proposals.

### 3. Trigger Lead Notification Email

After form submission, invoke the existing `send-contact-email` edge function so Kevin and Lauren get an instant notification with the prospect's details, team size, and timeline -- enabling fast follow-up.

### 4. Trigger Lead Scoring and AI Analysis

After submission, call `processLead()` from the existing lead scoring system to calculate lead temperature and trigger AI analysis, just like the contact form does.

### 5. Send Confirmation Email to Prospect

After form submission, trigger the `send-contact-email` function which already sends a confirmation to the prospect.

## Technical Details

### Modified Files

**`src/pages/LeaderAsCoachSales.tsx`**
- Add `useUtmParams()` hook
- Add qualifying fields to the enquiry form (participants, timeline, role)
- Include UTM params in the `contact_form_submissions` insert
- Call `processLead()` after submission
- Invoke `send-contact-email` edge function after submission

**`src/pages/products/LeaderAsCoachProgramme.tsx`**
- Same changes as above: UTM tracking, qualifying fields, lead processing, email trigger

### No New Files Needed
- The existing `send-contact-email` edge function handles both notification and confirmation
- The existing `processLead()` handles scoring and AI analysis
- The existing `contact_form_submissions` table has all needed columns (including UTM fields, role, lead_score, etc.)

### No Database Changes Needed
- All qualifying data fits into existing columns (`role`, `message`, `company_size` for participants, `urgency` for timeline)

### Funnel Flow

```text
Google Ad ("leader as coach programme SA")
        |
        v
  /leader-as-coach (Sales Landing Page)
        |
        v
  "Request a Proposal" Modal
  (Name, Company, Email, Phone, Role,
   Team Size, Timeline, Message)
        |
        v
  Database Insert + UTM Tracking
  + Lead Score + AI Analysis
  + Email to Kevin & Lauren
  + Confirmation to Prospect
        |
        v
  Kevin sends tailored proposal
        |
        v
  Close the deal
```


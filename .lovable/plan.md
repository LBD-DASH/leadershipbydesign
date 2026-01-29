
# Plan: Complete Lead Scoring Implementation for All Forms

## Summary
Apply the lead scoring system to the remaining forms: the Expert Contact Form and the Contact page form. The Contact form currently uses an edge function for email but lacks database storage for lead tracking.

---

## Current State Analysis

### Forms WITH Lead Scoring (Already Complete)
- Leadership Diagnostic - Saves to `leadership_diagnostic_submissions` with all scoring fields
- Team Diagnostic - Saves to `diagnostic_submissions` with all scoring fields
- SHIFT Diagnostic - Saves to `shift_diagnostic_submissions` with all scoring fields
- Leadership Mistakes (Lead Magnet) - Saves to `lead_magnet_downloads` with scoring fields

### Forms NEEDING Lead Scoring
1. **ExpertContactForm.tsx** - Updates `diagnostic_submissions.contacted_expert` but no lead scoring
2. **Contact.tsx** - Sends email via edge function but no database table to store leads

---

## Implementation Plan

### Step 1: Create `contact_form_submissions` Table
Add a new table to store contact form submissions with lead scoring columns:

```text
contact_form_submissions:
- id (uuid, primary key)
- created_at (timestamp)
- name (text)
- email (text)
- company (text, nullable)
- role (text, nullable)
- service_interest (text, nullable)
- message (text, nullable)
- utm_source, utm_medium, utm_campaign, utm_content, utm_term (text, nullable)
- lead_score (int4, nullable)
- lead_temperature (text, nullable)
- buyer_persona (text, nullable)
- company_size (text, nullable)
- urgency (text, nullable)
- ai_analysis (text, nullable)
- next_action (text, nullable)
- scoring_breakdown (jsonb, nullable)
```

### Step 2: Update Contact.tsx Form
Modify the handleSubmit function to:
1. Calculate lead score using existing `calculateLeadScore()`
2. Save to new `contact_form_submissions` table with all scoring fields
3. Call `processLead()` for AI analysis and notifications
4. Update the AI analysis asynchronously

### Step 3: Update ExpertContactForm.tsx
This form is triggered AFTER someone completes a diagnostic and wants to speak to an expert. This is a high-intent action that should:
1. Calculate lead score (with source as `'expert-consultation'`)
2. Update the type in `LeadData` to include `'expert-consultation'`
3. Call `processLead()` for AI analysis and notification
4. Update the existing diagnostic submission with the lead scoring data

### Step 4: Update Lead Scoring Types
Add `'expert-consultation'` to the source types in `leadScoring.ts` and give it a high multiplier (1.4x) since requesting expert contact is the highest intent action.

---

## Technical Details

### Files to Modify
1. **src/utils/leadScoring.ts** - Add `'expert-consultation'` source type with 1.4x multiplier
2. **src/pages/Contact.tsx** - Add database save with lead scoring, add UTM params support
3. **src/components/diagnostic/ExpertContactForm.tsx** - Add lead scoring and notification processing

### Files to Create
None - all code changes to existing files

### Database Changes
- Create new `contact_form_submissions` table with RLS policies allowing public insert and authenticated read

### Edge Function Changes
None required - existing `processLead()` will handle AI analysis and notifications

---

## Expected Outcome

After implementation:
- Every contact form submission will be scored, stored, and trigger notifications
- Expert consultation requests will be flagged as highest priority leads (hot by default due to 1.4x multiplier)
- All lead data will be visible in the admin dashboard (requires adding the new table to the dashboard)
- Hot/warm leads from contact forms will trigger email notifications to Kevin

---

## Testing Checklist
1. Submit contact form with CEO role - should score as hot lead
2. Click "Speak to Expert" on diagnostic results - should trigger high-priority notification
3. Verify data appears in Supabase tables with all scoring fields populated
4. Confirm email notifications are sent for hot/warm leads

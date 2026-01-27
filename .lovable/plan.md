

# Lead Magnet Implementation Plan
## "The 5 Leadership Mistakes Costing You Your Best Employees" PDF Checklist

---

## Overview

A dedicated landing page at `/leadership-mistakes` offering a high-value PDF checklist in exchange for email capture. The flow is simple: compelling headline, benefit bullets, email form, instant PDF download + email delivery.

---

## User Flow

```text
Landing Page (/leadership-mistakes)
        |
        v
  Lead Capture Form (Name + Email only)
        |
        v
  +---> Instant PDF Download (opens in new tab)
  +---> Confirmation Email with PDF link sent
  +---> Kevin notification email
  +---> Lead saved to database
```

---

## What Will Be Built

### 1. Landing Page (`/pages/LeadershipMistakes.tsx`)

Mobile-first design optimized for social traffic with:

- **Hook headline**: "The 5 Leadership Mistakes Costing You Your Best Employees"
- **Subheadline**: "A 2-minute checklist that reveals why your top performers are quietly looking elsewhere"
- **5 Teaser bullets** (hint at the mistakes without giving away the answer):
  - "The weekly habit that makes employees feel invisible"
  - "Why your 'open door policy' might be backfiring"
  - "The conversation you're avoiding that's costing you trust"
  - ...etc.
- **Simple form**: Just Name + Email (minimal friction)
- **Social proof**: "Join 500+ leaders who've fixed these mistakes"
- **Trust badge**: "Free - No spam - Instant download"

### 2. PDF Checklist Asset

You'll need to create the actual PDF. I recommend:

- **1-2 page PDF** with clean, professional design
- **Format**: Each mistake as a numbered section with:
  - The Mistake
  - Why It Happens
  - The Fix (1-2 sentences)
  - A reflection question
- **CTA at the end**: Link to book a strategy call or take the Leadership Diagnostic

The PDF will be stored in your Supabase storage bucket.

### 3. Database Table (`lead_magnet_downloads`)

New table to track downloads separately from diagnostic submissions:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Lead's name |
| email | text | Lead's email |
| lead_magnet | text | Identifier (e.g., "leadership-mistakes-checklist") |
| downloaded_at | timestamp | When they downloaded |
| utm_source | text | Traffic source |
| utm_medium | text | Traffic medium |
| utm_campaign | text | Campaign name |
| utm_content | text | Ad/link variation |
| utm_term | text | Search term |

### 4. Edge Function (`send-lead-magnet-email`)

New edge function that:

- Sends instant confirmation email with PDF download link
- Sends notification to Kevin with lead details
- Similar structure to your existing `send-welcome-email`

### 5. Route Registration

Add new route in `App.tsx`:

```tsx
<Route path="/leadership-mistakes" element={<LeadershipMistakes />} />
```

---

## Content for the PDF (Suggested)

**The 5 Leadership Mistakes:**

1. **Delegating Tasks, Not Outcomes** - You assign work but don't explain why it matters
2. **Waiting for Annual Reviews to Give Feedback** - Recognition delayed is recognition denied
3. **Solving Problems Your Team Should Own** - Every problem you fix is a development opportunity stolen
4. **Having an "Open Door" But a Closed Mind** - Accessibility without receptivity builds resentment
5. **Focusing on What's Wrong, Not What's Strong** - Your best people want to grow their strengths, not just fix weaknesses

---

## Technical Implementation Details

### Files to Create

1. `src/pages/LeadershipMistakes.tsx` - Landing page component
2. `supabase/functions/send-lead-magnet-email/index.ts` - Email delivery function

### Database Migration

Create new table with proper RLS policies for public insert access.

### Storage

Upload PDF to existing `blog-images` bucket or create a new `lead-magnets` bucket.

### Form Validation

Reuse existing Zod schema patterns from `LeadCaptureGate` component.

---

## Marketing Integration

- **UTM Tracking**: Captures source for TikTok/LinkedIn/etc. attribution
- **Follow-up sequence**: Consider adding these leads to your Priority Insight Waiting List
- **Retargeting**: Page visit can trigger retargeting pixels if added

---

## Timeline

With your existing infrastructure, this can be built and launched in a single session:

1. Create landing page (~15 min)
2. Create database table (~5 min)
3. Create edge function (~10 min)
4. Upload PDF (you create) (~5 min)
5. Test end-to-end (~5 min)

**Total: ~40 minutes of implementation** once you have the PDF content ready.

---

## Next Step

Create the PDF content first. I can help you design the landing page copy and build the entire technical implementation once you're ready.


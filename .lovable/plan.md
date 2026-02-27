

# Warm Lead 2-5-10 Follow-Up Cadence

## What This Builds

An automated accountability system that tracks warm leads through a structured follow-up cadence. Kevin stays the sender -- the system enforces the discipline by sending reminder emails at Day 2, Day 5, and Day 10 if the prospect hasn't responded.

## How It Works

```text
Lead enters as "warm"
       |
       v
+------------------+
| Instant alert    |  --> Kevin gets notification email + Slack
| to Kevin         |
+------------------+
       |
       v
  Kevin sends first reply (marks lead as "contacted")
       |
       v
  Start 2-5-10 timer
       |
  Day 2: No reply? --> Reminder email to Kevin with follow-up template
  Day 5: No reply? --> Reminder email to Kevin
  Day 10: No reply? --> Final reminder email to Kevin
       |
  If prospect replies --> Status = "Engaged", stop sequence
  If call booked     --> Status = "Booked Call", stop sequence
  If Day 10 passes   --> Status = "Dormant", move to nurture
```

## Database Changes

### New Table: `warm_lead_sequences`

Tracks each warm lead through the 2-5-10 cadence:

| Column | Type | Purpose |
|---|---|---|
| id | uuid | Primary key |
| lead_source_table | text | Which table the lead came from (contact_form_submissions, leadership_diagnostic, etc.) |
| lead_source_id | uuid | ID of the original submission |
| lead_name | text | Prospect name |
| lead_email | text | Prospect email |
| lead_company | text | Company name |
| lead_phone | text | Phone if available |
| lead_source_type | text | Source label (contact-form, leadership-diagnostic, etc.) |
| lead_score | integer | Score at time of entry |
| lead_temperature | text | Temperature at entry |
| status | text | Current status: awaiting_first_contact, contacted, day_2_sent, day_5_sent, day_10_sent, engaged, booked_call, dormant |
| contacted_at | timestamptz | When Kevin first reached out |
| next_reminder_at | timestamptz | When next reminder should fire |
| engaged_at | timestamptz | When prospect replied |
| booked_at | timestamptz | When call was booked |
| dormant_at | timestamptz | When moved to dormant |
| notes | text | Kevin's notes |
| created_at | timestamptz | Entry timestamp |
| updated_at | timestamptz | Last update |

RLS: Public INSERT (leads come from edge functions using service role), authenticated SELECT/UPDATE for admin dashboard access.

## Backend Functions

### 1. New: `create-warm-lead-sequence` edge function

Called automatically by `send-lead-notification` when a warm or hot lead is detected.

- Inserts a row into `warm_lead_sequences` with status `awaiting_first_contact`
- Sets `next_reminder_at` to now (immediate -- Kevin should act fast)
- Sends the initial notification (already happens via existing flow)
- Fires Slack notification to `#leads-and-signups`

### 2. New: `process-warm-lead-reminders` edge function

Runs on a cron schedule (every hour, checks for due reminders):

- Queries `warm_lead_sequences` where `next_reminder_at <= now()` and status is in the active states
- For each due reminder:
  - **Status "contacted" + Day 2 due**: Send Kevin a reminder email with a pre-drafted follow-up template. Update status to `day_2_sent`, set next reminder to Day 5.
  - **Status "day_2_sent" + Day 5 due**: Send Kevin reminder. Update to `day_5_sent`, set next to Day 10.
  - **Status "day_5_sent" + Day 10 due**: Send Kevin final reminder. Update to `day_10_sent`. Set next reminder to Day 11 for auto-dormant.
  - **Status "day_10_sent" + Day 11**: Auto-mark as `dormant`. No more reminders.

Reminder emails go to kevin@kevinbritz.com from `alerts@leadershipbydesign.co`, include lead details and a pre-written follow-up template for copy-paste.

### 3. Modify: `send-lead-notification/index.ts`

After sending the existing notification emails, add a call to `create-warm-lead-sequence` for warm and hot leads. Non-blocking, fire-and-forget.

### 4. Cron Job

Schedule `process-warm-lead-reminders` to run every hour using `pg_cron` + `pg_net`. This checks for due reminders and processes them.

## Frontend: Warm Lead Dashboard Widget

### New component: `WarmLeadCadence.tsx`

Added as a new sub-tab or card within the existing Marketing Dashboard Leads tab. Shows:

- **Summary cards**: Total warm leads this month | % responded within 2 hours | Currently in 2-5-10 sequence | Booked calls from warm leads | Conversion rate (warm to booked)
- **Active sequence list**: Each lead with current status, days since contact, next reminder due, and action buttons:
  - "Mark as Contacted" (starts the timer)
  - "Mark as Engaged" (prospect replied -- stops sequence)
  - "Mark as Booked" (call scheduled -- stops sequence)
  - "Add Notes"
- Colour-coded status badges (green = engaged/booked, yellow = in sequence, red = overdue, grey = dormant)

### Integration into Marketing Dashboard

Add a "Cadence" sub-section within the existing "Leads" tab in `SubmissionsPanel.tsx`, or as a new top-level tab. The widget queries `warm_lead_sequences` and provides the live view.

## Files to Create

| File | Purpose |
|---|---|
| `supabase/functions/create-warm-lead-sequence/index.ts` | Creates sequence entry for warm/hot leads |
| `supabase/functions/process-warm-lead-reminders/index.ts` | Hourly cron -- sends Kevin reminders at Day 2/5/10 |
| `src/components/marketing/WarmLeadCadence.tsx` | Dashboard widget showing cadence status + actions |

## Files to Modify

| File | Change |
|---|---|
| `supabase/functions/send-lead-notification/index.ts` | Add call to create-warm-lead-sequence for warm/hot leads |
| `src/pages/MarketingDashboard.tsx` | Add Cadence tab or integrate into Leads tab |

## Reminder Email Templates

**Day 2 reminder to Kevin:**
> Subject: Day 2 Follow-Up Due: [Name] from [Company]
>
> No reply yet from [Name] at [Company].
>
> Here's a ready-to-send follow-up:
>
> ---
> Hi [Name],
>
> Just circling back on my note from Monday. I know things move fast -- if now isn't right, happy to send a short overview you can review when it suits.
>
> Kevin
> ---

**Day 5 reminder to Kevin:**
> Subject: Day 5 — [Name] still hasn't replied
>
> [Name] from [Company] hasn't responded. This is the mid-point nudge.
>
> Consider a different angle: share a relevant case study or diagnostic link.

**Day 10 reminder to Kevin:**
> Subject: Final Follow-Up Due: [Name] from [Company]
>
> This is the last structured touchpoint for [Name]. After this, they move to long-term nurture.
>
> Suggested final message: a brief, no-pressure close with an open door.

## Sequence Logic Summary

- Warm/hot lead detected --> sequence created automatically
- Kevin marks "contacted" --> Day 0 starts, Day 2 reminder scheduled
- Each reminder fires only if status hasn't changed to engaged/booked
- Prospect replies --> Kevin clicks "Engaged" --> sequence stops
- Call booked --> Kevin clicks "Booked" --> sequence stops
- Day 10 passes with no action --> auto-dormant after 24 hours


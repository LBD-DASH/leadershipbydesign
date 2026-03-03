

# Slack Command Center -- Complete Build Plan

## Overview
Build a multi-channel Slack notification system that turns your Slack workspace into a real-time command center for Leadership by Design. Every key business event fires a structured, rich Slack message to the right channel.

## Prerequisites (Already Done)
- Slack bot connector is linked to the project
- `SLACK_API_KEY` and `LOVABLE_API_KEY` are available as environment variables
- Bot has `chat:write`, `chat:write.customize` scopes (confirmed)

## Step 1: Create Your Slack Channels

Before we deploy, you need to create these 4 channels in Slack (the bot can post to any public channel automatically):

| Channel | Purpose |
|---|---|
| `#mission-control` | Critical alerts only: purchases, newsletter sent, traction spikes |
| `#newsletter-engine` | Newsletter lifecycle: drafted, approval needed, approved, rejected, performance |
| `#leads-and-signups` | New subscribers, contact forms, coaching inquiries, diagnostic completions |
| `#system-health` | Errors, failures, technical issues |

Products/revenue events go to `#mission-control` to keep signal density high. Analytics intelligence will be added as a Phase 2 feature.

## Step 2: Create `slack-notify` Edge Function

A single, centralized backend function that all other functions call to post Slack messages.

**How it works:**
- Accepts a JSON payload with `eventType`, `channel`, and `data`
- Formats a rich Slack Block Kit message based on the event type
- Posts via the Slack connector gateway at `https://connector-gateway.lovable.dev/slack/api/chat.postMessage`
- Uses `chat:write.customize` to set contextual bot names and icons per event type

**Supported event types and their channels:**

| Event | Channel | Bot Name | Icon |
|---|---|---|---|
| `new_lead` | `#leads-and-signups` | LBD Lead Alert | Depends on temperature |
| `new_signup` | `#leads-and-signups` | LBD Growth | Envelope emoji |
| `purchase` | `#mission-control` | LBD Revenue | Money emoji |
| `newsletter_generated` | `#newsletter-engine` | LBD Newsletter | Newspaper emoji |
| `newsletter_approved` | `#mission-control` + `#newsletter-engine` | LBD Newsletter | Checkmark emoji |
| `newsletter_rejected` | `#newsletter-engine` | LBD Newsletter | X emoji |
| `traction_alert` | `#mission-control` | LBD Traction | Fire emoji |
| `system_error` | `#system-health` | LBD System | Warning emoji |

**Security:** Internal function-to-function calls use `SUPABASE_SERVICE_ROLE_KEY`. External apps use `x-admin-token` header validation.

**Channel resolution:** The function will look up channel IDs by name using `conversations.list` and cache them in memory for the function's lifecycle.

## Step 3: Wire Into Existing Edge Functions

### 3a. `send-lead-notification` (leads and coaching inquiries)
After sending the existing email alerts, add a non-blocking call to `slack-notify` with:
- Lead name, email, company, score, temperature
- AI recommendation summary
- Source (diagnostic, contact form, coaching inquiry)
- Hot leads also post to `#mission-control`

### 3b. `generate-ai-newsletter` (newsletter drafted)
After saving the draft and sending the approval email to Kevin, fire a `newsletter_generated` event with:
- Topic and subject line
- Direct approve/reject links (same ones in the email)
- Number of sources analyzed

### 3c. `approve-newsletter` (newsletter approved or rejected)
After processing the action, fire either `newsletter_approved` or `newsletter_rejected`:
- Approved: subject, recipient count, sent timestamp -- posts to both `#mission-control` and `#newsletter-engine`
- Rejected: subject only -- posts to `#newsletter-engine`

### 3d. `send-purchase-email` (product sale)
After sending buyer and admin emails, fire a `purchase` event to `#mission-control`:
- Product name, buyer name/email, payment reference
- Timestamp in SAST

### 3e. `ExitIntentPopup.tsx` (new signup from frontend)
After successful subscriber insert, call the `slack-notify` function directly from the frontend via `supabase.functions.invoke()`:
- Subscriber name, email, source
- This goes to `#leads-and-signups`

## Step 4: Newsletter Traction Alerts

Add threshold-based alerting to the `track-newsletter` function:

- After recording each open/click event, count total opens and clicks for that newsletter
- Query `newsletter_sends` for `recipient_count`
- If open rate exceeds 40% and no alert has been sent yet, fire a `traction_alert` to `#mission-control`
- If click count exceeds 50 and no alert has been sent yet, fire a `traction_alert`

**Database change:** Add two boolean columns to `newsletter_sends`:
- `slack_open_alert_sent` (default false)
- `slack_click_alert_sent` (default false)

These prevent duplicate alerts for the same campaign.

## Step 5: Error Handling as Signal

All `slack-notify` calls are non-blocking (fire-and-forget). If Slack posting fails, it logs to console but never breaks the primary business logic (email sending, purchase processing, etc.).

If the `slack-notify` function itself encounters a critical error (missing API keys, gateway down), it posts to `#system-health` as a fallback or simply logs.

## Example Slack Messages

**Hot Lead (Block Kit):**
```text
+----------------------------------+
| HOT LEAD ALERT                   |
| Score: 87/100                    |
|                                  |
| Name:    Sarah van der Berg      |
| Email:   sarah@bigcorp.co.za     |
| Company: BigCorp (Enterprise)    |
| Source:  Leadership Diagnostic   |
|                                  |
| AI: Decision-maker showing       |
| urgency. Call within 2 hours.    |
+----------------------------------+
```

**Newsletter Ready:**
```text
+----------------------------------+
| NEWSLETTER READY FOR APPROVAL    |
|                                  |
| "Why Leaders Are Struggling      |
| with Decision Fatigue"           |
|                                  |
| Sources: 7 analyzed              |
|                                  |
| [ Approve ]  [ Reject ]         |
+----------------------------------+
```

**New Sale:**
```text
+----------------------------------+
| NEW SALE                         |
|                                  |
| Product:   New Manager Kit       |
| Buyer:     John Smith            |
| Amount:    R497                  |
| Reference: PAY-abc123           |
| Time:      14:03 SAST           |
+----------------------------------+
```

**Traction Alert:**
```text
+----------------------------------+
| TRACTION ALERT                   |
|                                  |
| Campaign: "CEOs cite             |
| uncertainty..."                  |
| Open Rate: 48% (target: 40%)    |
| Recipients: 36                   |
+----------------------------------+
```

## Files to Create

| File | Purpose |
|---|---|
| `supabase/functions/slack-notify/index.ts` | Core notification engine |

## Files to Modify

| File | Change |
|---|---|
| `supabase/functions/send-lead-notification/index.ts` | Add Slack call after email send |
| `supabase/functions/generate-ai-newsletter/index.ts` | Add Slack call after draft saved |
| `supabase/functions/approve-newsletter/index.ts` | Add Slack call on approve/reject |
| `supabase/functions/send-purchase-email/index.ts` | Add Slack call after purchase emails |
| `supabase/functions/track-newsletter/index.ts` | Add threshold check + Slack traction alert |
| `src/components/ExitIntentPopup.tsx` | Add Slack call after signup |

## Database Migration

```text
ALTER TABLE newsletter_sends
  ADD COLUMN slack_open_alert_sent boolean DEFAULT false,
  ADD COLUMN slack_click_alert_sent boolean DEFAULT false;
```

## Multi-App Support (Built In)

The `slack-notify` function accepts a `sourceApp` field. Any future app (SHIFT, Startup SA) can POST to it with an `x-admin-token` header and a valid payload to send alerts to the same channels. No additional setup needed.


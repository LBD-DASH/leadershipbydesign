

# Newsletter System: Contact Upload + Monthly Email Campaigns

## What You Get
A new "Newsletter" tab in your Marketing Dashboard where you can:
1. Upload a CSV of contacts (bulk import)
2. Compose and preview a newsletter email
3. Send it to all contacts (or filtered segments) directly from the website

---

## Part 1: Expand the Contact Database

Upgrade the existing `email_subscribers` table to support richer contact data and CSV imports.

**New columns added to `email_subscribers`:**
- `name` (text, optional) -- contact's name for personalization
- `company` (text, optional) -- for segmenting by organization
- `tags` (text array, optional) -- e.g. "imported", "diagnostic-lead", "newsletter"
- `status` (text, default "active") -- active / unsubscribed / bounced
- `unsubscribed_at` (timestamptz, optional)

This keeps all contacts in one place -- both manually uploaded and those captured from the survival pack form, diagnostics, etc.

---

## Part 2: CSV Upload Interface

A new component in the Marketing Dashboard "Newsletter" tab that:
- Accepts a CSV file (drag-and-drop or file picker)
- Previews the first 5 rows so you can confirm column mapping (email, name, company)
- Shows a count of new vs. duplicate contacts
- Imports with a single click, tagging all as `source: "csv-import"` and `tags: ["imported"]`
- Skips duplicates by email (no double entries)

**Supported CSV format:**
```
email,name,company
john@acme.co,John Smith,Acme Corp
jane@startup.io,Jane Doe,StartupCo
```

Minimum requirement: just an `email` column. Name and company are optional.

---

## Part 3: Newsletter Composer

A simple email composer with:
- Subject line input
- Rich text body editor (reusing the existing Quill editor already in the project)
- Preview button (shows how the email will look)
- "Send to All Active Contacts" button with a confirmation dialog showing the recipient count
- Send progress indicator

---

## Part 4: Newsletter Sending (Backend)

A new backend function `send-newsletter` that:
- Receives subject, HTML body, and optional tag filter
- Fetches all active subscribers from the database
- Sends via Resend API in batches (Resend supports batch sending up to 100 per call)
- Logs each send in a new `newsletter_sends` table for tracking

**New `newsletter_sends` table:**
- `id` (UUID)
- `subject` (text)
- `body_html` (text)
- `sent_at` (timestamptz)
- `recipient_count` (integer)
- `sent_by` (text)
- `status` (text: draft / sending / sent / failed)

---

## Part 5: Unsubscribe Handling

Every newsletter email includes an unsubscribe link at the bottom. When clicked:
- Sets the subscriber's `status` to "unsubscribed" and records `unsubscribed_at`
- Shows a simple "You've been unsubscribed" confirmation page
- That contact is automatically excluded from future sends

---

## Technical Summary

| Component | Details |
|-----------|---------|
| Database migration | Add columns to `email_subscribers`; create `newsletter_sends` table |
| New edge function | `send-newsletter` -- batch sends via Resend API |
| New edge function | `unsubscribe` -- handles unsubscribe link clicks |
| UI components | CSV uploader, newsletter composer, send history (all in Marketing Dashboard) |
| Files modified | `src/pages/MarketingDashboard.tsx` (new tab), new components in `src/components/marketing/` |
| Dependencies | No new packages needed (Quill editor + file reader already available) |

## Important Notes

- **Resend free tier** supports 100 emails/day and 3,000/month. If your list is larger, you may need to upgrade your Resend plan.
- **Domain verification**: Emails will send from `hello@leadershipbydesign.co` (already verified in Resend).
- All contact data is protected by row-level security -- only authenticated admin users can view or manage contacts.


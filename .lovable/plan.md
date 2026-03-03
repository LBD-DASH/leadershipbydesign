

## Leader as Coach – Cold Call Prompter v1

Build a standalone internal tool at `/cold-call-prompter` that walks a sales rep through a branching cold call script with database persistence.

### 1. Database

Create table `cold_call_logs` with columns:
- `id` (uuid PK), `created_at` (timestamptz), `rep_name` (text)
- `contact_name`, `company`, `phone`, `email` (all text, nullable)
- `initial_response` (text) — yes / no / voicemail / gatekeeper
- `pitch_outcome` (text, nullable) — book_meeting / need_info / not_interested
- `gatekeeper_outcome` (text, nullable) — transferred / need_email / blocked
- `programme_interest` (text, nullable) — 3-month / 6-month / 10-month
- `objection_reason` (text, nullable) — internal_provider / budget_timing / not_priority / wrong_contact
- `proposed_meeting_date` (date, nullable)
- `follow_up_date` (date, nullable)
- `notes` (text, nullable)

RLS: public INSERT (reps use without auth), SELECT/UPDATE for authenticated users only.

### 2. Page: `src/pages/ColdCallPrompter.tsx`

Single-file state machine. Screens:

```text
CALL_START ──→ YES ──→ PITCH ──→ BOOK_MEETING (form + save)
             │                 ├─→ NEED_INFO (form + save)
             │                 └─→ NOT_INTERESTED (form + save)
             ├─→ NO (form + save)
             ├─→ VOICEMAIL (form + save)
             └─→ GATEKEEPER ──→ TRANSFERRED (back to CALL_START)
                              ├─→ NEED_EMAIL (form + save)
                              └─→ BLOCKED (form + save)
```

Design:
- Minimal white background, no Header/Footer
- Title bar: "Leader as Coach – Cold Call Prompter v1"
- Each screen: Card with "SAY THIS:" in bold, script in large serif/quote text, "PAUSE." as a visual divider, "THEN ASK:" section where applicable
- Large colored buttons (green for positive, amber for neutral, red for negative)
- Forms use existing Input, Textarea, Select components
- On save: insert to `cold_call_logs`, show success with "Start New Call" button

### 3. Route

Add `/cold-call-prompter` to `App.tsx`.

### Technical Details

- Rep name persisted in `localStorage` so they only enter it once
- All form fields use existing UI primitives (Input, Button, Select, Textarea, Card)
- Supabase insert via existing client
- No auth required on the page (internal tool, public INSERT policy)


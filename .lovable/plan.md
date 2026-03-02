

# Click-Optimised Newsletter Formula Rebuild

## The Strategic Shift

Replace the current "educate and inform" newsletter formula with a **conversion psychology** framework designed to create strategic tension and drive qualified leaders to start a conversation with Kevin.

---

## 1. Rewrite the Claude System Prompt (Both Theme-Locked and Generic)

The AI prompt is the engine. The current prompt asks for "insight" and "solution bridge to a product." The new prompt will demand **tension-creating narrative** with a completely different JSON output structure:

**New JSON output format:**

```text
{
  "topic": "The structural leadership flaw identified",
  "subject_line": "Tension-driven, max 7 words, boardroom-level",
  "preview_text": "Complements subject, creates 'is that me?' reaction, under 90 chars",
  "executive_pain": "2-3 sentences. First-person framing. Name a specific scenario a senior leader will recognise as their own reality right now. No generic language. This is a mirror, not content.",
  "hidden_pattern": "2-3 sentences. Expose the deeper structural cause that most people miss. Use language like 'What most boards call X is actually Y.' Position Kevin as seeing what others don't.",
  "boardroom_story": "Maximum 6 lines. A sharp, real-feeling anecdote. Dialogue format preferred. Must end with a twist that makes the reader wonder 'Is that me?'",
  "stakes": "1-2 sentences. Name what happens if this continues. Use words like 'calcify', 'erode', 'fracture'. Create urgency without being alarmist.",
  "invitation": "2-3 sentences. Direct, personal invitation. Not 'learn more' -- instead 'If you recognise this pattern, let's have a strategic conversation. I'll show you exactly where the design is breaking.' Frame what they GET from 30 minutes.",
  "cta_button_text": "7 words max. e.g. 'Book a Leadership Design Conversation'",
  "cta_url": "Full URL -- either contact page or leadership diagnostic"
}
```

**Key prompt rules that change:**
- NO generic motivational language -- every sentence must create tension or authority
- Subject lines must be tension-driven (e.g. "Are You the Bottleneck?", "Your Team Isn't Resisting Change")
- The story section must use dialogue and be max 6 lines
- The invitation must be personal and direct, not product-pushing
- Write as Kevin speaking directly, not "Leadership by Design recommends"

---

## 2. Replace 3 Product Ads with 1 Conversion Block

**Remove entirely:**
- The `PRODUCT_ADS` array (6 products)
- The `selectRelevantAds()` function
- The `buildAdHtml()` function
- All ad insertion points in the HTML template

**Replace with a single conversion block** that uses the AI-generated `cta_button_text` and `cta_url`:

```text
+------------------------------------------+
|  [Dark background block]                 |
|                                          |
|  "If you recognise this pattern..."      |
|  (invitation text from AI)               |
|                                          |
|  [ Book a Leadership Design Conversation ]|
|  (single prominent button)               |
|                                          |
|  "30 minutes. No pitch. Just clarity."   |
+------------------------------------------+
```

One action. One button. No scattered options.

---

## 3. Rebuild the HTML Email Template

The new template structure follows the 6-step conversion flow:

1. **Header** -- same branding (LEADERSHIP BY DESIGN)
2. **Executive Pain** -- italic, left-bordered, mirror-style opening
3. **Hidden Pattern** -- "What most people miss" authority section
4. **Boardroom Story** -- tight dialogue block, visually distinct
5. **Stakes** -- short, bold consequence statement
6. **Conversion Block** -- invitation text + single CTA button
7. **Closing line** -- Kevin's sign-off (personal, not corporate)
8. **Footer** -- unsubscribe link

No product ads interspersed. No "Why This Keeps Happening" subheadings. Clean, narrative flow that builds to one click.

---

## 4. Add a `conversion_insights` Table

New database table to track which themes, subject lines, and pain clusters actually drive clicks and contact form submissions:

```text
conversion_insights
  - id (uuid, PK)
  - newsletter_id (uuid, FK to newsletter_sends)
  - theme (text)
  - pain_cluster (text)
  - subject_line_type (text) -- e.g. "question", "accusation", "revelation"
  - total_opens (int, default 0)
  - total_clicks (int, default 0)
  - contact_submissions (int, default 0)
  - open_rate (numeric)
  - click_rate (numeric)
  - created_at (timestamptz)
```

RLS: admin-only read/write (matches existing pattern).

---

## 5. Update `track-newsletter` to Populate Conversion Insights

When tracking opens/clicks, also update the `conversion_insights` row for that newsletter. This builds a dataset over 6 months showing:
- Which pain clusters drive the most clicks
- Which subject line types win
- Which themes generate contact form submissions

---

## 6. Update the Newsletter Analytics UI

Add a "Conversion" section to `NewsletterAnalytics.tsx` that surfaces:
- Top-performing pain clusters by click rate
- Subject line type comparison
- Theme-to-contact conversion funnel

---

## Files Modified

| File | Change |
|---|---|
| `supabase/functions/generate-ai-newsletter/index.ts` | Complete prompt rewrite, remove ad system, new HTML template, new JSON structure |
| `supabase/functions/track-newsletter/index.ts` | Add conversion_insights population on open/click events |
| `src/components/marketing/NewsletterAnalytics.tsx` | Add conversion insights dashboard section |
| New migration | Create `conversion_insights` table with RLS |

## Files NOT Modified

- `send-newsletter`, `send-weekly-newsletter`, `approve-newsletter` -- these handle delivery, not content generation. They stay as-is.
- `NewsletterComposer.tsx` -- manual compose remains separate from AI generation.
- `NewsletterThemeManager.tsx` -- themes still drive research; the theme system stays.


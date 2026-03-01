

# Upgrade AI Newsletter to Theme-Locked, Pain-Point-Anchored Framework

## What Changes

The current newsletter generator uses a generic "find trending leadership concerns" approach. This upgrade locks every newsletter to a **monthly theme**, a **specific pain point**, and a **product bridge** -- turning it from general thought leadership into a targeted conversion asset.

## 1. Add Monthly Theme Calendar to the Database

Create a new `newsletter_themes` table to store the quarterly theme calendar so it can be managed without code changes:

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `year` | integer | e.g. 2026 |
| `month` | integer | 1-12 |
| `theme` | text | e.g. "Leading Through Change" |
| `pain_point_cluster` | text | Related pain points for AI context |
| `featured_products` | text[] | Product names to prioritize in ads |
| `created_at` | timestamp | Auto |

Pre-seed with the 6-month starter calendar (Jan-Jun) from your framework above.

No RLS needed -- this is admin-only data accessed via service role key in the edge function.

## 2. Rewrite the Claude System Prompt

Replace the current open-ended prompt in `generate-ai-newsletter` with the structured framework:

- **Monthly theme lock**: Function reads the current month's theme from `newsletter_themes` and injects it into the prompt
- **Pain point anchor**: Claude must name a specific, published leader pain point in the first 2 sentences, sourced from the Firecrawl research AND filtered through the monthly theme
- **Solution bridge**: Every newsletter must map Pain Point --> Why It Happens --> Specific LBD Product/Service
- **Strict structure**: Subject line (max 9 words), pre-header, hook, insight, solution, proof/social layer, single CTA
- **Tone**: Authoritative but empathetic, targeting mid-to-senior leaders

The JSON output format stays the same shape but gains new fields: `hook`, `insight_section`, `solution_bridge`, `proof_layer`, and `primary_cta` to match the required structure.

## 3. Update Firecrawl Search Query

Make the search query theme-aware:

```text
Current: "biggest leadership challenge concern trending this week"
New:     "leadership [MONTHLY THEME] challenge concern trending this week"
```

This focuses research results on the month's theme rather than casting a wide net.

## 4. Update Email HTML Template

Restructure the email body to match the new format:
- Hook section (2-3 sentences, pain point scenario)
- Insight section (3-4 sentences, why it persists, tied to theme)
- Solution section (3-4 sentences, named LBD product/programme)
- Proof/social layer (stat or outcome reference)
- Single clear CTA (diagnostic, programme page, or booking)
- Product ads remain as soft placements between sections

## 5. Fallback Behavior

If no theme is configured for the current month, the function falls back to the existing generic approach so newsletters never fail to generate.

## Files to Modify

| File | Change |
|---|---|
| `supabase/functions/generate-ai-newsletter/index.ts` | Theme lookup, new Claude prompt, updated HTML template, theme-aware search query |

## Database Migration

One new table (`newsletter_themes`) with starter data seeded for Jan-Jun.

## What Stays the Same

- Approval workflow (token-based approve/reject)
- Resend email delivery
- Slack notifications
- Product ad selection logic (enhanced with theme's `featured_products`)
- Schedule (Mon/Thu generation, Tue/Fri send)
- All existing edge functions and frontend code


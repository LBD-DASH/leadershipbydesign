

# Fix: Newsletter Generation Failing Due to Invalid Claude Model

## Problem
The `generate-ai-newsletter` function has been silently failing since March 19. The cron jobs fire twice a week (Monday + Thursday at 06:00 UTC) and the HTTP calls succeed, but the function errors internally because it uses the invalid model `claude-sonnet-4-20250514` on line 169.

This is the exact same issue that broke the lead analysis — same bad model ID.

## Fix (1 file, 1 line)

**File: `supabase/functions/generate-ai-newsletter/index.ts`**

Line 169: Change `claude-sonnet-4-20250514` → `claude-3-5-sonnet-20241022`

That's it. No other changes needed. The cron schedule, approval flow, Slack notifications, and rewrite loop are all working — they just never get triggered because the generation step crashes before producing a draft.

## After Deploy

The next scheduled run is Thursday March 26 at 06:00 UTC. To avoid waiting, I'll also trigger a manual generation immediately so you get a draft in #newsletter-engine today.


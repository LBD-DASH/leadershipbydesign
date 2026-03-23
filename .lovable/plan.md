

# Fix: Restore AI Analysis in Lead Notification Emails

## Problem
The `analyze-lead` edge function calls the Anthropic API with model `claude-sonnet-4-20250514`, which is returning errors. The function catches the error and returns `"AI analysis unavailable"`, so every lead notification email arrives without the Buyer Profile, Pain Points, Recommended Approach, and Opening Line sections that you used to see.

## Root Cause
Model ID `claude-sonnet-4-20250514` is either deprecated or was never valid. The Anthropic API returns an error, the catch block fires, and the fallback text propagates through to the email.

## Fix (1 file change)

**File: `supabase/functions/analyze-lead/index.ts`**

1. Switch the model from `claude-sonnet-4-20250514` to `claude-3-5-sonnet-20241022` (stable, confirmed working)
2. Add better error logging so future failures surface the actual Anthropic error message
3. Increase `max_tokens` from 500 to 800 — the 4-section analysis (Buyer Profile, Pain Points, Recommended Approach, Opening Line) was sometimes getting truncated at 500

No other files change. The notification email templates already render the AI analysis correctly when it's present — they just need the analysis to actually arrive.

## Technical Detail
- Model change: line 79, `claude-sonnet-4-20250514` → `claude-3-5-sonnet-20241022`
- Token increase: line 80, `500` → `800`
- Deploy the updated function

## Expected Result
Next lead notification email will include the full AI analysis with Buyer Profile, Pain Points, Recommended Approach, and Opening Line — exactly like it used to.


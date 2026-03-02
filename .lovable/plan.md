

# Leader as Coach Page — 5-Second Audit Fixes

## What Changes

Three targeted fixes to the hero section based on the UX audit: clarify the buyer, fix the invisible CTA, and add a micro-promise to the booking button.

---

## 1. Add Buyer Identity Line Above the Headline

Add a clear, explicit line above the h1 that names the buyer:

**"For HR Leaders & L&D Managers in Financial Services"**

This will be a small, styled text element sitting between the tag pills and the headline, so a first-time visitor instantly knows who the page is for.

---

## 2. Fix the Invisible "Request a Proposal" Button

The secondary CTA uses `variant="outline"` with `border-white/30 text-primary-foreground` — which renders as near-invisible white-on-white in both hero locations (lines 225-233 and 523-531).

**Fix**: Replace the styling with a solid, contrasting treatment:
- Remove `variant="outline"` 
- Apply `bg-white/15 backdrop-blur-sm text-white border border-white/40 hover:bg-white/25`

This makes it clearly visible as a secondary option while keeping the primary CTA dominant. Applied to both the hero and final CTA section.

---

## 3. Reframe the CTA with a Micro-Promise

Change the CTA text from:

```
"Book a 30-Minute Manager Capability Strategy Call"
```

To:

```
"Book a Free 30-Min Call — We'll Map Your Gaps"
```

And add a one-line sub-text below the CTA buttons in the hero:

**"In 30 minutes, we'll assess your manager capability gaps and show you what's achievable in 90 days."**

This answers the "what do I get?" question immediately.

Also update the calendar dialog description to match: *"In 30 minutes, we'll map your manager capability gaps and show you what's possible in 90 days. No commitment required."*

---

## Files Modified

| File | Change |
|---|---|
| `src/pages/LeaderAsCoachSales.tsx` | All three fixes: buyer line, button styling, CTA text + micro-promise |

No database or backend changes needed.


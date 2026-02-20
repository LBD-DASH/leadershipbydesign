

# 15-Day Revenue Acceleration Plan

## The Strategy
Your analytics show 990 clicks on `/new-manager-kit` from YouTube traffic, 93% mobile, with an 81% bounce rate. The fastest path to revenue is:

1. A **R147 impulse-buy micro-product** ("New Manager Survival Pack") that captures bounced traffic
2. An **order bump checkbox** on the existing New Manager Kit checkout to increase average order value
3. An **exit-intent offer** on the New Manager Kit page pointing to the cheaper Survival Pack

---

## What Gets Built

### 1. New Manager Survival Pack (R147 micro-product)
A new standalone sales page at `/survival-pack` -- ultra-simple, one-scroll, mobile-first.

**Contents sold:**
- 3 plug-and-play conversation scripts (First 1:1, Addressing Underperformance, Running Your First Team Meeting)
- 1 printable Team Expectations Sheet
- 1 bonus: "Calm Authority Reset" audio mention (links to bespoke meditations)

**Page structure (single scroll, no sections to get lost in):**
- Compact hero: "3 Scripts. R147. Use Today." with immediate CTA
- 3 bullet cards showing exactly what they get
- Social proof bar (same 11 years / 3,000+ orgs)
- Single CTA again
- Footer

**Pricing:** R147 (approx $8-9 international -- true impulse territory)

### 2. Order Bump on New Manager Kit Checkout
Modify the existing `CheckoutModal` to support an optional order bump:
- A checkbox below the email field: "Add the Manager Scripts Vault for R147"
- When checked, the total increases from R497 to R644
- The success page handles delivery of both products

### 3. Exit-Intent Downsell on New Manager Kit Page
A simple dismissible banner that appears when the user scrolls back up (mobile-friendly alternative to exit-intent):
- "Not ready for the full kit? Get 3 scripts for R147"
- Links to `/survival-pack`

---

## Technical Details

### New files to create:
- `src/pages/products/SurvivalPack.tsx` -- the micro-product sales page
- `src/pages/products/SurvivalPackSuccess.tsx` -- success/download page

### Files to modify:
- `src/App.tsx` -- add `/survival-pack` and `/survival-pack/success` routes
- `src/components/products/CheckoutModal.tsx` -- add optional `orderBump` prop with title, price, and description; render a checkbox when provided; adjust the total amount sent to Paystack
- `src/pages/products/NewManagerKit.tsx` -- pass `orderBump` config to CheckoutModal; add scroll-direction-based downsell banner
- `src/pages/Products.tsx` -- add Survival Pack to the Entry tier product grid

### No new dependencies required.
### No database changes needed (uses existing Paystack checkout flow).

### Order bump implementation detail:
The `CheckoutModal` will accept a new optional prop:
```text
orderBump?: {
  title: string;
  price: number;
  priceDisplay: string;
  description: string;
}
```
When checked, the `amount` sent to Paystack becomes `(basePrice + bumpPrice) * 100`. The success page URL will include a `&bump=true` query param so the success page knows to show both downloads.

### Downsell banner logic:
A lightweight scroll-direction detector (no new dependencies). When the user scrolls up past the hero section on mobile, a sticky bottom banner fades in with the R147 offer. Dismissible with an X button, and uses `sessionStorage` so it only shows once per visit.

---

## Priority Order
1. Build the Survival Pack page + success page (Day 1-2 effort)
2. Add the order bump to CheckoutModal (Day 2-3)
3. Wire up the downsell banner on New Manager Kit (Day 3)
4. Add to Products catalog (Day 3)

This gets you a frictionless R147 entry product for your existing YouTube traffic, plus increased AOV on every R497 sale, with zero new traffic needed.


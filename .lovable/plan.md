

# New Manager Product Funnel - Complete Build

## Overview

Build a complete marketing funnel for the New Manager product line, optimized for Google Ads traffic from the SA market. The funnel converts cold search traffic through a value ladder: Free Lead Magnet -> R147 -> R497 -> R597 -> R2,497.

## What Already Exists

- Product pages: Survival Pack (R147), New Manager Kit (R497), Difficult Conversations Playbook (R247), Bundle (R597)
- Paystack checkout via CheckoutModal
- Scroll-triggered downsell banner on New Manager Kit page (R497 -> R147)
- "First 90 Days Checklist" email capture on Survival Pack page (stores to email_subscribers)
- Success pages with basic download + upsell (Survival Pack -> Kit)
- Lead scoring and AI analysis on diagnostics

## What's Missing (The Gaps)

1. **No dedicated Google Ads landing page** - Current product pages have navigation/distractions that kill paid traffic conversion
2. **No post-purchase email sequences** - Buyers get a download page but no follow-up emails nudging them up the value ladder
3. **Success pages don't cross-sell effectively** - Kit success page has zero upsell; Bundle success page has zero upsell
4. **Email capture on Survival Pack doesn't send the actual checklist** - It stores the email but the checklist is never delivered
5. **No purchase tracking in the database** - Purchases aren't stored, so you can't segment buyers for email campaigns

## The Plan (5 Parts)

### Part 1: Google Ads Landing Page (`/new-manager-training`)

A stripped-down, distraction-free landing page optimized for paid traffic. No header, no footer, no navigation - just conversion.

**Key elements:**
- Headline matching search intent: "New Manager Training - R497 (Not R17,995)"
- Price comparison table (you vs UCT/Knowledge Academy/GIBS)
- B-BBEE skills development mention (companies must spend 3-6% of payroll)
- Three CTAs: R147 Scripts (impulse), R497 Kit (anchor), R597 Bundle (value)
- Social proof bar (11 years, 4,000+ leaders, 50+ orgs)
- FAQ section addressing common objections
- Exit-intent email capture for the free checklist
- UTM parameter tracking on all CTAs

### Part 2: Purchase Tracking Table

New `product_purchases` database table to track all digital product sales:

- id, email, name, product_name, amount_zar, payment_reference, purchased_at
- utm_source, utm_medium, utm_campaign (for ad attribution)
- upsell_shown, upsell_converted (for funnel analytics)

This enables: segmented email campaigns, purchase history, funnel conversion tracking.

### Part 3: Post-Purchase Email Sequences

New edge function `send-purchase-email` triggered from success pages:

**Survival Pack buyer (R147):**
- Immediate: "Your scripts are ready" + download link
- Day 2: "Did you use your first script?" + tip
- Day 5: "Ready for the complete system?" + R497 Kit offer with R50 discount code

**New Manager Kit buyer (R497):**
- Immediate: "Your kit is ready" + download link
- Day 3: "Start with the Self-Assessment on page 3"
- Day 7: "Save 20% on the Bundle" + Bundle offer (they already have the Kit, offer just the Playbook at a discount)

**Bundle buyer (R597):**
- Immediate: "Your bundle is ready" + download links
- Day 7: "Going deeper" + Leader as Coach Programme preview
- Day 14: "Book a free 15-min strategy call" + calendar link

### Part 4: Upgraded Success Pages

Add strategic upsells to every success page:

**Survival Pack Success** (already has Kit upsell - enhance it):
- Add urgency: "Complete your toolkit - add the Kit for R350 (R147 off since you already have the Scripts)"
- Add countdown or limited-time framing

**New Manager Kit Success:**
- Add Bundle upsell: "Add the Difficult Conversations Playbook for just R100 more" (they paid R497, bundle is R597, so the Playbook becomes R100 vs R247)
- Add Leadership Diagnostic CTA: "See where you stand as a leader - free 5-min assessment"

**Bundle Success:**
- Add Leader as Coach Programme preview
- Add Leadership Diagnostic CTA
- Add "Book a call" CTA for corporate enquiries

### Part 5: Checklist Delivery Fix

The Survival Pack email capture currently stores the email but doesn't deliver the checklist. Fix:
- Trigger `send-download-email` edge function with the checklist PDF link
- Add the subscriber to a "new-manager-funnel" tag for future campaigns

## Technical Details

### New Files
- `src/pages/products/NewManagerTraining.tsx` - Google Ads landing page
- `supabase/functions/send-purchase-email/index.ts` - Post-purchase email sequences

### Modified Files
- `src/App.tsx` - Add route for `/new-manager-training`
- `src/pages/products/NewManagerKitSuccess.tsx` - Add cross-sell CTAs
- `src/pages/products/BundleSuccess.tsx` - Add upsell CTAs
- `src/pages/products/SurvivalPackSuccess.tsx` - Enhanced upsell + trigger purchase email
- `src/pages/products/SurvivalPack.tsx` - Fix checklist delivery to actually send the PDF
- `src/components/products/CheckoutModal.tsx` - Store purchase in database before redirecting

### Database Migration
- Create `product_purchases` table with RLS (public INSERT, authenticated SELECT/UPDATE)

### Funnel Flow Diagram

```text
Google Ads ("new manager training SA")
        |
        v
  /new-manager-training (Landing Page)
   |          |           |
   v          v           v
 R147       R497        R597
 Scripts    Kit         Bundle
   |          |           |
   v          v           v
 Success    Success     Success
 + Upsell   + Upsell    + Upsell
 to R497    to R597     to R2,497
   |          |           |
   v          v           v
 Email      Email       Email
 Sequence   Sequence    Sequence
 (3 emails) (3 emails)  (3 emails)
        \     |      /
         v    v    v
      Leadership Diagnostic (Free)
              |
              v
      Contact / Consultation
      (R15,000+ programmes)
```

### Non-Buyers Path

```text
Visitor lands on /new-manager-training
        |
  Doesn't buy
        |
        v
  Exit-intent popup
  "Get the Free Checklist"
        |
        v
  Email captured -> email_subscribers
  Tag: "new-manager-funnel"
        |
        v
  Checklist PDF emailed immediately
        |
        v
  Day 3: "Most managers fail in the first 90 days" + R147 offer
  Day 7: "Still winging it?" + R497 offer with social proof
```


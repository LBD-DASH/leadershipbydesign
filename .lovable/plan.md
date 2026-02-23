

# Fix Products Page Visibility, Hide Coming Soon, and Enhance Survival Pack

## Overview
Six changes across two pages: fix the invisible Products page, hide unreleased products, and upgrade the Survival Pack sales page with better copy, social proof, a money-back guarantee, and an email capture form.

---

## Change 1: Fix Invisible Sections on /products

**Problem:** The `motion.div` / `motion.section` components use `initial={{ opacity: 0 }}` with `whileInView` animations. The IntersectionObserver isn't firing, so sections stay invisible.

**Fix:** Change all `motion.section` and `motion.div` wrappers on the Products page to use `animate` instead of `whileInView` for above-the-fold content, and ensure `whileInView` sections have `amount: 0` in the viewport config so they trigger immediately when any pixel is visible. Alternatively (simpler and safer): set `initial={{ opacity: 1, y: 0 }}` on all sections so content is always visible regardless of animation state.

**Approach chosen:** Set `initial={{ opacity: 1, y: 0 }}` on all `motion.section` / `motion.div` wrappers (hero, bundle, diagnostic, tier sections, trust bar) to guarantee visibility. Remove `whileInView` props since they're unreliable. This ensures the page is always fully visible.

**Files:** `src/pages/Products.tsx`

---

## Change 2: Hide "Coming Soon" Products on /products

**Problem:** Products like "The Meeting Detox Kit" and "The Delegation Playbook" (and others with `comingSoon: true`) are shown but disabled.

**Fix:** Filter out `comingSoon` products from each tier before rendering. The product data stays in code, just hidden with `.filter(p => !p.comingSoon)`.

**Files:** `src/pages/Products.tsx` -- change the `.map()` calls in the three tier grids to `.filter(p => !p.comingSoon).map(...)`.

---

## Change 3: Change "IMPULSE BUY" Badge to "MOST POPULAR" on /survival-pack

**Fix:** Change the text on line 90 from "IMPULSE BUY" to "MOST POPULAR" and update the emoji from lightning bolt to a star/fire.

**Files:** `src/pages/products/SurvivalPack.tsx`

---

## Change 4: Add Social Proof Testimonials to /survival-pack

**Fix:** Add 3 testimonial cards between the "What's Inside" script cards and the "Also Included" bonuses section. Clean card style with quote marks, italic text, and attribution. Uses the page's existing colour scheme (primary tones, card backgrounds).

**Files:** `src/pages/products/SurvivalPack.tsx`

---

## Change 5: Add Money-Back Guarantee Below CTA Buttons on /survival-pack

**Fix:** Add a subtle guarantee line with a Shield icon below both "GET INSTANT ACCESS" buttons (hero CTA and final CTA). Small, muted text: "100% Money-Back Guarantee -- If these scripts don't help, get a full refund. No questions asked."

**Files:** `src/pages/products/SurvivalPack.tsx`

---

## Change 6: Add Email Capture for Non-Buyers on /survival-pack

**Fix:** Add a new section after the final CTA with:
- Heading: "Not ready yet? Get the free checklist."
- Subheading about the First 90 Days Checklist
- Email input + "Send Me The Checklist" button
- "No spam" disclaimer
- Light grey background for contrast

**Backend:** Create a new `email_subscribers` table with columns: `id` (uuid PK), `email` (text, not null), `source` (text), `created_at` (timestamptz). RLS: public INSERT, authenticated SELECT. The form submits directly to this table via the Supabase client.

**Files:** `src/pages/products/SurvivalPack.tsx`, plus a database migration for the new table.

---

## Technical Summary

| File | Changes |
|------|---------|
| `src/pages/Products.tsx` | Remove opacity:0 initial states from all motion wrappers; filter out comingSoon products |
| `src/pages/products/SurvivalPack.tsx` | Change badge text; add 3 testimonial cards; add guarantee text x2; add email capture section |
| Database migration | Create `email_subscribers` table with public INSERT RLS |




# Phase 1: Authority & Positioning — Adjusted Layout

Kevin's photo (in the CredibilityBlock) will NOT be near the top of the page. It will be placed **after Services**, so visitors first see the hero, Start Here paths, client logos, services — and only then scroll to the credibility block.

## Updated Homepage Section Order

1. Header
2. Hero (updated headline)
3. StartHere
4. ClientLogos
5. **StatsBar** (new — numbers only, no photo)
6. Services
7. **CredibilityBlock** (new — Kevin's photo + bio, placed here, well below the fold)
8. PartnerApps
9. TestimonialSlider
10. FloatingSocial

## All 4 Changes

### 1. Hero Headline Update
**File:** `src/components/Hero.tsx`
Update the h1 text to: "South Africa's Leadership Partner for Organisations That Are Scaling, Transforming, or Leading Through Uncertainty"

### 2. StatsBar (no photo)
**New file:** `src/components/StatsBar.tsx`
Horizontal strip: "11 Years | 750+ Workshops | 4,000+ Leaders Impacted | 50+ Organisations | 6 Proprietary Methodologies"
Placed between ClientLogos and Services — high on the page but photo-free.

### 3. CredibilityBlock (with Kevin's photo — placed LOWER)
**New file:** `src/components/CredibilityBlock.tsx`
Two-column layout with photo, bio, credentials, and "Meet Kevin" CTA.
Placed **after Services** so it's well below the fold.

### 4. Programmes Page StatsBar
**File:** `src/pages/Programmes.tsx`
Add the same StatsBar below the hero section. Add indicative pricing to programme cards.

## Files Summary

| File | Action |
|------|--------|
| `src/components/Hero.tsx` | Update headline text |
| `src/components/StatsBar.tsx` | New — stats strip (no photo) |
| `src/components/CredibilityBlock.tsx` | New — Kevin bio block with photo |
| `src/pages/Index.tsx` | Add StatsBar after ClientLogos; add CredibilityBlock after Services |
| `src/pages/Programmes.tsx` | Add StatsBar; add indicative pricing |

No database changes. No new dependencies.

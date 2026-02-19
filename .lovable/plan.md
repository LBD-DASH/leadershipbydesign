
# Bespoke Mindset Meditations Page + Ready-to-Buy Meditations

## Overview
Create a premium product page at `/bespoke-meditations` with two distinct sections:
1. **Bespoke (Custom) Meditations** -- 3 category cards across the page for custom-made meditation orders (Mindset, Sport, Corporate Executives) at R997
2. **Ready-to-Buy Meditations** -- A separate section below for pre-recorded meditations available for immediate purchase at a lower price point

## Page Structure

### Section 1: Hero
- Headline: "Bespoke Mindset Meditations & Visualisations"
- Subtitle about custom and ready-made audio content
- "Back to Products" link at top

### Section 2: Three Bespoke Category Cards (3-column grid)
Three cards displayed side-by-side on desktop, stacked on mobile:

| Mindset | Sport | Corporate Executives |
|---------|-------|---------------------|
| Millionaire mindset, abundance, personal power, identity transformation | PowerLifters, athletes, competition visualisation, mental edge | Leadership presence, boardroom confidence, high-stakes clarity |

- Each card has an icon, title, description, and bullet points
- Single "Order Bespoke" CTA at R997 opening the CheckoutModal

### Section 3: Ready-to-Buy Meditations
A separate grid section for pre-recorded meditations that people can purchase and download immediately. Initially set up with placeholder cards that can be updated as you share the recordings. Each meditation will have:
- Title, description, duration
- Individual pricing (suggested R197-R397 range -- can be adjusted)
- Its own checkout flow via the shared CheckoutModal
- A database table (`meditation_products`) to manage listings so you can add/edit them easily without code changes

### Section 4: Guarantee + Final CTA

### Success Page
Post-purchase confirmation at `/bespoke-meditations/success` handling both bespoke orders and ready-to-buy downloads.

## Technical Details

**Files to create:**
- `src/pages/products/BespokeMeditations.tsx` -- main page with both sections
- `src/pages/products/BespokeMeditationsSuccess.tsx` -- success/delivery page

**Files to modify:**
- `src/App.tsx` -- add `/bespoke-meditations` and `/bespoke-meditations/success` routes
- `src/pages/Products.tsx` -- add to Premium tier listing

**Database (optional, recommended):**
- Create a `meditation_products` table with columns: `id`, `title`, `description`, `category` (mindset/sport/corporate), `price_zar`, `duration`, `file_url`, `is_active`, `created_at`
- This lets you manage ready-to-buy meditations from the backend without needing code changes each time you add a new recording

**Reused patterns:**
- `CheckoutModal` with `successPath="/bespoke-meditations/success"`
- `useGeoPricing` for regional currency display
- `SEO` component for metadata
- `framer-motion` animations
- Teal design system with premium styling
- 3-column responsive grid for the bespoke cards

**No new dependencies required.**



# New Manager Survival Kit - Premium Sales Landing Page

## Overview

Create a high-converting, Stan Store-style sales page for the digital product "The New Manager Survival Kit: Your First 90 Days". This page will be **unlisted** (not accessible from navigation) and only accessible via direct link at `/new-manager-kit`.

## Technical Approach

### 1. New Page File
**File:** `src/pages/products/NewManagerKit.tsx`

A single, self-contained landing page with all sections specified, using a custom color palette that differs from the main site:

| Element | Color |
|---------|-------|
| Navy (backgrounds) | `#1B2A4A` |
| Gold (accents) | `#C8A864` |
| Cream (backgrounds) | `#F8F6F1` |

### 2. Route Registration
**File:** `src/App.tsx`

Add route `/new-manager-kit` without modifying the Header navigation - keeping it unlisted as requested.

### 3. Page Structure (9 Sections)

```text
1. HERO (Navy bg)
   - Gold badge: "Digital Leadership Product"
   - Headline + subheading
   - 4 feature pills
   - Pricing block (R1,497 crossed → R497 gold)
   - Gold CTA button → #checkout

2. SOCIAL PROOF BAR (White bg)
   - Single line: "11 years • 3,000+ organizations"

3. PROBLEM SECTION (Cream bg)
   - Red X pain points list (6 items)
   - Closing bold statement

4. WHAT'S INSIDE (White bg)
   - 5 numbered module cards with gold left border

5. BONUS SECTION (Navy gradient bg)
   - Gold gift badge
   - Emergency Playbook description

6. WHO IS THIS FOR (Cream bg)
   - 2x2 grid of persona cards

7. GUARANTEE (Soft gold bg)
   - Trust/use-immediately messaging

8. FINAL CTA (Navy bg)
   - Repeat pricing + CTA

9. FOOTER (Navy bg)
   - Simple © line
```

### 4. Design Implementation

**Typography:**
- Headings: `font-serif` (Playfair Display - already loaded)
- Body: `font-sans` (Inter - already loaded)

**Decorative Elements:**
- Subtle geometric accents (thin gold lines, circles) on navy sections
- Generous whitespace between sections
- Smooth scroll behavior with `scroll-behavior: smooth`

**Hover Effects:**
- Module cards: lift with shadow on hover
- CTA buttons: subtle scale/glow effect

**Mobile Responsiveness:**
- Single column stack on mobile
- Adjusted padding/font sizes

### 5. Component Structure

```text
NewManagerKit.tsx
├── SEO component (meta tags for sharing)
├── HeroSection (inline)
├── SocialProofBar (inline)
├── ProblemSection (inline)
├── WhatsInsideSection (inline)
├── BonusSection (inline)
├── WhoIsThisForSection (inline)
├── GuaranteeSection (inline)
├── FinalCTASection (inline)
└── FooterSection (inline - minimal, no links)
```

All sections will be inline in a single file since this is a standalone sales page.

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/products/NewManagerKit.tsx` | Create - full sales page |
| `src/App.tsx` | Modify - add route (no nav changes) |

## Implementation Details

### Hero Section Specifics
- Crossed-out pricing: `<span className="line-through text-white/60">R1,497</span>`
- Large gold price: `text-5xl font-bold text-[#C8A864]`
- CTA: `bg-[#C8A864] hover:bg-[#b89954] text-[#1B2A4A]`

### Module Cards
- Gold left border: `border-l-4 border-[#C8A864]`
- Number styling: Large gold numeral (01, 02, etc.)

### Pain Points
- Red X icons using Lucide `X` with destructive color
- Cream background section

### Mobile Breakpoints
- Stack all grids on `<md`
- Reduce heading sizes
- Full-width buttons

## Future Payment Integration

The CTA currently links to `#checkout`. When ready, this will be replaced with:
- Gumroad embed/link
- Or Stripe checkout session

---

**Summary:** A premium, editorial-style sales page that matches your exact specifications, kept private from navigation, accessible only via direct link. Uses the project's existing font setup with custom brand colors for this product.


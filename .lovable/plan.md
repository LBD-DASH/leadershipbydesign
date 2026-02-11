

# Create Static AI-Readable HTML Pages

## Goal
Create static HTML pages in the `public/` folder that mirror key website content in pure, crawlable HTML. These pages will be immediately readable by NotebookLM, AI crawlers, and any tool that doesn't execute JavaScript.

## Pages to Create

### 1. `public/ai/index.html` — Homepage
Content extracted from Hero, Services, PartnerApps, TestimonialSlider, and ClientLogos components:
- Headline and value proposition
- Core services (SHIFT, Workshops, Contagious Identity Coaching)
- Testimonials with metrics
- Partner apps listing
- Contact/CTA information

### 2. `public/ai/feedback-formula.html` — Feedback Formula Product
Content from FeedbackFormula.tsx:
- Product description and 4-step system overview
- Pain points it solves
- All 5 modules detailed
- Bonus cheat sheet
- Target personas
- Pricing and guarantee

### 3. `public/ai/leader-as-coach.html` — Leader as Coach Programme
Content from LeaderAsCoachProgramme.tsx:
- 10-month programme overview
- All 5 phases with topics
- Pain points addressed
- Target audience
- Pricing

### 4. `public/ai/products.html` — Full Products Catalogue
Content from Products.tsx:
- All product tiers (Tier 1, Tier 2, Tier 3)
- Each product with description, price, and features
- Bundle information

## Approach
- Pure semantic HTML5 — no JavaScript, no CSS frameworks
- Clean heading hierarchy (h1 > h2 > h3)
- Meta tags for SEO (title, description, canonical)
- Links back to the live React pages
- A small navigation between AI pages
- Each page under 50KB for fast crawling

## Sitemap Update
Update `public/sitemap.xml` to include the 4 new static pages with appropriate priority.

## Technical Details

**File structure:**
```text
public/
  ai/
    index.html
    feedback-formula.html
    leader-as-coach.html
    products.html
```

**Each HTML file will follow this template:**
```text
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>[Page Title] | Leadership by Design</title>
  <meta name="description" content="...">
  <link rel="canonical" href="https://leadershipbydesign.co/ai/...">
  <style> /* minimal inline styles for readability */ </style>
</head>
<body>
  <header> nav links between AI pages + link to main site </header>
  <main> structured content </main>
  <footer> company info </footer>
</body>
</html>
```

**Sitemap additions** (4 new entries in `public/sitemap.xml`):
- `/ai/index.html` — priority 0.6
- `/ai/feedback-formula.html` — priority 0.6
- `/ai/leader-as-coach.html` — priority 0.6
- `/ai/products.html` — priority 0.6

## Files to Create
- `public/ai/index.html`
- `public/ai/feedback-formula.html`
- `public/ai/leader-as-coach.html`
- `public/ai/products.html`

## Files to Edit
- `public/sitemap.xml` — add 4 new URL entries


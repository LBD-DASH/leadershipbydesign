

# The Feedback Formula — Sales Page (Mystery-Driven)

## Core Strategy

The F.E.E.D. method name and steps will NOT be revealed on the sales page. Instead, we tease a "proprietary 4-step framework" that creates curiosity and drives purchases. The page sells the outcome, not the method.

## What Gets Built

### 1. Sales Page — `src/pages/products/FeedbackFormula.tsx`

Follows the exact same structure as the New Manager Kit and Difficult Conversations pages (hero, pain points, modules, personas, CTA). Key difference: the methodology is kept behind the paywall.

**Hero Section**
- Badge: "NEW" with pulse animation
- Headline: "Give Feedback People Actually Hear"
- Subheadline: "A proprietary 4-step system that turns feedback from something your team dreads into their biggest growth accelerator"
- Feature pills tease outcomes, not method names: "4-Step Proprietary System", "10 Real-World Scripts", "Preparation Worksheets", "60-Second Cheat Sheet"
- Price: R297 (strikethrough R597)

**Pain Points Section**
- You give feedback but nothing changes
- Your team dreads performance conversations
- You default to "good job" because real praise feels awkward
- You soften criticism so much it loses all meaning
- You avoid giving feedback until it becomes a formal HR issue
- Your team says they want more feedback but you don't know how to deliver it

**"What's Inside" — Teased, Not Revealed**

Instead of naming the F.E.E.D. steps, each module card hints at what they will learn:

| Module | Title | Description |
|--------|-------|-------------|
| 01 | The 4-Step Feedback System | A proprietary method used in executive coaching that eliminates guesswork. You will know exactly what to say, in what order, every time. |
| 02 | 10 Feedback Scripts | Word-for-word scripts covering praise, correction, peer feedback, upward feedback, and development reviews. Copy, paste, deliver. |
| 03 | The "Before You Speak" Worksheet | A preparation tool that ensures you never walk into a feedback conversation unprepared or emotionally reactive again. |
| 04 | Development Conversation Templates | Quarterly review frameworks that transform reviews from box-ticking exercises into genuine growth conversations. |
| 05 | The Feedback Frequency Tracker | A habit-building tool so feedback becomes a weekly rhythm, not an annual event. |

**Bonus (free with purchase)**
- "The 60-Second Feedback Cheat Sheet" — a one-page quick reference for when you need to give feedback right now

**Personas**
- The Conflict-Averse Manager
- The Blunt Leader
- The New Manager
- The HR/L&D Professional

**Guarantee Section**
- If you use the system in 3 feedback conversations and see no improvement, request a full refund

### 2. Success Page — `src/pages/products/FeedbackFormulaSuccess.tsx`

Follows the existing success page pattern (payment verification via URL params, download button for PDF).

### 3. Route Updates — `src/App.tsx`

- Add `/feedback-formula` route pointing to `FeedbackFormula`
- Add `/feedback-formula/success` route pointing to `FeedbackFormulaSuccess`

### 4. Products Catalog Update — `src/pages/Products.tsx`

Update the `feedback-formula` entry:
- `comingSoon: true` becomes removed (or set `isBuilt: true`)
- `link` changes from `/products` to `/feedback-formula`

### 5. Sitemap Updates

- Add `/feedback-formula` to `public/sitemap.xml`
- Add to `generate-sitemap` edge function URL list

## Files to Create
- `src/pages/products/FeedbackFormula.tsx`
- `src/pages/products/FeedbackFormulaSuccess.tsx`

## Files to Edit
- `src/App.tsx` (add 2 routes)
- `src/pages/Products.tsx` (update product entry)
- `public/sitemap.xml` (add URL)
- `supabase/functions/generate-sitemap/index.ts` (add URL)

## Assets Used (existing)
- `product-lightbulb-idea.jpg` — hero image
- `leadership-feedback.jpg` — problem section
- `product-team-hands-below.jpg` — final CTA section

## PDF Placeholder
- References `public/feedback-formula.pdf` — you will need to upload the actual PDF asset


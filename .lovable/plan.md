

# Leader as Coach — Corporate Sales Page

## Overview
Create a new premium sales page at `/leader-as-coach` styled identically to the `/leadership-development` page (navy/gold aesthetic, animated sections, enquiry modal with Supabase submission). This positions the Leader as Coach Programme as a corporate engagement sold via proposal, separate from the existing self-serve product page at `/leader-as-coach-programme`.

## Page Structure

### 1. Sticky Header
- "Back to Programmes" link
- "Leader as Coach" title
- "Enquire Now" gold CTA button

### 2. Hero Section (navy background with image overlay)
- Badge: "Flagship 10-Month Programme"
- Headline: "Transform Managers into Leaders Who Coach, Not Control."
- Subtext: Programme description referencing SHIFT Skills, People-Profit-Process model
- Pricing hint: "From R45,000 per cohort | 10 Months | Hybrid Delivery"
- CTAs: "Request a Proposal" + "Take the Free Diagnostic"

### 3. The Problem (cream background)
Three problem cards matching the L1-L5 page pattern:
- "One-Day Workshops Don't Work" — training events forgotten within 2 weeks
- "Toxic Culture Persists" — drama cycles and conflict avoidance remain
- "No Coaching Capability" — managers promoted for skill, not leadership

### 4. The Solution (navy background)
Overview of the 5-Phase system with the People-Profit-Process methodology tagline

### 5. The 5 Phases (cream background, alternating image/text layout)
Reuse the existing `phases` data from LeaderAsCoachProgramme.tsx:
- Phase 01: Leadership Identity and Self-Awareness (Months 1-2)
- Phase 02: Communication Mastery and Emotional Intelligence (Months 3-4)
- Phase 03: Performance, Accountability and Boundaries (Months 5-6)
- Phase 04: High-Performing Teams and Strategic Leadership (Months 7-8)
- Phase 05: Sustainability, Succession and Embedding (Months 9-10)

Each phase shows: number, title, duration, SHIFT focus, and key topics with alternating image layout using existing assets.

### 6. Outcomes (navy background)
Six outcome cards with icons:
- Culture shift within 90 days
- Coaching capability embedded at every level
- 40% reduction in unresolved conflict
- Measurable ROI with pulse assessments
- Succession pipeline activated
- Common leadership language across the organisation

### 7. How It Works (cream background)
Four-step process: Diagnose, Design, Deliver, Embed

### 8. Testimonials (navy background)
Three testimonial cards (anonymised corporate quotes)

### 9. Facilitator Section (cream background)
Kevin Britz bio with photo, stats (4,000+ leaders, 11 years, 94% diagnostic accuracy) -- same as L1-L5 page

### 10. Pricing Section (navy background)
Three tiers:
- Single Cohort: From R45,000
- Multi-Cohort: From R120,000
- Enterprise: Custom pricing
CTAs: "Request a Proposal" + "Take the Free Diagnostic First"

### 11. Final CTA (cream background)
"Ready to Build a Coaching Culture?" with enquiry button

### 12. Booking Modal
Form fields: Name, Company, Email, Phone, Message
Submits to `contact_form_submissions` table with `service_interest: "Leader as Coach Programme"`
Shows `ReferralSharePrompt` on success

## Technical Details

### New File
- `src/pages/LeaderAsCoachSales.tsx` — follows the exact pattern and code structure of `LeadershipDevelopmentSales.tsx`

### Route Addition in `src/App.tsx`
```
<Route path="/leader-as-coach" element={<LeaderAsCoachSales />} />
```

### Assets Used (existing)
- `leader-as-coach.jpg` — hero background
- `leadership-feedback.jpg` — phase section images
- `product-team-hands-above.jpg` — alternating phase images
- `kevin-britz-facilitator.jpg` — facilitator section
- `shift-hero-team.jpg` — additional phase image

### Styling
- Navy/gold/cream inline colour scheme matching `/leadership-development` exactly
- Framer Motion `fadeUp` and `staggerContainer` animations
- Responsive grid layouts

### Data Submission
- Uses existing `contact_form_submissions` Supabase table
- Service interest tagged as "Leader as Coach Programme"


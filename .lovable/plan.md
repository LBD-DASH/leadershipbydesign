

# Executive Coaching for Contagious Identity - Sales Page

## Overview

I'll create a premium, executive-level sales page for the "Executive Coaching for Contagious Identity" programme. This page will serve as a high-caliber offering that feels serious and strategic - no hype, no urgency tactics, just calm confidence.

The page will integrate with the existing site's teal design system while incorporating the premium deep navy aesthetic specified in your prompt for key sections.

---

## Page Structure

### 1. Hero Section
- Deep navy background with gradient
- Main headline: "Executive Coaching for Contagious Identity"
- Subheadline explaining identity-driven leadership
- Three supporting points with teal accents
- CTA button: "Explore the Coaching Process"

### 2. Overview Section
- "What This Coaching Actually Does"
- Explains how identity spreads through visible leadership behaviour
- Clarification that this is not therapy or generic coaching

### 3. Why This Matters Now Section
- Current leadership reality challenges
- Inconsistency between values and behaviour
- Key statement about leaders always teaching

### 4. Pain Points Section
- "This Coaching Addresses" - clean minimal cards
- Common executive challenges the coaching solves

### 5. Who This Is For Section
- Ideal client profiles (CEOs, founders, senior executives)
- Clear criteria for engagement

### 6. Workbook Download Section
- Lead capture form for the "Contagious Identity Workbook" PDF
- Fields: Name, Email, Role, Company
- Email delivery integration

### 7. Coaching Process Section
- Four-phase methodology with timeline
- Discovery, Foundation, Application, Integration phases

### 8. Client Profile Section
- Detailed description of ideal clients
- Mutual fit indicators

### 9. Pricing Section
- Premium positioning (R45,000 - R75,000 range)
- Three-tier structure: Foundation, Executive, Strategic
- Clear deliverables for each tier

### 10. FAQ Section
- Common questions about executive coaching
- Session format, confidentiality, duration, etc.

### 11. Final CTA Section
- "Start the Conversation"
- Interest form with qualifying questions

---

## Technical Implementation

### Files to Create

| File | Purpose |
|------|---------|
| `src/pages/ContagiousIdentityCoaching.tsx` | Main sales page component |
| `src/components/contagious-identity/ContagiousIdentityForm.tsx` | Lead capture form for workbook |
| `src/components/contagious-identity/InterestForm.tsx` | Coaching interest/enquiry form |
| `public/contagious-identity-workbook.pdf` | PDF workbook (copied from upload) |

### Route Configuration
```text
/contagious-identity → ContagiousIdentityCoaching.tsx
```

### Database Integration
- Store workbook download leads in the database
- Store coaching interest submissions for follow-up

### Design Tokens
The page will use the existing teal primary color (`--primary: 200 70% 40%`) for consistency across the site, with deep navy gradients for hero and accent sections to create the premium executive feel requested.

---

## Key Design Decisions

1. **Color Harmony**: Use existing teal primary for CTAs and accents, deep navy for hero backgrounds - maintaining site consistency while achieving premium feel

2. **Typography**: Leverage existing font system with larger, more editorial heading sizes for executive feel

3. **No Urgency Tactics**: No countdown timers, no "limited spots", no aggressive discounts - just clear value proposition

4. **Lead Capture**: Workbook download requires email capture, creating a natural entry point into the sales funnel

5. **Qualification Focus**: Interest form includes qualifying questions to ensure mutual fit

---

## Component Dependencies

- Existing: Header, Footer, SEO, Button, Input, motion (framer-motion)
- Database: New table for coaching interest submissions
- Email: Integration with existing email edge function for workbook delivery

---

## Mobile Optimization

- Responsive sections with appropriate spacing
- Touch-friendly form inputs
- Collapsible FAQ accordion
- Optimized hero for mobile viewports


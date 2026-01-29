
# Programme Overview Pages for Admin - Implementation Plan

## Overview
Create downloadable 1-2 page programme overview documents for each major programme, accessible to logged-in admins. These will follow the proven pattern established by the Team Development Framework page.

## Programmes to Create Overview Pages For

| Programme | Route | Page Count |
|-----------|-------|------------|
| Executive Coaching | `/admin/overview/executive-coaching` | 2 pages |
| SHIFT Leadership Development | `/admin/overview/shift-leadership` | 2 pages |
| SHIFT Methodology | `/admin/overview/shift-methodology` | 2 pages |
| Team Alignment Workshop | `/admin/overview/workshop-alignment` | 1 page |
| Team Motivation Workshop | `/admin/overview/workshop-motivation` | 1 page |
| Team Leadership Workshop | `/admin/overview/workshop-leadership` | 1 page |
| Leadership Levels (L1-L5) | `/admin/overview/leadership-levels` | 2 pages |

## Page Structure (Each Overview)

**Page 1 - Programme Summary:**
- Leadership by Design branding header
- Programme title and tagline
- Key statistics/outcomes (e.g., "2x strategic clarity in 90 days")
- Who it's for / Ideal client profile
- Duration and format details
- Core components or methodology overview

**Page 2 (where applicable):**
- What's included / Session structure
- Expected outcomes with metrics
- Investment overview (placeholder text)
- Next steps / Call to action
- Contact information

## Technical Implementation

### 1. Create Admin Overviews Index Page
**Route:** `/admin/overviews`
**Purpose:** Dashboard showing all available programme overviews with cards linking to each

### 2. Create Reusable Overview Template Component
**File:** `src/components/admin/ProgrammeOverviewTemplate.tsx`
**Purpose:** Standardised print-ready layout with:
- Consistent branding header
- Print/Download action bar
- Page break handling
- Footer with contact details

### 3. Individual Overview Pages
**Directory:** `src/pages/admin/overviews/`
- `ExecutiveCoachingOverview.tsx`
- `ShiftLeadershipOverview.tsx`
- `ShiftMethodologyOverview.tsx`
- `AlignmentWorkshopOverview.tsx`
- `MotivationWorkshopOverview.tsx`
- `LeadershipWorkshopOverview.tsx`
- `LeadershipLevelsOverview.tsx`

### 4. Admin Protection
Wrap all `/admin/overviews/*` routes with admin authentication check using the existing `useAdminAuth` hook pattern.

### 5. Navigation Updates
- Add "Programme Overviews" link to Admin Dashboard
- Create overview index page with cards for each programme

## Print Styling Approach

Following the Team Development Framework pattern:
```css
@media print {
  @page {
    size: letter;
    margin: 0.5in;
  }
  .print-page {
    page-break-after: always;
    page-break-inside: avoid;
  }
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
```

## Content Sources

Content will be extracted from existing pages:
- `ExecutiveCoaching.tsx` - SHIFT framework, assessments, outcomes
- `ShiftLeadershipDevelopment.tsx` - Leadership levels, bespoke design
- `ShiftMethodology.tsx` - 5 SHIFT skills, workshop applications
- `AlignmentWorkshop.tsx` / `MotivationWorkshop.tsx` / `LeadershipWorkshop.tsx` - Workshop details
- `leadershipScoring.ts` - Leadership level details (L1-L5)

## File Changes Summary

### New Files (9)
1. `src/pages/admin/AdminOverviews.tsx` - Index page
2. `src/components/admin/ProgrammeOverviewTemplate.tsx` - Reusable template
3. `src/pages/admin/overviews/ExecutiveCoachingOverview.tsx`
4. `src/pages/admin/overviews/ShiftLeadershipOverview.tsx`
5. `src/pages/admin/overviews/ShiftMethodologyOverview.tsx`
6. `src/pages/admin/overviews/AlignmentWorkshopOverview.tsx`
7. `src/pages/admin/overviews/MotivationWorkshopOverview.tsx`
8. `src/pages/admin/overviews/LeadershipWorkshopOverview.tsx`
9. `src/pages/admin/overviews/LeadershipLevelsOverview.tsx`

### Modified Files (2)
1. `src/App.tsx` - Add routes for all new overview pages
2. `src/components/admin/AdminDashboardContent.tsx` - Add link to Programme Overviews

## User Flow

1. Admin logs in via footer "Admin" link at `/auth`
2. Navigates to `/admin` dashboard
3. Clicks "Programme Overviews" link
4. Sees grid of all available programme overview cards
5. Clicks any programme to view its professional overview
6. Uses Print/Download PDF buttons to save for client discussions

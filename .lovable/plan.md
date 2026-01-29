

# Admin Programmes Catalogue - Implementation Plan

## Summary

Create a new **"All Programmes (Detailed)"** section in the admin area that mirrors the public Programmes page structure but includes comprehensive programme details from the Multichoice Leadership Pipeline document. This will serve as a detailed reference for client discussions.

## What You'll Get

### A New Admin Section
- Access from Admin Dashboard via a new "All Programmes" card
- Grid layout showing all programme cards at a glance
- Clicking any programme card opens a detailed view with:
  - Programme topics covered
  - Expected outcomes
  - Target audience
  - Recommended development path

### Programmes Included (from your PDF)

| Programme | Level | Topics | Outcomes |
|-----------|-------|--------|----------|
| Effective Personal Productivity | L1 | Power of enthusiasm, Increasing productivity, Communication & Creative Listening, Qualities of a successful executive | Delivering results, Building commonality, Understanding values, Increasing performance |
| Effective Leadership Development | L2 | Effective communication, Time management, Problem-solving, Art of delegation, Developing potential | Keys to leading a team, Resolving conflict, Building relationships, Agile adaptability |
| Effective Personal Leadership | L3 | Self knowledge, Follow through with persistence, Effective planning, Cognitive self-awareness | Building purpose and resilience, Balanced life, Understanding vision |
| Effective Motivational Leadership | L4 | Developing & empowering people, Leading change, Vision and communication, Personal leadership potential | Understanding people, Motivating across boundaries, Driving motivation, Leading global teams |
| Effective Strategic Leadership | L5 | Power of strategic leadership, Strategic purpose, Strategic assessment, Making strategy happen | Creative vision, Developing strategy, Cultural transformation, Leading by example |
| Leadership for Women | Special | Six essentials to leadership, Living a balanced life, Discover your purpose, Art of communication, Leader of the future | Building purpose and resilience, Persistence, Understanding leadership importance |
| Grand Masters of Success | Foundation | I CAN approach, How to master my time | Foundational leadership, Essential time management skills, Accountability |

---

## Technical Implementation

### New Files to Create

1. **`src/pages/admin/AdminAllProgrammes.tsx`**
   - Grid page listing all programmes as cards
   - Similar layout to existing `AdminOverviews.tsx`
   - Clicking a card navigates to detailed programme view

2. **`src/pages/admin/programmes/ProgrammeDetailView.tsx`**
   - Detailed view showing programme topics and outcomes
   - Uses existing `ProgrammeOverviewTemplate` for consistent styling
   - Print/download capability inherited from template

3. **`src/data/adminProgrammesData.ts`**
   - Centralised data file containing all programme information
   - Topics, outcomes, descriptions, target audience for each programme
   - Easy to update when programme content changes

### Files to Modify

1. **`src/App.tsx`**
   - Add routes for `/admin/programmes` and `/admin/programmes/:id`

2. **`src/components/admin/AdminDashboardContent.tsx`**
   - Add new card linking to "All Programmes (Detailed)"

### Route Structure

```text
/admin
  |-- /admin/overviews          (existing - 1-2 page downloadable overviews)
  |-- /admin/programmes         (NEW - all programmes grid)
      |-- /admin/programmes/:id (NEW - detailed programme view)
```

---

## User Flow

1. Admin logs in at `/admin`
2. Sees two options:
   - **Programme Overviews** - existing 1-2 page PDF-ready documents
   - **All Programmes (Detailed)** - new comprehensive programme catalogue
3. Clicking "All Programmes" shows grid of 8 programme cards
4. Clicking any card shows full detail page with:
   - Programme description
   - Topics covered (bullet list)
   - Expected outcomes (bullet list)
   - Target audience / level indicator
   - Print/download options

---

## Design Approach

- Reuses existing UI components (`Card`, `Badge`, `Button`)
- Follows established admin styling patterns
- Print-optimised using existing `@media print` CSS
- Mobile-responsive grid layout



# Prospect Quality Indicator (Green/Yellow/Red)

## Overview
Add a visual traffic light indicator to show at a glance how promising a prospect is based on the data quality and opportunity signals extracted during research.

## Scoring Logic

The prospect quality score will be calculated based on **data completeness** and **opportunity signals**:

| Factor | Points | Reasoning |
|--------|--------|-----------|
| **Contact Email** | +25 | Direct outreach possible |
| **HR/L&D Contacts** | +20 | Key decision makers identified |
| **Contact Phone** | +10 | Alternative contact method |
| **Pain Points Identified** | +15 | Clear problems to solve |
| **Opportunity Signals** | +15 | Growth/need indicators |
| **Leadership Team Extracted** | +10 | Organisation structure known |
| **LinkedIn URL** | +5 | Social connection possible |

**Total possible: 100 points**

### Temperature Thresholds
- **Green (Hot)**: 60+ points - High-quality prospect, ready to contact
- **Yellow (Warm)**: 35-59 points - Potential, but needs more research
- **Red (Cool)**: Below 35 points - Limited data, low priority

## Visual Design

```text
+-------------------------------------------+
| Company Name            [🟢 Hot Lead]     |
| Industry | Size                           |
+-------------------------------------------+
```

The indicator will appear as:
- **Green circle** with "Hot Lead" tooltip - prioritize contact
- **Yellow circle** with "Warm Lead" tooltip - follow up
- **Red circle** with "Needs Research" tooltip - gather more info first

## Implementation

### 1. Create Prospect Scoring Utility
New file: `src/utils/prospectScoring.ts`

```text
- Calculate score based on available prospect data
- Return score, temperature (hot/warm/cool), and breakdown
- Export reusable function for both components
```

### 2. Update LeadDiscoveryForm Component
Add quality indicator to each researched company card:
- Show indicator after research completes
- Display next to company name
- Include tooltip with score breakdown

### 3. Update ProspectList Component
Add quality indicator to saved prospect cards:
- Show indicator in the card header
- Allow sorting/filtering by quality score (future enhancement)
- Visual consistency with discovery view

### 4. Create QualityIndicator Component
Reusable component: `src/components/marketing/QualityIndicator.tsx`
- Traffic light colored badge/dot
- Hover tooltip showing score and breakdown
- Accessible with proper aria labels

## Technical Details

### Scoring Function Signature
```typescript
interface ProspectQualityScore {
  score: number;
  temperature: 'hot' | 'warm' | 'cool';
  color: 'green' | 'yellow' | 'red';
  label: string;
  breakdown: {
    contactEmail: number;
    hrContacts: number;
    contactPhone: number;
    painPoints: number;
    opportunitySignals: number;
    leadershipTeam: number;
    linkedIn: number;
  };
}
```

### Files to Create/Modify
1. **Create**: `src/utils/prospectScoring.ts` - Scoring logic
2. **Create**: `src/components/marketing/QualityIndicator.tsx` - Visual component
3. **Modify**: `src/components/marketing/LeadDiscoveryForm.tsx` - Add indicator to discovered companies
4. **Modify**: `src/components/marketing/ProspectList.tsx` - Add indicator to saved prospects

## User Experience
- At-a-glance prioritization of leads
- Clear visual hierarchy (green = act now, red = needs work)
- Consistent across discovery and saved prospects
- Hovering shows why a prospect scored the way it did

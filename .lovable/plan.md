
# Add Google Ads Editor CSV Export Feature

## Overview
Add a "Download for Google Ads Editor" button to the Google Ads generator that exports the generated content in the official Google Ads Editor CSV format. This will allow you to bulk upload ads with just a few clicks.

## What Will Be Built

### 1. CSV Export Utility Function
Create a new utility file that generates properly formatted CSV files for Google Ads Editor import:
- **Responsive Search Ads CSV**: Includes Campaign, Ad Group, Headlines 1-15, Descriptions 1-4, Final URL, and Path fields
- **Display Ads CSV**: Headlines, descriptions, business name, final URLs
- **Performance Max CSV**: All asset types with proper column headers

### 2. Updated GoogleAdsGenerator Component
Add a new "Export for Google Ads Editor" button alongside the existing "Save to Drafts" button that:
- Downloads a properly formatted .csv file
- Names the file descriptively (e.g., `google-ads-search-executive-coaching-2026-02-03.csv`)
- Shows a success toast notification

### 3. Export Format Details
The CSV will follow Google Ads Editor's required format:

```text
Campaign, Ad Group, Headline 1, Headline 2, ... Headline 15, Description 1, Description 2, Description 3, Description 4, Final URL, Path 1, Path 2
Leadership by Design - Executive Coaching, Executive Coaching, "Headline 1 text", "Headline 2 text", ... , "Description text", https://leadershipbydesign.lovable.app/executive-coaching, Leadership, Coaching
```

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/googleAdsExport.ts` | Create | CSV generation utility with format handlers for each ad type |
| `src/components/marketing/GoogleAdsGenerator.tsx` | Modify | Add export button and import the utility |

## User Workflow After Implementation
1. Go to Admin Dashboard > Google Ads tab
2. Generate ad copy
3. Click "Export for Google Ads Editor"
4. Open Google Ads Editor on your computer
5. Go to Account > Import > From CSV
6. Select the downloaded file
7. Review and post changes

---

## Technical Details

### CSV Generation Logic
The utility will:
- Escape commas and quotes properly for CSV format
- Handle variable-length arrays (e.g., if AI generates fewer than 15 headlines)
- Pre-fill campaign and ad group names based on the service
- Include the correct Final URL for each service

### Default Values in CSV
- **Campaign Name**: "Leadership by Design - [Service Name]"
- **Ad Group**: Service name
- **Final URL**: Your published site + relevant page path
- **Path 1/2**: Short descriptive paths like "Leadership" / "Coaching"

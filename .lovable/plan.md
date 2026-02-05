

# Google Ads CSV Export - Compatibility Fixes

## Current Situation

Your CSV export utility (`src/lib/googleAdsExport.ts`) is **correctly structured** - Google Ads Editor doesn't require an "Account" column in the CSV. You select the account in Google Ads Editor before importing.

The "required account column is missing" error happens when:
1. You haven't selected an account in Google Ads Editor before importing
2. Column names don't match exactly (case-sensitive)
3. The CSV encoding is wrong

## Recommended Fixes

### 1. Add Campaign Status Column (Prevents Import Warnings)
Google Ads Editor expects a "Campaign status" column - without it, campaigns default to "Enabled" but may show warnings.

### 2. Add Ad Group Status Column
Same as above - prevents validation warnings.

### 3. Add Networks Column for Search Campaigns
Search campaigns should specify "Networks" (e.g., "Google search") to avoid default behaviour.

### 4. Add BOM (Byte Order Mark) for UTF-8
Some versions of Google Ads Editor require UTF-8 BOM for special characters (like R for Rand).

### 5. Add CSV Preview Feature
Before downloading, show a preview of the exact columns so you can verify the format.

## Technical Changes

### File: `src/lib/googleAdsExport.ts`

```text
Updates:
1. Add "Campaign status" column (default: "Enabled")
2. Add "Ad group status" column (default: "Enabled")  
3. Add "Networks" column for Search ads (value: "Google search")
4. Add UTF-8 BOM to downloadCSV function
5. Ensure Final URL includes https://
```

**Search Ads - Updated Column Order:**
```
Campaign, Campaign status, Campaign type, Budget, Budget type, Networks, 
Ad group, Ad group status, Ad type, 
Headline 1-15, Description 1-4, 
Final URL, Path 1, Path 2
```

**Display Ads - Updated Column Order:**
```
Campaign, Campaign status, Campaign type, Budget, Budget type,
Ad group, Ad group status, Ad type,
Short headline 1-5, Long headline 1-5, Description 1-5,
Business name, Final URL
```

**PMax - Updated Column Order:**
```
Campaign, Campaign status, Campaign type, Budget, Budget type,
Asset group, 
Headline 1-5, Long headline 1-5, Description 1-5,
Business name, Final URL, Path 1, Path 2
```

### File: `src/components/marketing/GoogleAdsGenerator.tsx`

Add a CSV preview modal that shows:
- Exact column headers
- Sample data row
- Verification checklist before download

## Import Instructions (Add to UI)

Add a help card explaining the correct import flow:

```
How to Import:
1. Open Google Ads Editor
2. Select your account (top-left dropdown)
3. Go to Ads > Responsive Search Ads (or Display Ads)
4. Click "Make multiple changes"
5. Choose "My data includes columns for campaigns and/or ad groups"
6. Paste or import your CSV
7. Click "Process" then "Finish and review changes"
8. Post changes when ready
```

## Summary

| Change | Purpose |
|--------|---------|
| Add Campaign status | Prevents "status missing" warnings |
| Add Ad group status | Prevents validation errors |
| Add Networks column | Required for Search campaigns |
| Add UTF-8 BOM | Fixes encoding issues with special chars |
| Add import instructions | Helps avoid "account missing" confusion |


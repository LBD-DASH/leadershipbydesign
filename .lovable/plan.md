

## Add /leader-as-coach to Sitemap and JSON-LD Structured Data

### 1. Add `/leader-as-coach` to dynamic sitemap edge function

**File:** `supabase/functions/generate-sitemap/index.ts`

Add a new entry to the `staticPages` array (high priority since it's a key sales page):

```
{ loc: "/leader-as-coach", priority: "0.9", changefreq: "monthly" }
```

Also update the static `public/sitemap.xml` to include the same URL for consistency.

### 2. Add JSON-LD Service schema to the sales page

**File:** `src/pages/LeaderAsCoachSales.tsx`

Import `ServiceSchema` and `BreadcrumbSchema` from `@/components/StructuredData` and render them alongside the existing `<SEO>` component:

- **ServiceSchema**: name "Leader as Coach Programme", description summarizing the 90-day accelerator, areaServed "South Africa", url "/leader-as-coach"
- **BreadcrumbSchema**: Home > Programmes > Leader as Coach Programme

### Technical Details

- The `ServiceSchema` component already exists in `src/components/StructuredData.tsx` and outputs valid JSON-LD via `react-helmet`
- The edge function deploys automatically after the file edit
- No database changes or new dependencies required


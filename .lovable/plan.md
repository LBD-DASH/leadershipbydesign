

# Align Authority Numbers Across the Entire Site

The **StatsBar** and **CredibilityBlock** already have the correct figures. However, many other pages still reference outdated "3,000+ organizations" copy. This plan updates every inconsistent reference sitewide, plus rewrites the About page bio to align.

---

## Canonical Numbers

| Metric | Correct Value |
|--------|---------------|
| Years | 11 |
| Workshops | 750+ |
| Leaders Developed | 4,000+ |
| Organisations | 50+ |
| Proprietary Methodologies | 6 |

---

## Changes by File

### 1. `src/pages/Index.tsx`
- SEO description: change "3,000+ organizations" to "50+ organisations"

### 2. `src/pages/About.tsx`
- SEO description (line 77): change "3,000+ organizations" to "50+ organisations"
- Rewrite the bio/philosophy to include the corrected numbers where relevant (e.g., mention 750+ workshops, 4,000+ leaders, 50+ organisations)

### 3. `src/pages/Products.tsx`
- Trust items array (line 241): change "3,000+ Organizations" to "4,000+ Leaders Developed"
- Section description (line 399): "11 years of coaching 3,000+ organizations" becomes "11 years developing 4,000+ leaders across 50+ organisations"
- Footer stats bar (line 546): same correction

### 4. `src/pages/LeadershipDevelopmentSales.tsx`
- Kevin bio text (line 362): "over 3,000 coaching sessions" update to "over 4,000 leaders developed"
- Stats row (line 371): change "3,000+" / "Coaching Sessions" to "4,000+" / "Leaders Developed"; change "20+" / "Years Experience" to "11" / "Years"

### 5. `src/pages/products/NewManagerKit.tsx`
- Line 262: "3,000+ organizations" to "50+ organisations"
- Line 429: same correction
- Footer line 439: same correction

### 6. `src/pages/products/SurvivalPack.tsx`
- Line 219: "3,000+ organizations" to "50+ organisations"

### 7. `src/pages/products/LeaderAsCoachProgramme.tsx`
- Line 286: "3,000+ organisations" to "50+ organisations"

### 8. `src/lib/emailTemplates.ts`
- Lines 73 and 92: "3,000+ organisations" to "50+ organisations"

### 9. `supabase/functions/process-follow-up-sequences/index.ts`
- Lines 68 and 87: same corrections as emailTemplates

---

## Technical Notes

- All changes are copy-only text replacements -- no structural, database, or dependency changes
- The pattern is consistent: replace every instance of "3,000+" with either "4,000+ leaders" or "50+ organisations" depending on context
- About 15-20 individual line edits across 9 files



# SEO Visibility Improvement Plan

## Current State Analysis

Your website already has a solid SEO foundation:
- SEO component with Open Graph, Twitter cards, and meta tags
- Structured data (JSON-LD) for business, FAQ, and website schema
- Sitemap.xml with 24 URLs
- Robots.txt properly configured
- Canonical URLs on most pages

However, there are several opportunities to significantly improve search engine visibility.

---

## Recommended Improvements

### 1. Add Missing Canonical URLs

Several pages are missing canonical URLs, which can cause duplicate content issues:

**Pages missing canonicalUrl:**
- `/shift-leadership-development` (partial route)
- `/workshops/alignment`, `/workshops/motivation`, `/workshops/leadership`
- `/hellocoach`
- `/book`
- `/resources`
- `/contact`
- `/leadership-diagnostic`
- `/shift-diagnostic`
- `/leadership-mistakes`

**Action:** Add canonicalUrl prop to all page SEO components.

---

### 2. Enhance Blog Post SEO for Article Schema

Blog posts currently lack article-specific structured data.

**Add to BlogPost.tsx:**
- `publishedTime` and `modifiedTime` props (already supported by SEO component)
- `ogType="article"` to trigger article meta tags
- Add Article JSON-LD structured data

**New structured data for blog posts:**
```text
Article Schema:
- @type: Article
- headline
- author (Person)
- datePublished
- dateModified
- publisher (Organization)
- image
- articleSection
```

---

### 3. Add Service-Specific Structured Data

Each service page should have its own structured data.

**Pages to enhance:**
- Executive Coaching: Add Service schema
- SHIFT Leadership Development: Add Course schema
- Workshops: Add Event or Course schema
- Diagnostics: Add WebApplication schema

---

### 4. Add BreadcrumbList Structured Data

Breadcrumbs help search engines understand site hierarchy and can appear in search results.

**Add to:**
- All programme pages
- Workshop pages
- Blog posts
- Diagnostic pages

**Example structure:**
```text
Home > Programmes > Executive Coaching
Home > Blog > [Post Title]
```

---

### 5. Update Sitemap with Dynamic Blog Posts

Current sitemap is static and doesn't include individual blog posts.

**Options:**
1. Generate sitemap dynamically via edge function
2. Create a sitemap index with static pages + blog posts sitemap

**Sitemap improvements:**
- Add all blog post URLs dynamically
- Include hreflang tags for international targeting
- Add image sitemaps for pages with key images

---

### 6. Add FAQ Schema to Service Pages

FAQs help capture featured snippets in search results.

**Pages to add FAQ schema:**
- Executive Coaching (coaching FAQs)
- Programmes page (programme selection FAQs)
- Workshop pages (format, duration FAQs)
- Diagnostic landing pages (assessment FAQs)

---

### 7. Improve Page Load Performance

Core Web Vitals affect search rankings.

**Quick wins:**
- Add `loading="lazy"` to all below-fold images (partially done)
- Preload critical fonts (already implemented)
- Consider image optimisation with WebP format
- Add `fetchpriority="high"` to hero images

---

### 8. Add Local Business Schema Enhancements

Improve local SEO for South Africa targeting.

**Current:** ProfessionalService schema exists
**Enhancements:**
- Add specific service area (cities/regions)
- Add opening hours (if applicable)
- Add reviews/aggregateRating when available
- Add payment methods

---

### 9. Create Dedicated Structured Data Component

For maintainability, create a reusable component for JSON-LD.

**New component:** `src/components/StructuredData.tsx`
- Article schema for blog posts
- BreadcrumbList schema
- Service schema for service pages
- Course schema for programmes
- FAQPage schema

---

### 10. Add Twitter Creator Tag

Improve Twitter card display for shared content.

**Add to SEO component:**
- `twitter:creator` - Kevin Britz's Twitter handle
- `twitter:site` - Company Twitter handle (if exists)

---

## Implementation Priority

| Priority | Change | Impact |
|----------|--------|--------|
| High | Add missing canonical URLs | Prevents duplicate content issues |
| High | Blog article schema + timestamps | Featured snippets, rich results |
| High | Breadcrumb schema | Enhanced search appearance |
| Medium | Service page structured data | Rich results for services |
| Medium | FAQ schema on key pages | Featured snippets |
| Medium | Dynamic sitemap | Better blog indexing |
| Low | Local SEO enhancements | Local search visibility |
| Low | Twitter creator tags | Social sharing |

---

## Technical Details

### Files to Modify

1. **src/components/SEO.tsx**
   - Ensure all meta tags have fallback values
   - Add Twitter site/creator tags

2. **Create: src/components/StructuredData.tsx**
   - Reusable JSON-LD components for different schema types

3. **All page files missing canonicalUrl:**
   - Add canonicalUrl prop to SEO component

4. **src/pages/BlogPost.tsx**
   - Add publishedTime, modifiedTime, ogType="article"
   - Add Article structured data

5. **Create: supabase/functions/generate-sitemap/index.ts**
   - Dynamic sitemap generation including blog posts

6. **Service/Workshop pages:**
   - Add appropriate structured data for each

### Estimated Scope

- Small changes across 15-20 files
- 1 new component (StructuredData)
- 1 new edge function (optional, for dynamic sitemap)




# Products / Shop Page Implementation Plan (Updated for Site Consistency)

## Design System Analysis

Based on a thorough review of the existing codebase, the Products page will follow these established patterns:

### Color System
The site uses **CSS custom properties** defined in `src/index.css`:
- **Primary:** `hsl(var(--primary))` - Teal (hsl 200 70% 40%)
- **Background:** `hsl(var(--background))` - White
- **Foreground:** `hsl(var(--foreground))` - Dark gray
- **Muted:** `hsl(var(--muted))` - Light blue-gray
- **Card:** `hsl(var(--card))` - White with border

The NewManagerKit page uses a **standalone palette** (Navy #1B2A4A, Gold #C8A864, Cream #F8F6F1) which is intentional for that specific product sales funnel. The Products catalog page should use the **site-wide design system** for consistency.

### Typography
- **Headings:** `font-serif` (Playfair Display) - used via `className="font-serif"`
- **Body:** Default sans-serif (Inter)
- **Heading patterns:** `text-4xl md:text-5xl font-bold text-primary`
- **Section dividers:** `<div className="w-24 h-1 bg-primary mx-auto" />` after headings

### Layout Patterns
- **Page wrapper:** `min-h-screen bg-background`
- **Section padding:** `py-24 px-6 lg:px-8`
- **Container width:** `max-w-6xl mx-auto` or `max-w-7xl mx-auto`
- **Card styling:** `bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300`

### Animation Patterns
- **Page hero animations:** Framer Motion `initial={{ opacity: 0, y: 20 }}` with `animate`
- **Scroll animations:** `whileInView` with `viewport={{ once: true }}`
- **Stagger delays:** `transition={{ delay: index * 0.1, duration: 0.6 }}`

### Component Reuse
- Uses `<Header />` and `<Footer />` on all pages
- Uses `<SEO />` component for meta tags
- Uses `<Button />` from shadcn/ui with rounded-full style: `className="rounded-full group"`
- Uses Lucide icons consistently

---

## Updated Page Structure

```text
+--------------------------------------------------+
|   HEADER (Site-wide navigation)                  |
+--------------------------------------------------+
|   1. HERO SECTION                                |
|   Primary gradient background, centered content  |
+--------------------------------------------------+
|   2. FEATURED BUNDLE (Highlighted section)       |
|   Subtle primary/10 background, gold accents     |
+--------------------------------------------------+
|   3. INDIVIDUAL PRODUCTS                         |
|   Card grid using site card patterns             |
+--------------------------------------------------+
|   4. TRUST SECTION                               |
|   Simple stats bar (muted background)            |
+--------------------------------------------------+
|   5. WHO ARE THESE FOR                           |
|   Text section with icon bullets                 |
+--------------------------------------------------+
|   6. CTA TO COACHING                             |
|   Primary gradient background (like About hero)  |
+--------------------------------------------------+
|   FOOTER (Site-wide)                             |
+--------------------------------------------------+
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/pages/Products.tsx` | **Create** | Main products catalog page |
| `src/App.tsx` | **Modify** | Add `/products` route |
| `src/components/Header.tsx` | **Modify** | Add "Products" navigation link |

---

## Technical Implementation Details

### Section 1: Hero
```text
Pattern: Matches About.tsx and Contact.tsx hero sections
- Background: bg-gradient-to-br from-primary to-primary/80
- Text: text-primary-foreground (white)
- Container: max-w-6xl mx-auto text-center
- Animation: Framer Motion fade-in
```

### Section 2: Featured Bundle
```text
Pattern: Similar to diagnostic CTA blocks in Programmes.tsx
- Background: bg-primary/5 rounded-2xl border border-primary/20
- Badge: Gold accent using inline style or accent class
- Price display: Strikethrough for original, bold for bundle price
- CTA: Opens CheckoutModal (reuse existing component)
```

### Section 3: Product Cards
```text
Pattern: Matches card styling from About.tsx values section
- Container: Grid with responsive columns
- Cards: bg-card rounded-2xl p-6 border border-border hover:shadow-xl
- Icons: Lucide icons in bg-primary/10 rounded-xl containers
- CTA: Link to individual product pages or open checkout
```

### Section 4: Trust Section
```text
Pattern: Similar to ClientLogos.tsx or social proof bar
- Background: bg-secondary/20 or bg-muted/30
- Layout: Flex row with centered items
- Content: 3 credibility stats with icons
```

### Section 5: Who Are These For
```text
Pattern: Matches values section from About.tsx
- Background: bg-background or subtle gradient
- Layout: Icon + text blocks
- Animation: Staggered fade-in on scroll
```

### Section 6: CTA to Coaching
```text
Pattern: Matches hero sections across site
- Background: bg-gradient-to-br from-primary to-primary/80
- Text: White with primary-foreground styling
- CTA: Button linking to /contact
```

---

## Navigation Updates

**Header.tsx Modifications:**

1. Add "Products" link between "Home" and the Programmes dropdown
2. Desktop: Simple NavLink component
3. Mobile: Add to the main navigation section

```text
Desktop order: Home | Products | Programmes ▼ | Resources ▼ | About | Contact
Mobile order: Home > Products > Programmes section > Resources section > About > Contact
```

---

## Bundle Checkout Integration

The existing `CheckoutModal` component will be extended to support:
- Different product names and prices passed as props
- Bundle configuration with combined product name

Example usage:
```tsx
<CheckoutModal
  open={bundleCheckoutOpen}
  onOpenChange={setBundleCheckoutOpen}
  productName="The New Manager Bundle"
  price={747}
  priceDisplay="R747"
/>
```

---

## Mobile Responsiveness

Following existing patterns:
- Hero text sizes: `text-4xl sm:text-5xl md:text-6xl`
- Section padding: `py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8`
- Grid layouts: `grid-cols-1 md:grid-cols-2` for product cards
- Button sizes: Consistent with site-wide patterns

---

## Summary of Changes

1. **Create** `src/pages/Products.tsx` - A 7-section products catalog page using the site's established teal/white design system (not the standalone Navy/Gold palette from NewManagerKit)

2. **Modify** `src/App.tsx` - Register the `/products` route

3. **Modify** `src/components/Header.tsx` - Add "Products" link to desktop navigation (between Home and Programmes) and mobile menu

The page will feel integrated with the rest of the site while still highlighting products effectively. The individual product pages (like NewManagerKit) will maintain their standalone branding for focused sales funnels.


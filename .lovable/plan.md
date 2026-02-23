
The user wants to update the primary headline on the homepage to reflect a shift in branding from a South Africa-focused tagline to a more future-oriented one.

### Proposed Changes

#### 1. Update Hero Headline
- **File**: `src/components/Hero.tsx`
- **Change**: Replace the current text in the `<h1>` tag:
  - From: `The Leadership Partner Trusted by South Africa's Most Forward-Thinking Organisations`
  - To: `The Leadership Partner Trusted by Future Forward-Thinking Organisations`

#### 2. Update SEO Metadata (Consistency)
- **File**: `src/pages/Index.tsx`
- **Change**: Update the SEO title to be more aligned with the new tagline if it currently emphasizes South Africa specifically in the title tag.
- **File**: `index.html`
- **Change**: Update the `<title>` tag and Open Graph titles to reflect the new direction where appropriate.

### Technical Details
- The change is a direct text replacement in the `Hero` component.
- I will ensure the typography and styling remain consistent (using the `font-serif` and responsive text sizes already in place).

### User Confirmation
- I will implement the exact wording provided: "Future Forward-Thinking Organisations".


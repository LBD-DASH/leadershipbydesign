

## Plan: The Lunchtime Series Podcast Integration

This plan integrates "The Lunchtime Series with Kevin Britz" podcast into the website, featuring leadership conversations on coaching, marketing, and organizational development. All content reinforces the "improving leadership" theme throughout.

---

### Overview

**Podcast Details:**
- **Name:** The Lunchtime Series with Kevin Britz
- **Spotify Show ID:** `34amsn8UPkBhY0dRZYFf1u`
- **Cover Art:** Available from Spotify CDN
- **Category:** Business / Leadership

**Key Episodes to Feature:**
1. Seven Key Workplace Trends Shaping 2026 (38 min)
2. From Prison Psychology to Boardrooms - with Nick Kinley (38 min)
3. Are Leaders Reflecting Deeply Enough? (29 min)
4. The Employee Brand Proposition (32 min)
5. Strategic Ambiguity vs. Clarity in Leadership (24 min)
6. Are You a Boss or a Leader? (available)

---

### What Will Be Built

**1. New Podcast Listing Page** (`/podcast`)
- Hero section with podcast branding and "Leadership Conversations" tagline
- Grid of episode cards showing all episodes
- Each card has: cover art, title, description, duration, Spotify link
- "Listen on Spotify" button opens episode directly

**2. Episode Detail Pages** (`/podcast/:slug`)
- Large episode artwork
- Full episode description with timestamps
- Embedded Spotify player (iframe)
- Social share buttons (reusing existing component)
- Related episodes section
- Back to all episodes navigation

**3. Resources Page Update**
- New "Leadership Podcast" section after "Video Content"
- Shows 3 most recent episodes with listen buttons
- "View All Episodes" link to main podcast page

**4. Navigation Updates**
- Add "Podcast" to Resources dropdown in header
- Add `/podcast` to active state tracking

---

### Architecture

**New Files:**

| File | Purpose |
|------|---------|
| `src/data/podcastEpisodes.ts` | Centralized episode data with Spotify IDs |
| `src/pages/Podcast.tsx` | Main podcast listing page |
| `src/pages/PodcastEpisode.tsx` | Individual episode detail page |

**Modified Files:**

| File | Changes |
|------|---------|
| `src/App.tsx` | Add routes `/podcast` and `/podcast/:slug` |
| `src/components/Header.tsx` | Add "Podcast" to Resources dropdown and active state |
| `src/pages/Resources.tsx` | Add podcast section with 3 featured episodes |

---

### Episode Data Structure

```text
Each episode will include:
- id: unique slug (e.g., "seven-workplace-trends-2026")
- spotifyId: Spotify episode ID for embedding and direct links
- title: Episode title
- description: Leadership-focused summary (2-3 sentences)
- fullDescription: Complete show notes with timestamps (optional)
- duration: Runtime (e.g., "38 min")
- publishedDate: ISO date string
- guest: Optional guest name
- guestTitle: Optional guest credentials
```

**Initial Episodes (6 episodes from Spotify):**
1. Seven Key Workplace Trends Shaping 2026
2. From Prison Psychology to Boardrooms (Guest: Nick Kinley)
3. Are Leaders Reflecting Deeply Enough?
4. The Employee Brand Proposition (Guest: Craig Page-Lee)
5. Strategic Ambiguity vs. Clarity in Leadership
6. Are You a Boss or a Leader?

---

### UI Components and Patterns

**Reusing Existing Components:**
- `Card`, `CardHeader`, `CardContent`, `CardTitle`, `CardDescription`
- `Button` with Spotify branding colors
- `SocialShareButtons` component for episode sharing
- `SEO` component for meta tags
- `Header` and scroll animations from other pages

**New Podcast-Specific Elements:**
- Spotify embedded player (iframe with episode ID)
- Duration badge with Headphones icon
- "Listen on Spotify" branded button (green accent)

---

### Leadership Theme Integration

All content emphasizes leadership development:

- **Hero Title:** "The Lunchtime Series" with subtitle "Leadership Conversations That Drive Results"
- **Section Headers:** "Leadership Podcast" on Resources page
- **Episode Descriptions:** Rewritten to highlight leadership insights and actionable takeaways
- **Episode Tags:** Leadership, Coaching, Culture, Strategy

---

### Technical Details

**Spotify Embed Format:**
```html
<iframe 
  src="https://open.spotify.com/embed/episode/{EPISODE_ID}"
  width="100%"
  height="352"
  frameborder="0"
  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
  loading="lazy"
/>
```

**Direct Spotify Link Format:**
```text
https://open.spotify.com/episode/{EPISODE_ID}
```

**Podcast Show Link:**
```text
https://open.spotify.com/show/34amsn8UPkBhY0dRZYFf1u
```

**Cover Art (from Spotify CDN):**
```text
https://i.scdn.co/image/ab67656300005f1fbd7d01ac2fb952cad2882b23
```

---

### Implementation Sequence

1. Create `src/data/podcastEpisodes.ts` with 6 episodes
2. Create `src/pages/Podcast.tsx` listing page
3. Create `src/pages/PodcastEpisode.tsx` detail page
4. Update `src/App.tsx` with new routes
5. Update `src/components/Header.tsx` navigation
6. Update `src/pages/Resources.tsx` with podcast section

---

### Sample Episode Content

**Episode 1: Seven Key Workplace Trends Shaping 2026**
- Duration: 38 min
- Guest: Craig Paisley
- Description: "Join Kevin and marketing communications expert Craig Paisley as they explore seven critical workplace trends reshaping how organizations operate. From AI integration to leadership evolution, discover actionable insights for leaders navigating unprecedented change."

**Episode 2: From Prison Psychology to Boardrooms**
- Duration: 38 min
- Guest: Nick Kinley (Author, The Power Trap)
- Description: "Award-winning psychologist Nick Kinley reveals why power changes leaders and how to avoid the silent traps that cause most leaders to lose their effectiveness. Essential listening for any leader seeking to stay grounded and human."

---

### SEO Considerations

**Podcast Page Meta:**
- Title: "The Lunchtime Series | Leadership Podcast | Leadership by Design"
- Description: "Tune into The Lunchtime Series with Kevin Britz for inspiring conversations on leadership, coaching, and organizational transformation."
- Keywords: leadership podcast, executive coaching, leadership development, Kevin Britz

**Episode Page Meta:**
- Dynamic title: "{Episode Title} | The Lunchtime Series"
- Dynamic description from episode summary


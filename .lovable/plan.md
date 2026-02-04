
# The Sovereign Life-OS Dashboard

## Overview
Build a premium, high-performance personal "Life-OS" dashboard based on the reference designs provided. The UI blends the sophistication of a premium banking app with the intentionality of a Zen meditation tool - featuring a sophisticated dark mode, glassmorphism effects, and elegant Framer Motion animations.

## Visual Design System

### Aesthetic Direction (From Reference Images)
- **Theme**: Sophisticated Dark Mode with deep charcoals (#0a0a14, #12121e)
- **Glassmorphism**: Frosted glass cards with backdrop blur and subtle golden borders
- **Typography**: Inter for body text, Playfair Display for headings (already in place)
- **Accent Color**: Champagne Gold (#d4af37) for highlights, borders, and interactive elements
- **Pillar Colors**: 
  - Vitality: Emerald green
  - Sovereignty: Champagne gold
  - Connection: Rose/coral
  - Wisdom: Violet/purple

### Key UI Elements from Reference
- Crown logo icon with gradient
- Settings cog icon in header
- Rounded pill buttons with gold accents
- Diamond-shaped radar chart (not circular)
- Card slots with rounded corners and subtle gradients
- Bottom navigation bar with icons
- Forest/nature imagery for Zen Mode background

---

## Feature Components

### 1. Morning Muster Header
From the reference design:
- "GOOD MORNING, MARCUS" greeting with time-based logic
- "Morning Muster" title with inspirational quote
- "NORTHSTAR VISION" section - editable vision statement
- Subtle label styling with gold accents

### 2. One Big Move Selector
- "FOCUS" toggle button on the right
- Pill-style chips for focus areas (e.g., "Strategic Expansion", "Legacy Building")
- Gold border on active selection
- Star/sparkle icon on selected item

### 3. Leadership Scorecard (Diamond Radar)
From the reference:
- **Diamond-shaped** radar chart (rotated 45 degrees), not circular
- 4 vertices: VITALITY (top), SOVEREIGNTY (right), CONNECTION (bottom), WISDOM (left)
- Gold outline with filled area
- Stats below: "PEAK STATE 88%" and "CONSISTENCY 14d"

### 4. Digital Garden
From the reference:
- 4 card slots labeled: MIND, BODY, SOUL, IMPACT
- Subtle gold/olive gradient backgrounds when active
- Desaturated/foggy appearance when habits missed
- Rounded corners matching the overall design

### 5. Bento Grid Elements
- **Habit Streaks**: "24 Day COLD PLUNGE STREAK" with gold sparkle icon
- **Energy Sparkline**: Small wave graph showing "Optimal flow state"
- **Identity Gallery**: Carousel of vision board images with + button to add

### 6. Zen Focus Mode (Full Screen)
From the first reference image:
- Full-screen overlay with forest background image
- "THE SOVEREIGN" header with crown icon
- "CURRENT STATE: Zen Focus Active" label
- Large countdown timer: HH:MM:SS format
- "ONE BIG MOVE" highlighted task
- "Complete Intent" button with more options menu
- Inspirational quote at bottom
- "FOCUS MODE" toggle switch
- Bottom navigation: HOME | ZEN | GROWTH

### 7. Bottom Navigation Bar
- 5 icons: BASE, GROWTH, JOURNAL, SELF (visible in reference)
- Active state with label, inactive just icon
- Consistent positioning across all views

---

## Database Schema

New tables required (with RLS policies for user data protection):

```text
life_os_profiles
- id (uuid, PK)
- user_id (uuid, references auth.users)
- display_name (text)
- north_star_vision (text)
- avatar_url (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)

life_os_pillars
- id (uuid, PK)
- user_id (uuid)
- pillar_name (text) - Vitality/Sovereignty/Connection/Wisdom
- current_score (integer, 0-100)
- target_score (integer, 0-100, default 100)
- updated_at (timestamp)

life_os_habits
- id (uuid, PK)
- user_id (uuid)
- pillar_id (uuid, FK)
- name (text)
- icon (text, nullable)
- frequency (text) - daily/weekly
- streak_count (integer, default 0)
- last_completed_at (timestamp, nullable)
- is_active (boolean, default true)
- created_at (timestamp)

life_os_habit_logs
- id (uuid, PK)
- habit_id (uuid, FK)
- user_id (uuid)
- completed_at (timestamp)
- notes (text, nullable)

life_os_focus_tasks
- id (uuid, PK)
- user_id (uuid)
- title (text)
- category (text) - e.g., "Strategic Expansion", "Legacy Building"
- is_current (boolean, default false)
- is_completed (boolean, default false)
- target_minutes (integer, nullable)
- completed_at (timestamp, nullable)
- date (date)
- created_at (timestamp)

life_os_mood_logs
- id (uuid, PK)
- user_id (uuid)
- energy_level (integer, 1-10)
- flow_state (text, nullable) - e.g., "Optimal flow state"
- logged_at (timestamp)
- notes (text, nullable)

life_os_garden_slots
- id (uuid, PK)
- user_id (uuid)
- slot_name (text) - Mind/Body/Soul/Impact
- growth_level (integer, 0-100)
- is_active (boolean)
- last_updated (timestamp)

life_os_vision_images
- id (uuid, PK)
- user_id (uuid)
- image_url (text)
- caption (text, nullable)
- position (integer)
- created_at (timestamp)
```

---

## File Structure

| File | Purpose |
|------|---------|
| `src/pages/LifeOS.tsx` | Main dashboard page with authentication check |
| `src/pages/LifeOSAuth.tsx` | Login/signup page for Life-OS |
| `src/components/life-os/LifeOSLayout.tsx` | Dark theme wrapper with bottom nav |
| `src/components/life-os/MorningMuster.tsx` | Header with greeting and North Star |
| `src/components/life-os/OneBigMove.tsx` | Focus task selector with pills |
| `src/components/life-os/LeadershipScorecard.tsx` | Diamond radar chart |
| `src/components/life-os/DigitalGarden.tsx` | 4-slot garden visualization |
| `src/components/life-os/HabitStreaks.tsx` | Streak counter cards |
| `src/components/life-os/EnergySparkline.tsx` | Mood/energy mini chart |
| `src/components/life-os/IdentityGallery.tsx` | Vision board image carousel |
| `src/components/life-os/ZenMode.tsx` | Full-screen focus overlay |
| `src/components/life-os/FocusTimer.tsx` | Countdown timer component |
| `src/components/life-os/BottomNav.tsx` | Navigation bar |
| `src/components/life-os/SettingsSheet.tsx` | Settings slide-out panel |
| `src/hooks/useLifeOS.ts` | Data fetching and state management |
| `src/lib/lifeOSScoring.ts` | Pillar score calculations |

---

## Implementation Phases

### Phase 1: Foundation
1. Create database tables with RLS policies (user-scoped access)
2. Build authentication page for Life-OS users
3. Create dark theme CSS variables specific to Life-OS
4. Implement `LifeOSLayout.tsx` with bottom navigation
5. Build `MorningMuster.tsx` with greeting logic

### Phase 2: Core Dashboard
1. Implement `OneBigMove.tsx` selector component
2. Create `LeadershipScorecard.tsx` with Recharts RadarChart (diamond shape)
3. Build `DigitalGarden.tsx` with 4 slot cards
4. Add habit management and streak tracking

### Phase 3: Data Visualization
1. Create `EnergySparkline.tsx` with Recharts AreaChart
2. Build `HabitStreaks.tsx` with gold accent styling
3. Implement `IdentityGallery.tsx` with image upload to storage

### Phase 4: Zen Mode and Polish
1. Build `ZenMode.tsx` full-screen overlay
2. Create `FocusTimer.tsx` with countdown functionality
3. Add keyboard shortcuts (Cmd/Ctrl + Z for Zen Mode)
4. Smooth Framer Motion transitions between views
5. Responsive mobile optimization
6. Add `SettingsSheet.tsx` for profile editing

---

## Technical Considerations

### Authentication
- Uses existing `useAuth` hook
- RLS policies ensure users only see their own data
- Redirect unauthenticated users to `/life-os/auth`

### Styling Approach
- Create a `.life-os` wrapper class that applies the dark theme
- Use CSS custom properties for Life-OS specific colors
- Glassmorphism via `backdrop-blur-lg` and `bg-black/40` patterns
- Gold accent color: `#d4af37`

### Recharts Radar Chart (Diamond Shape)
```tsx
<RadarChart cx="50%" cy="50%" outerRadius="80%" data={pillarData}>
  <PolarGrid stroke="#d4af37" />
  <PolarAngleAxis dataKey="pillar" tick={{ fill: '#888' }} />
  <Radar name="Score" dataKey="value" stroke="#d4af37" fill="#d4af37" fillOpacity={0.3} />
</RadarChart>
```
Start angle adjusted to create diamond orientation.

### Animations
- Page transitions: `framer-motion` layout animations
- Zen Mode: Fade + scale transition (0.4s ease-out)
- Garden growth: SVG path animations
- Timer: Smooth number transitions

### Responsive Design
- Mobile-first approach (matches reference designs)
- Desktop: Expanded bento grid with sidebar
- Tablet: 2-column layout
- Mobile: Stacked cards with bottom navigation

---

## Route Addition

Add to `App.tsx`:
```tsx
import LifeOS from "./pages/LifeOS";
import LifeOSAuth from "./pages/LifeOSAuth";

// In Routes:
<Route path="/life-os" element={<LifeOS />} />
<Route path="/life-os/auth" element={<LifeOSAuth />} />
```

---

## Storage Requirements

For Identity Gallery images:
- Create `vision-images` storage bucket
- RLS policy: Users can only upload/view their own images
- Accept image/* mime types
- Max file size: 5MB



# AI-Powered Lead Scoring & Notification System

## Overview

This plan implements an intelligent lead management system that:
1. Scores every lead based on multiple factors (role, company size, urgency signals, etc.)
2. Uses AI (Anthropic Claude) to analyze each lead and generate personalized insights
3. Sends temperature-based email notifications (Hot leads get urgent alerts, Warm leads get standard notifications)
4. Applies to all 5 existing lead capture forms on your website

---

## Current Lead Capture Forms

Your website has 5 lead capture points that will benefit from this system:

| Form | Location | Fields Captured |
|------|----------|-----------------|
| Leadership Mistakes Checklist | `/leadership-mistakes` | Name, Email |
| Leadership Diagnostic Gate | `/leadership-diagnostic` | Name, Email, Organisation, Role, Follow-up Preference |
| Team Diagnostic Gate | `/team-diagnostic` | Name, Email, Organisation, Role, Follow-up Preference |
| SHIFT Diagnostic Gate | `/shift-diagnostic` | Name, Email, Organisation, Role, Follow-up Preference |
| Contact Form | `/contact` | Name, Email, Company, Role, Service Interest, Message |

---

## Implementation Plan

### Phase 1: Create Lead Scoring Utilities

**New file: `src/lib/leadScoring.ts`**

Create a utility that scores leads based on:
- **Role weight** (C-suite = 30pts, Director = 25pts, Manager = 20pts, etc.)
- **Company signals** (organization provided = +10pts)
- **Urgency signals** ("yes" follow-up = 30pts, "maybe" = 15pts)
- **Message quality** (longer messages = higher intent)
- **Source multiplier** (diagnostics = 1.2x, contact form = 1.3x)

Temperature classification:
- **Hot (70-100)**: Immediate action required
- **Warm (40-69)**: Follow up within 24-48 hours
- **Cool (0-39)**: Nurture sequence only

---

### Phase 2: Create AI Analysis Edge Function

**New file: `supabase/functions/analyze-lead/index.ts`**

This function will:
1. Accept lead data and score
2. Call the Anthropic API to generate:
   - Buyer persona identification
   - Personalized outreach recommendations
   - Conversation starters based on their diagnostic results
   - Urgency assessment
3. Return AI analysis for inclusion in notification emails

Example AI prompt:
```text
Analyze this leadership development lead:
- Name: [name], Role: [role], Company: [company]
- Diagnostic: Leadership Level [L3] - Purpose Leadership
- Follow-up preference: [yes - ready for call]

Provide: 1) Buyer persona, 2) Key pain points likely, 
3) Recommended approach, 4) Suggested opening line
```

---

### Phase 3: Create Lead Notification Edge Function

**New file: `supabase/functions/send-lead-notification/index.ts`**

This function will:
1. Accept lead data, score, and AI analysis
2. Generate beautifully formatted HTML emails based on temperature:
   - **Hot leads**: Red/orange alert styling, "IMMEDIATE ACTION" header, sends to both Kevin AND Lauren
   - **Warm leads**: Blue styling, standard notification, sends to Kevin only
   - **Cool leads**: No email, just database storage
3. Include quick-action buttons (Reply, Book Call)
4. Display diagnostic insights and AI recommendations

---

### Phase 4: Integrate with Existing Forms

**Modify these files to add lead scoring:**

1. **`src/pages/LeadershipDiagnostic.tsx`**
   - After saving submission, call lead scoring
   - Invoke `analyze-lead` edge function
   - Invoke `send-lead-notification` with results

2. **`src/pages/ShiftDiagnostic.tsx`**
   - Same integration pattern

3. **`src/pages/TeamDiagnostic.tsx`**
   - Same integration pattern

4. **`src/pages/LeadershipMistakes.tsx`**
   - Score with limited data (name, email only)
   - Lower base score but still tracked

5. **`src/pages/Contact.tsx`**
   - Highest potential score (they're actively reaching out)
   - Full AI analysis with message context

---

### Phase 5: Create Shared Hook

**New file: `src/hooks/useLeadNotification.ts`**

A reusable hook that handles:
- Score calculation
- Edge function calls
- Error handling
- Loading states

This keeps the integration clean across all forms.

---

## Technical Details

### Lead Scoring Logic

```text
Base Score Components:
+30 - C-suite role (CEO, Founder, MD)
+25 - Director level
+20 - Manager level
+15 - Other specified role
+10 - Organisation provided
+30 - Follow-up: "Yes, ready now"
+15 - Follow-up: "Maybe later"
+10 - Team size 50+
+5  - Team size 11-50

Multipliers:
x1.3 - Contact form (direct inquiry)
x1.2 - Diagnostic completion
x1.1 - Lead magnet download

Temperature:
70+ = HOT (immediate notification)
40-69 = WARM (standard notification)
0-39 = COOL (no immediate email)
```

### Email Recipients

| Temperature | Recipients | Subject Format |
|-------------|------------|----------------|
| Hot | kevin@kevinbritz.com, lauren@kevinbritz.com | "HOT LEAD: [Name] from [Company]" |
| Warm | kevin@kevinbritz.com only | "Warm Lead: [Name]" |
| Cool | No email | Database only |

### Database Updates

No schema changes required - all data is already captured. The scoring happens in real-time when the form submits.

---

## Files to Create

1. `src/lib/leadScoring.ts` - Scoring logic and types
2. `supabase/functions/analyze-lead/index.ts` - AI analysis
3. `supabase/functions/send-lead-notification/index.ts` - Email notifications
4. `src/hooks/useLeadNotification.ts` - Reusable integration hook

## Files to Modify

1. `src/pages/LeadershipDiagnostic.tsx` - Add lead scoring call
2. `src/pages/ShiftDiagnostic.tsx` - Add lead scoring call
3. `src/pages/TeamDiagnostic.tsx` - Add lead scoring call
4. `src/pages/LeadershipMistakes.tsx` - Add lead scoring call
5. `src/pages/Contact.tsx` - Add lead scoring call
6. `supabase/config.toml` - Register new edge functions

---

## Expected Outcome

After implementation:
- Every lead is automatically scored on submission
- AI analyzes each lead's likely pain points and persona
- Hot leads trigger immediate alerts to both Kevin and Lauren
- Warm leads get standard notifications to Kevin
- All emails include actionable insights and quick-reply buttons
- No changes to user-facing forms - all happens behind the scenes


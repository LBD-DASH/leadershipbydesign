

# AI/Workplace Integration Implementation Plan

## Overview

This plan integrates AI/Workplace Integration guidance into Leadership by Design's existing platform, leveraging the SHIFT Methodology as the foundation for "Human Skills in the AI Age" while maintaining the core focus of helping humans gain an edge in an AI-augmented world.

---

## Phase 1: Content Enhancement

### 1.1 New Programme: "Leading in the AI Era"

**File:** `src/data/adminProgrammesData.ts`

Add a new programme entry with 6 lessons aligned to AI-readiness:

| Lesson | Focus | Practicals |
|--------|-------|------------|
| 1. Understanding AI in the Workplace | AI capabilities/limitations, human-AI collaboration spectrum | AI Impact Assessment, Team Readiness Survey |
| 2. The Human Edge | Tasks humans do better than AI, irreplaceable value areas | Task Mapping Exercise, Value Analysis |
| 3. SHIFT Skills for the AI Era | Self-Management for AI anxiety, Human Intelligence AI cannot replicate | SHIFT Skills AI Audit, Personal Development Plan |
| 4. Ethical AI Leadership (POPI Act) | Compliance, bias recognition, responsible decision-making | Ethics Checklist, Policy Review Template |
| 5. Building AI-Augmented Workflows | Practical integration, maintaining oversight | Workflow Mapping, Pilot Project Design |
| 6. Leading AI-Driven Change | Communication strategies, managing resistance | Change Communication Plan, Action Board Presentation |

**Programme Metadata:**
- Level: Executive/Cross-functional
- Duration: 6 weeks
- Format: Online LMS Portal | Hard Copy | Online Coaching

---

### 1.2 Enhance SHIFT Methodology Page

**File:** `src/pages/ShiftMethodology.tsx`

Add an "AI Edge" subsection that positions SHIFT skills as the human capabilities that give leaders an edge in an AI world (while preserving the core SHIFT methodology focus):

| SHIFT Skill | AI Edge Context |
|-------------|-----------------|
| Self-Management | Regulating anxiety about AI disruption; maintaining composure during technological change |
| Human Intelligence | The skill AI cannot replicate—empathy, trust-building, reading the room |
| Innovation | Using AI as a creative tool, not replacement; questioning AI outputs |
| Focus | Cutting through AI-generated noise; staying aligned to human outcomes |
| Thinking | Critical evaluation of AI recommendations; maintaining human judgment |

**Implementation:**
- Add a new section titled "SHIFT Skills: Your Edge in an AI World"
- Position below the existing Five SHIFT Skills section
- Include a call-to-action for the new AI-Ready Diagnostic

---

## Phase 2: Leadership Capability Diagnostic (AI-Ready)

### 2.1 New Diagnostic Questions

**New File:** `src/data/aiReadinessQuestions.ts`

Create a diagnostic with 5 categories (4 questions each = 20 questions total):

| Category | Focus | Sample Questions |
|----------|-------|------------------|
| AI Awareness | Understanding AI capabilities | "I understand which tasks AI can and cannot do effectively" |
| Human-AI Collaboration | Working WITH AI effectively | "My team effectively uses AI tools without over-relying on them" |
| Change Readiness | Preparing for AI adoption | "I proactively prepare my team for technological changes" |
| Ethical AI Leadership | POPI Act, bias, compliance | "I ensure AI use in my team complies with data protection requirements" |
| Human Skills Investment | SHIFT skills development | "I invest in developing my team's uniquely human skills" |

**Scoring Logic:**
- Higher scores = More AI-ready leadership
- Lower scores = Recommend "Leading in the AI Era" programme
- Scoring thresholds:
  - 75+ = AI-Ready Leader (affirm strengths, suggest advanced topics)
  - 50-74 = Developing (recommend specific modules)
  - Below 50 = Foundation Building (recommend full programme)

---

### 2.2 AI-Readiness Scoring System

**New File:** `src/lib/aiReadinessScoring.ts`

```text
Categories scored:
- AI Awareness (Q1-4)
- Human-AI Collaboration (Q5-8)
- Change Readiness (Q9-12)
- Ethical AI Leadership (Q13-16)
- Human Skills Investment (Q17-20)

Results Logic:
- primaryRecommendation: "ai-leadership" programme
- secondaryRecommendation: Weakest SHIFT skill module
- Overall Score determines intensity of recommendation
```

---

### 2.3 Diagnostic Page & Components

**New Files:**
- `src/pages/AIReadinessDiagnostic.tsx` - Main diagnostic page
- `src/pages/AIReadinessDiagnosticLanding.tsx` - Landing page (following ScoreApp-style funnel)
- `src/components/ai-diagnostic/AIReadinessForm.tsx` - Question form component
- `src/components/ai-diagnostic/AIReadinessQuestionRating.tsx` - Rating component
- `src/components/ai-diagnostic/AIReadinessResults.tsx` - Results display

**Funnel Flow:**
1. Landing Page with 3 strategic reasons to take the diagnostic
2. Questionnaire (20 questions, 5 categories)
3. Lead Capture Gate (Name/Email required; Company/Role optional)
4. Results Page with:
   - Overall AI-Readiness Score
   - Category breakdown radar chart
   - Primary recommendation: "Leading in the AI Era" programme
   - Secondary: Specific SHIFT skill development

---

### 2.4 Database Schema Update

**Migration:**

```sql
CREATE TABLE IF NOT EXISTS ai_readiness_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  answers JSONB NOT NULL,
  ai_awareness_score INTEGER,
  human_ai_collab_score INTEGER,
  change_readiness_score INTEGER,
  ethical_ai_score INTEGER,
  human_skills_score INTEGER,
  overall_score INTEGER,
  readiness_level TEXT,
  primary_recommendation TEXT,
  name TEXT,
  email TEXT,
  organisation TEXT,
  role TEXT,
  follow_up_preference TEXT,
  waiting_list BOOLEAN DEFAULT FALSE,
  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  -- Lead scoring (unified schema)
  lead_score INTEGER,
  lead_temperature TEXT,
  buyer_persona TEXT,
  company_size TEXT,
  urgency TEXT,
  ai_analysis TEXT,
  next_action TEXT,
  scoring_breakdown JSONB
);
```

---

### 2.5 Route Registration

**File:** `src/App.tsx`

Add routes:
- `/ai-readiness` - Landing page
- `/ai-readiness-diagnostic` - Diagnostic questionnaire

---

## Phase 3: Resources Section Enhancement

### 3.1 Add AI & Workplace Integration Category

**File:** `src/pages/Resources.tsx`

Add a new section titled "AI & Workplace Integration" with:

| Resource | Type | Description |
|----------|------|-------------|
| Preparing Your Team for AI Integration | Guide | Lead magnet linking to AI-Readiness Diagnostic |
| The 5 Human Skills AI Cannot Replace | Article | Blog post linking SHIFT skills to AI resilience |
| POPI Act Compliance in AI Adoption | Guide | SA-specific compliance considerations |

---

## Technical Summary

### Files to Create

| File | Purpose |
|------|---------|
| `src/data/aiReadinessQuestions.ts` | Question definitions and categories |
| `src/lib/aiReadinessScoring.ts` | Scoring logic and recommendations |
| `src/pages/AIReadinessDiagnostic.tsx` | Main diagnostic page |
| `src/pages/AIReadinessDiagnosticLanding.tsx` | Landing page |
| `src/components/ai-diagnostic/AIReadinessForm.tsx` | Form component |
| `src/components/ai-diagnostic/AIReadinessQuestionRating.tsx` | Rating component |
| `src/components/ai-diagnostic/AIReadinessResults.tsx` | Results component |

### Files to Modify

| File | Changes |
|------|---------|
| `src/data/adminProgrammesData.ts` | Add "Leading in the AI Era" programme with 6 lessons |
| `src/pages/ShiftMethodology.tsx` | Add "SHIFT Skills: Your Edge in an AI World" section |
| `src/pages/Resources.tsx` | Add "AI & Workplace Integration" resources section |
| `src/App.tsx` | Add diagnostic routes |
| `src/utils/leadScoring.ts` | Add AI-readiness diagnostic support |
| `src/utils/notifications.ts` | Add AI-readiness lead processing |

### Database Migration

- Create `ai_readiness_submissions` table following the unified lead schema

---

## Key Design Decisions

1. **Positioning**: SHIFT skills remain the core methodology—AI integration is positioned as an *application* of SHIFT skills, not a replacement. The messaging focuses on "getting the human edge on AI" rather than replacing SHIFT's purpose.

2. **Scoring Philosophy**: Lower diagnostic scores indicate gaps in AI-ready leadership, triggering a recommendation for the "Leading in the AI Era" programme. This reverses the typical "problem detection" approach used in Team Diagnostic.

3. **Lead Funnel**: Follows the established ScoreApp-style pattern (Landing → Questionnaire → Lead Capture → Results) used by Leadership, Team, and SHIFT diagnostics.

4. **SA Context**: POPI Act compliance is explicitly included in ethical AI content, addressing the South African market specifically.

5. **Programme Placement**: The new AI programme is positioned as cross-functional (not tied to a specific L1-L5 level), accessible to leaders at any stage.


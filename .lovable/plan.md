

# Prospecting Engine Overhaul: HR-Focused Discovery & Automation

## Summary

A complete overhaul of the prospecting system to focus on **HR decision-makers** (not CEOs), enforce **50-800 staff size limits**, ensure **emails are actually sent**, and guarantee **real-time notifications** when prospects engage.

---

## Current Problems Identified

1. **Wrong contact focus**: System extracts CEOs/leadership, but you need **HR/People/L&D heads**
2. **Wrong company sizes**: Database shows "enterprise" companies (Coca-Cola, Mimecast, etc.) instead of 50-800 staff
3. **No HR contacts found**: Most prospects have empty `hr_contacts` arrays
4. **No emails sent**: Only 1 outreach email ever sent; no sequences are active
5. **Industries need updating**: Need to focus on Manufacturing, Tech, Mining, Engineering for February
6. **LinkedIn integration missing**: No direct "Connect" button for HR contacts
7. **Follow-up window too restrictive**: Tue-Thu only means 4 days/week of silence

---

## Implementation Plan

### 1. Update Industry Configuration

**Database Update**: Update `prospecting_config` table to:
- Disable Healthcare
- Add Mining industry
- Keep Manufacturing, Technology, Engineering
- Ensure all have company_size = "50-800"

```text
Industries for February:
├── Manufacturing  (active, 50-800)
├── Technology     (active, 50-800)
├── Mining        (active, 50-800)  [NEW]
└── Engineering   (active, 50-800)
```

---

### 2. Enhance AI Discovery Prompt (`find-companies`)

Update the edge function to:
- **Explicitly exclude enterprise companies** (>800 employees)
- **Prioritize mid-market SMEs** with 50-800 staff
- Add validation to reject companies that are clearly too large

Key prompt changes:
```text
"Generate 8-10 REAL ${industry} companies in ${location} with 50-800 employees.
 EXCLUDE: Listed companies, multinationals, companies with 'Limited' or 'Holdings'.
 FOCUS: Owner-managed, family businesses, regional players, growth-stage firms."
```

---

### 3. Overhaul Company Research for HR Focus (`firecrawl-company-research`)

Current AI prompt asks for leadership team first, HR contacts second. This reversal is critical:

**Priority Changes**:
1. **HR contacts as PRIMARY focus** - Head of HR, People Director, L&D Manager, Talent Lead
2. **LinkedIn search URLs** for each HR contact (already implemented but not finding contacts)
3. **Add industry-specific HR role variations**:
   - Mining: "Training & Development Officer", "SHEQ Manager"
   - Manufacturing: "Industrial Relations Manager", "Plant HR Manager"
   - Tech: "VP People", "Chief People Officer", "Employee Experience Lead"

**Enhanced extraction prompt** to find HR contacts from:
- About/Team pages
- LinkedIn company pages
- Press releases mentioning HR hires
- Job listings (HR team expansion signals)

---

### 4. Add LinkedIn Connect Button for HR Contacts

Update `ProspectList.tsx` to include:
- A prominent **"Connect on LinkedIn"** button for each HR contact
- Opens LinkedIn search pre-filtered to that person + company
- Track click events for engagement metrics

Current code already has a "Find on LinkedIn" button. Enhance it to:
- Use a LinkedIn connection message template
- Copy suggested connection message to clipboard
- Track clicks in analytics

---

### 5. Fix Email Sequence Automation

**Root cause**: The `send-prospect-outreach` function creates sequences, but `process-follow-up-sequences` only runs Tue-Thu 8-10 AM SAST. Today is Sunday, so no emails send.

**Fixes**:
1. **Change schedule to DAILY** (Mon-Sun, 8-10 AM) for February testing
2. **Remove day-of-week restriction** in `isWithinSendWindow()`
3. **Ensure sequences are created** when first email is sent
4. **Verify cron jobs are running** by checking logs

**Modified schedule**:
```text
┌─ 8:00 AM SAST ─┐  Discovery pipeline runs
│                │
├─ 9:00 AM SAST ─┤  Follow-up sequences process  [DAILY now]
│                │
└─ 9:30 AM SAST ─┘  Daily digest email sent
```

---

### 6. Ensure Email Is Actually Sent

**Current issue**: Prospects have no `contact_email`, so outreach can't be sent.

**Solutions**:
1. **Require email extraction** in research - flag prospects without email as "needs_research"
2. **Add email discovery fallback**: If no email found on website, generate `info@company.com` as fallback
3. **Auto-start sequence** when first email is sent (already implemented, verify it works)
4. **Add "Send Test Email" button** in dashboard for debugging

---

### 7. Real-Time Hot Lead Notifications

**Current state**: `check-prospect-engagement` sends emails to Kevin and Lauren when a prospect clicks the diagnostic. This works but needs verification.

**Enhancements**:
1. **Add in-app toast notification** when engagement detected (if dashboard is open)
2. **Add browser push notification** option (optional future enhancement)
3. **Ensure UTM tracking** is present in all diagnostic links
4. **Test the full flow**: Click diagnostic link → Complete → Notification sent

---

### 8. Update Email Templates for HR Audience

Modify templates in `process-follow-up-sequences` to speak to HR buyers, not CEOs:

**Step 1 (Hot)**: 
- Reference "leadership capability across your management team"
- Mention ROI of leadership development

**Step 1 (Warm)**:
- Lead with the diagnostic tool
- Position as "quick win" for HR to assess team gaps

**Step 1 (Cool)**:
- Industry insight hook specific to HR challenges
- Reference turnover, engagement, manager effectiveness

---

### 9. Rate Limiting & POPIA Compliance

**Current limits** (keep):
- 10 new outreach per day
- 15 follow-ups per day
- 2-second delay between sends

**Add**:
- Unsubscribe tracking (already exists)
- "Do not email" status for prospects who unsubscribe
- Respect bounce tracking

---

### 10. Update Dashboard Features

**Add to ProspectList**:
1. **"No Email" filter** - Show prospects needing research
2. **"Hot Leads" filter** - Score 60+ with email
3. **"Pending Sequences"** indicator - Show which prospects have active sequences
4. **LinkedIn outreach tracker** - Log when you connected on LinkedIn

**Add to Automation tab**:
1. **Last run status** - Show when pipeline last ran
2. **Error log** - Show any failures
3. **"Run Sequences Now"** button for testing

---

## Technical Changes Summary

| File | Changes |
|------|---------|
| `supabase/functions/find-companies/index.ts` | Tighter company size prompt, exclude enterprise |
| `supabase/functions/firecrawl-company-research/index.ts` | HR-first extraction, industry-specific roles |
| `supabase/functions/process-follow-up-sequences/index.ts` | Remove Tue-Thu restriction, daily runs |
| `src/components/marketing/ProspectList.tsx` | Enhanced LinkedIn buttons, filters |
| `src/lib/emailTemplates.ts` | HR-focused messaging |
| Database: `prospecting_config` | Add Mining, update sizes to 50-800 |

---

## Immediate Actions After Approval

1. **Update prospecting_config** → Add Mining, verify 50-800 size
2. **Deploy updated edge functions** → HR focus + daily sends
3. **Trigger pipeline manually** → Discover new prospects
4. **Verify email sends** → Check Resend dashboard
5. **Test engagement flow** → Click diagnostic link → Verify notification

---

## Expected Outcome

After implementation:
- **Daily discovery** of 8-10 companies per industry (32-40 total)
- **HR contacts extracted** with LinkedIn search URLs
- **Automated 4-step sequences** running daily
- **Real-time alerts** when prospects engage
- **Clean dashboard** with hot lead prioritization


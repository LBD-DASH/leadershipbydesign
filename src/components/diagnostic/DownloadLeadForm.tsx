import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DiagnosticResult, workshopDetails } from "@/lib/diagnosticScoring";

interface DownloadLeadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionId: string | null;
  result: DiagnosticResult;
}

const workshopRoutes: Record<string, string> = {
  clarity: "/workshops/alignment",
  motivation: "/workshops/motivation",
  leadership: "/workshops/leadership"
};

export default function DownloadLeadForm({ 
  open, 
  onOpenChange, 
  submissionId,
  result
}: DownloadLeadFormProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const primaryWorkshop = workshopDetails[result.primaryRecommendation];

  const getWorkshopOutcomes = (key: string) => {
    const outcomes: Record<string, Array<{ title: string; description: string }>> = {
      clarity: [
        { title: "Clear Priorities", description: "Walk away with a shared understanding of what matters most—and what doesn't." },
        { title: "Decision Clarity", description: "Establish clear criteria for making decisions so your team can move faster with confidence." },
        { title: "Aligned Expectations", description: "Ensure everyone understands what success looks like and how their work contributes to it." },
        { title: "Reduced Meeting Chaos", description: "Create frameworks that make meetings productive rather than circular." },
        { title: "Proactive Execution", description: "Shift from reactive firefighting to planned, purposeful work." },
        { title: "Unified Direction", description: "Eliminate conflicting messages and give your team one clear path forward." }
      ],
      motivation: [
        { title: "Renewed Energy", description: "Reignite the passion and drive that gets people excited about their work." },
        { title: "Purpose Connection", description: "Help team members see how their daily work connects to something meaningful." },
        { title: "Engagement Boost", description: "Address the root causes of disengagement and create lasting motivation." },
        { title: "Psychological Safety", description: "Build an environment where people feel safe to contribute their best ideas." },
        { title: "Recognition Culture", description: "Establish meaningful ways to acknowledge contributions and celebrate wins." },
        { title: "Intrinsic Motivation", description: "Move beyond external rewards to tap into what truly drives your team." }
      ],
      leadership: [
        { title: "Clear Ownership", description: "Establish who owns what, eliminating confusion and dropped balls." },
        { title: "Empowered Decisions", description: "Give team members the authority and confidence to make decisions." },
        { title: "Accountability Culture", description: "Create an environment where people hold themselves and each other accountable." },
        { title: "Reduced Bottlenecks", description: "Stop decisions from getting stuck waiting for leadership approval." },
        { title: "Proactive Leadership", description: "Develop leaders at every level who anticipate problems and take initiative." },
        { title: "Trust & Autonomy", description: "Build the trust needed to delegate effectively and let go of micromanagement." }
      ]
    };
    return outcomes[key] || outcomes.clarity;
  };

  const getWorkshopSteps = (key: string) => {
    const steps: Record<string, Array<{ step: string; title: string; description: string }>> = {
      clarity: [
        { step: "01", title: "Priority Mapping", description: "We surface everyone's understanding of current priorities and identify where they diverge." },
        { step: "02", title: "Success Definition", description: "Together, we define what success actually looks like—in specific, measurable terms." },
        { step: "03", title: "Decision Framework", description: "We establish clear criteria for making decisions, reducing the need for constant escalation." },
        { step: "04", title: "Communication Protocol", description: "We create simple protocols for how priorities and changes will be communicated going forward." }
      ],
      motivation: [
        { step: "01", title: "Energy Audit", description: "We identify what's draining your team's energy and what activities create engagement." },
        { step: "02", title: "Purpose Mapping", description: "We connect individual roles to the bigger picture and meaningful outcomes." },
        { step: "03", title: "Recognition Design", description: "We create sustainable ways to acknowledge contributions that actually matter to people." },
        { step: "04", title: "Commitment Renewal", description: "We facilitate authentic recommitment to team goals and each other." }
      ],
      leadership: [
        { step: "01", title: "Ownership Mapping", description: "We clarify who owns what and identify gaps or overlaps in accountability." },
        { step: "02", title: "Decision Rights", description: "We establish clear decision-making authority at every level." },
        { step: "03", title: "Trust Building", description: "We address the barriers preventing leaders from delegating effectively." },
        { step: "04", title: "Accountability Agreements", description: "We create explicit agreements about how the team will hold each other accountable." }
      ]
    };
    return steps[key] || steps.clarity;
  };

  const generateWorkshopPDF = () => {
    const { scores, primaryRecommendation, secondaryRecommendation } = result;
    const workshop = workshopDetails[primaryRecommendation];
    const outcomes = getWorkshopOutcomes(primaryRecommendation);
    const steps = getWorkshopSteps(primaryRecommendation);
    
    const getWorkshopIcon = () => {
      if (primaryRecommendation === 'clarity') {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;
      } else if (primaryRecommendation === 'motivation') {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
      } else {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`;
      }
    };

    const getProblemText = () => {
      if (primaryRecommendation === 'clarity') {
        return {
          p1: "Your team is busy. Everyone's working hard. But somehow, outcomes remain inconsistent. Different people have different ideas about what success looks like. Priorities shift frequently, and meetings create more questions than answers.",
          p2: "This isn't a motivation problem. It's an alignment problem. And more effort won't fix it—only clarity will."
        };
      } else if (primaryRecommendation === 'motivation') {
        return {
          p1: "Your team knows what to do. They have the skills. But something's missing. Energy is low, enthusiasm has faded, and people are going through the motions rather than bringing their best.",
          p2: "This isn't a skills problem. It's an engagement problem. And pushing harder won't fix it—only reconnecting to purpose will."
        };
      } else {
        return {
          p1: "Your team has capable people. But decisions get stuck. Things fall through the cracks. People wait to be told what to do rather than taking initiative. Accountability feels like blame rather than ownership.",
          p2: "This isn't a competence problem. It's an ownership problem. And more oversight won't fix it—only empowerment will."
        };
      }
    };

    const getWhoText = () => {
      if (primaryRecommendation === 'clarity') {
        return "Leadership teams and cross-functional groups where effort is high but alignment is low. Ideal for teams experiencing frequent priority shifts, conflicting direction from different leaders, or a sense of \"busy but not productive.\"";
      } else if (primaryRecommendation === 'motivation') {
        return "Teams where the work is understood but energy and commitment are lacking. Ideal for groups experiencing burnout, disengagement, or a disconnect between effort and meaning.";
      } else {
        return "Teams with capable individuals where accountability is inconsistent. Ideal for groups where decisions get escalated unnecessarily, ownership is unclear, or initiative is rare.";
      }
    };

    const getIncludeTitle = () => {
      if (primaryRecommendation === 'clarity') return 'Values Assessment';
      if (primaryRecommendation === 'motivation') return '6 Human Needs Assessment';
      return 'Leadership Index';
    };

    const getIncludeDesc = () => {
      if (primaryRecommendation === 'clarity') {
        return 'Every participant completes our proprietary Values Assessment before the workshop. This reveals individual and collective values, helping the team understand what drives decision-making and where values may be creating invisible friction.';
      } else if (primaryRecommendation === 'motivation') {
        return 'Every participant completes our 6 Human Needs Assessment before the workshop. Based on proven psychological research, this reveals which core human needs are being met or unmet within the team environment.';
      } else {
        return 'Every participant completes our Leadership Index assessment before the workshop. This comprehensive tool measures key leadership behaviours including decision-making confidence and accountability ownership.';
      }
    };

    const problemText = getProblemText();
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${workshop.title} | Leadership by Design</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page { 
      margin: 0; 
      size: A4;
    }
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
    }
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      color: #0a0a0a;
      background: #ffffff;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      font-size: 14px;
    }
    
    /* Header */
    .header {
      background: #ffffff;
      padding: 16px 40px;
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 18px;
      font-weight: 700;
      color: #dc2626;
      letter-spacing: -0.5px;
    }
    .header-nav {
      font-size: 12px;
      color: #737373;
    }

    /* Hero Section */
    .hero {
      background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
      padding: 48px 40px;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #737373;
      font-size: 13px;
      margin-bottom: 32px;
      text-decoration: none;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .hero-icon-box {
      background: rgba(220, 38, 38, 0.1);
      padding: 12px;
      border-radius: 12px;
      color: #dc2626;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hero-duration {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #737373;
      font-size: 13px;
    }
    h1 {
      font-size: 40px;
      font-weight: 700;
      color: #0a0a0a;
      margin-bottom: 20px;
      line-height: 1.15;
      letter-spacing: -1px;
    }
    .hero-description {
      font-size: 17px;
      color: #525252;
      line-height: 1.7;
    }
    .hero-image {
      background: linear-gradient(135deg, #e5e5e5 0%, #d4d4d4 100%);
      border-radius: 16px;
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #a3a3a3;
      font-size: 14px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
    }

    /* Scores Section */
    .scores-section {
      background: #fff;
      padding: 32px 40px;
      border-bottom: 1px solid #e5e5e5;
    }
    .scores-header {
      font-size: 16px;
      font-weight: 600;
      color: #0a0a0a;
      margin-bottom: 20px;
    }
    .scores-grid {
      display: flex;
      gap: 20px;
    }
    .score-item {
      flex: 1;
      background: #fafafa;
      padding: 20px;
      border-radius: 16px;
      border: 1px solid #e5e5e5;
    }
    .score-item.primary {
      background: rgba(220, 38, 38, 0.05);
      border-color: #dc2626;
    }
    .score-label {
      font-size: 13px;
      color: #737373;
      margin-bottom: 4px;
    }
    .score-item.primary .score-label { color: #dc2626; }
    .score-value {
      font-size: 28px;
      font-weight: 700;
      color: #0a0a0a;
    }
    .score-item.primary .score-value { color: #dc2626; }
    .score-bar {
      height: 6px;
      background: #e5e5e5;
      border-radius: 3px;
      margin-top: 12px;
      overflow: hidden;
    }
    .score-fill {
      height: 100%;
      background: #737373;
      border-radius: 3px;
    }
    .score-item.primary .score-fill { background: #dc2626; }

    /* Problem Section */
    .problem-section {
      padding: 56px 40px;
    }
    .problem-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 56px;
    }
    .section-title {
      font-size: 26px;
      font-weight: 700;
      color: #0a0a0a;
      margin-bottom: 20px;
      letter-spacing: -0.5px;
    }
    .section-text {
      color: #525252;
      line-height: 1.75;
    }
    .section-text p {
      margin-bottom: 16px;
    }
    .section-text p:last-child {
      margin-bottom: 0;
    }
    .who-box {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    .who-icon {
      background: rgba(220, 38, 38, 0.1);
      padding: 10px;
      border-radius: 10px;
      color: #dc2626;
      flex-shrink: 0;
    }

    /* Outcomes Section */
    .outcomes-section {
      background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
      padding: 56px 40px;
      page-break-before: always;
    }
    .outcomes-header {
      text-align: center;
      margin-bottom: 40px;
    }
    .outcomes-header p {
      color: #525252;
      max-width: 560px;
      margin: 0 auto;
    }
    .outcomes-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .outcome-card {
      background: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 16px;
      padding: 20px;
      transition: border-color 0.2s;
    }
    .outcome-header {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .outcome-check {
      color: #dc2626;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .outcome-title {
      font-weight: 600;
      color: #0a0a0a;
      margin-bottom: 4px;
      font-size: 15px;
    }
    .outcome-desc {
      font-size: 13px;
      color: #525252;
      line-height: 1.6;
    }

    /* Process Section */
    .process-section {
      padding: 56px 40px;
    }
    .process-grid {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 56px;
    }
    .steps-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .step-item {
      display: flex;
      gap: 16px;
    }
    .step-number {
      width: 48px;
      height: 48px;
      background: rgba(220, 38, 38, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      color: #dc2626;
      flex-shrink: 0;
    }
    .step-content {
      padding-top: 8px;
    }
    .step-title {
      font-weight: 600;
      color: #0a0a0a;
      margin-bottom: 4px;
      font-size: 15px;
    }
    .step-desc {
      font-size: 13px;
      color: #525252;
      line-height: 1.6;
    }

    /* Includes Section */
    .includes-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .include-card {
      background: linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(220, 38, 38, 0.1) 100%);
      border: 1px solid rgba(220, 38, 38, 0.2);
      border-radius: 20px;
      padding: 24px;
    }
    .include-card.primary {
      background: linear-gradient(135deg, rgba(220, 38, 38, 0.08) 0%, rgba(220, 38, 38, 0.15) 100%);
      border-color: rgba(220, 38, 38, 0.3);
    }
    .include-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    .include-icon {
      background: rgba(220, 38, 38, 0.2);
      padding: 10px;
      border-radius: 10px;
      color: #dc2626;
    }
    .include-title {
      font-size: 17px;
      font-weight: 600;
      color: #0a0a0a;
    }
    .include-desc {
      font-size: 13px;
      color: #525252;
      line-height: 1.7;
    }
    .include-link {
      display: inline-block;
      margin-top: 12px;
      font-size: 13px;
      font-weight: 500;
      color: #dc2626;
    }

    /* CTA Section */
    .cta-section {
      background: rgba(220, 38, 38, 0.05);
      padding: 48px 40px;
      text-align: center;
    }
    .cta-title {
      font-size: 26px;
      font-weight: 700;
      color: #0a0a0a;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }
    .cta-desc {
      color: #525252;
      max-width: 480px;
      margin: 0 auto 24px;
    }
    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #dc2626;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 14px;
      text-decoration: none;
    }

    /* Footer */
    .footer {
      background: #0a0a0a;
      padding: 32px 40px;
      color: #a3a3a3;
      font-size: 13px;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-logo {
      font-weight: 700;
      color: #ffffff;
      font-size: 16px;
    }
    .footer-links {
      display: flex;
      gap: 24px;
    }
    .footer-link {
      color: #a3a3a3;
      text-decoration: none;
    }
    .footer-secondary {
      text-align: center;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #262626;
      color: #737373;
      font-size: 12px;
    }

    @media print {
      body { 
        -webkit-print-color-adjust: exact !important; 
        print-color-adjust: exact !important; 
      }
      .hero-image {
        background: #e5e5e5 !important;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div class="logo">Leadership By Design</div>
    <div class="header-nav">leadershipbydesign.lovable.app</div>
  </div>

  <!-- Hero Section -->
  <div class="hero">
    <div class="back-link">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      Based on your Team Diagnostic Results
    </div>
    
    <div class="hero-grid">
      <div>
        <div class="hero-badge">
          <div class="hero-icon-box">
            ${getWorkshopIcon()}
          </div>
          <div class="hero-duration">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Morning workshop
          </div>
        </div>
        <h1>${workshop.title}</h1>
        <p class="hero-description">${workshop.resultSummary}</p>
      </div>
      <div class="hero-image">
        Workshop Session Image
      </div>
    </div>
  </div>

  <!-- Scores Section -->
  <div class="scores-section">
    <div class="scores-header">Your Diagnostic Scores</div>
    <div class="scores-grid">
      <div class="score-item ${primaryRecommendation === 'clarity' ? 'primary' : ''}">
        <div class="score-label">Team Alignment</div>
        <div class="score-value">${scores.clarity}/25</div>
        <div class="score-bar"><div class="score-fill" style="width: ${(scores.clarity / 25) * 100}%"></div></div>
      </div>
      <div class="score-item ${primaryRecommendation === 'motivation' ? 'primary' : ''}">
        <div class="score-label">Team Energy</div>
        <div class="score-value">${scores.motivation}/25</div>
        <div class="score-bar"><div class="score-fill" style="width: ${(scores.motivation / 25) * 100}%"></div></div>
      </div>
      <div class="score-item ${primaryRecommendation === 'leadership' ? 'primary' : ''}">
        <div class="score-label">Team Ownership</div>
        <div class="score-value">${scores.leadership}/25</div>
        <div class="score-bar"><div class="score-fill" style="width: ${(scores.leadership / 25) * 100}%"></div></div>
      </div>
    </div>
  </div>

  <!-- Problem + Who Section -->
  <div class="problem-section">
    <div class="problem-grid">
      <div>
        <h2 class="section-title">The Problem This Solves</h2>
        <div class="section-text">
          <p>${problemText.p1}</p>
          <p>${problemText.p2}</p>
        </div>
      </div>
      <div>
        <h2 class="section-title">Who This Is For</h2>
        <div class="who-box">
          <div class="who-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <p class="section-text">${getWhoText()}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Outcomes Section -->
  <div class="outcomes-section">
    <div class="outcomes-header">
      <h2 class="section-title">What You'll Achieve</h2>
      <p>Walk away with clarity, frameworks, and agreements that transform how your team works together.</p>
    </div>
    <div class="outcomes-grid">
      ${outcomes.map(outcome => `
        <div class="outcome-card">
          <div class="outcome-header">
            <svg class="outcome-check" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <div>
              <div class="outcome-title">${outcome.title}</div>
              <div class="outcome-desc">${outcome.description}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- Process Section -->
  <div class="process-section">
    <div class="process-grid">
      <div>
        <h2 class="section-title">How It Works</h2>
        <div class="steps-list">
          ${steps.map(step => `
            <div class="step-item">
              <div class="step-number">${step.step}</div>
              <div class="step-content">
                <div class="step-title">${step.title}</div>
                <div class="step-desc">${step.description}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="includes-section">
        <h2 class="section-title">What's Included</h2>
        <div class="include-card primary">
          <div class="include-header">
            <div class="include-icon">
              ${getWorkshopIcon()}
            </div>
            <div class="include-title">SHIFT Methodology™</div>
          </div>
          <p class="include-desc">Our proprietary SHIFT Methodology™ is the foundation of every workshop. This proven framework creates lasting transformation by addressing root causes, not just symptoms. It's what makes our workshops deliver sustainable change, not temporary fixes.</p>
          <span class="include-link">Learn more about SHIFT →</span>
        </div>
        <div class="include-card">
          <div class="include-header">
            <div class="include-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div class="include-title">${getIncludeTitle()}</div>
          </div>
          <p class="include-desc">${getIncludeDesc()}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- CTA Section -->
  <div class="cta-section">
    <h2 class="cta-title">Ready to Transform Your Team?</h2>
    <p class="cta-desc">Book a call to discuss how the ${workshop.title} can help your team achieve breakthrough results.</p>
    <div class="cta-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
      Book a Consultation
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-content">
      <div class="footer-logo">Leadership By Design</div>
      <div class="footer-links">
        <span class="footer-link">kevin@kevinbritz.com</span>
        <span class="footer-link">© ${new Date().getFullYear()} All rights reserved</span>
      </div>
    </div>
    ${secondaryRecommendation ? `<div class="footer-secondary">Secondary recommendation: ${workshopDetails[secondaryRecommendation].title}</div>` : ''}
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    }
  </script>
</body>
</html>
    `;
    
    return html;
  };

  const handleDownload = (html: string) => {
    // Open in new window and trigger print (which allows Save as PDF)
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('workshop_downloads')
        .insert({
          email,
          name: name || null,
          workshop: primaryWorkshop.title,
          diagnostic_submission_id: submissionId
        });

      if (dbError) {
        console.error("Database error:", dbError);
      }

      // Send notification email
      const { error: emailError } = await supabase.functions.invoke('send-download-email', {
        body: {
          email,
          name,
          workshop: primaryWorkshop.title,
          scores: result.scores,
          primaryRecommendation: result.primaryRecommendation
        }
      });

      if (emailError) {
        console.error("Email error:", emailError);
      }

      // Generate and trigger download
      const html = generateWorkshopPDF();
      handleDownload(html);
      
      setIsComplete(true);
      toast.success("Your workshop overview is ready!");
      
      // Navigate to workshop page after a delay
      setTimeout(() => {
        setIsComplete(false);
        setEmail("");
        setName("");
        onOpenChange(false);
        navigate(workshopRoutes[result.primaryRecommendation]);
      }, 2000);

    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Download className="w-5 h-5 text-red-600" />
            Download Your Workshop Overview
          </DialogTitle>
          <DialogDescription className="text-sm">
            Get a personalized PDF overview of <span className="font-medium">{primaryWorkshop.title}</span> based on your diagnostic results.
          </DialogDescription>
        </DialogHeader>

        {isComplete ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">Your PDF is Ready!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Taking you to the full workshop page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="download-email">Email Address *</Label>
              <Input
                id="download-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="download-name">Name (optional)</Label>
              <Input
                id="download-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              We'll send you a copy of your results and occasionally share helpful resources. 
              You can unsubscribe at any time.
            </p>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Overview
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

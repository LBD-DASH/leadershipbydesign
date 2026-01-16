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
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${workshop.title} - Workshop Overview</title>
  <style>
    @page { margin: 0; size: A4; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #1a1a1a; 
      background: #ffffff;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 40px;
      border-bottom: 4px solid #dc2626;
    }
    .back-link {
      color: #64748b;
      font-size: 14px;
      margin-bottom: 24px;
      display: block;
    }
    .hero-content {
      display: flex;
      gap: 40px;
      align-items: flex-start;
    }
    .hero-text { flex: 1; }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .hero-badge .icon-box {
      background: rgba(220, 38, 38, 0.1);
      padding: 12px;
      border-radius: 12px;
    }
    .hero-badge .icon-box svg { width: 24px; height: 24px; color: #dc2626; }
    .hero-badge .duration {
      color: #64748b;
      font-size: 14px;
    }
    h1 {
      font-size: 36px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 16px;
      line-height: 1.2;
    }
    .hero-description {
      font-size: 18px;
      color: #64748b;
      line-height: 1.7;
      margin-bottom: 24px;
    }
    .hero-image {
      width: 300px;
      height: 200px;
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      text-align: center;
      padding: 20px;
    }
    
    /* Scores Section */
    .scores-section {
      background: #fff;
      padding: 30px 40px;
      border-bottom: 1px solid #e2e8f0;
    }
    .scores-header {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 16px;
    }
    .scores-grid {
      display: flex;
      gap: 20px;
    }
    .score-item {
      flex: 1;
      background: #f8fafc;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    .score-item.primary {
      background: rgba(220, 38, 38, 0.05);
      border-color: #dc2626;
    }
    .score-label {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 4px;
    }
    .score-item.primary .score-label { color: #dc2626; }
    .score-value {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
    }
    .score-item.primary .score-value { color: #dc2626; }
    .score-bar {
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      margin-top: 8px;
      overflow: hidden;
    }
    .score-fill {
      height: 100%;
      background: #64748b;
      border-radius: 3px;
    }
    .score-item.primary .score-fill { background: #dc2626; }
    
    /* Problem + Who Section */
    .problem-section {
      padding: 40px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
    .section-title {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 16px;
    }
    .section-text {
      color: #64748b;
      line-height: 1.7;
    }
    .section-text p { margin-bottom: 12px; }
    .who-box {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    .who-icon {
      background: rgba(220, 38, 38, 0.1);
      padding: 8px;
      border-radius: 8px;
      flex-shrink: 0;
    }
    
    /* Outcomes Section */
    .outcomes-section {
      background: #f8fafc;
      padding: 40px;
      page-break-before: always;
    }
    .outcomes-header {
      text-align: center;
      margin-bottom: 30px;
    }
    .outcomes-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .outcome-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
    }
    .outcome-card:hover { border-color: rgba(220, 38, 38, 0.3); }
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
      color: #1a1a1a;
      margin-bottom: 4px;
    }
    .outcome-desc {
      font-size: 14px;
      color: #64748b;
    }
    
    /* How It Works Section */
    .process-section {
      padding: 40px;
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 40px;
    }
    .steps-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
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
      font-size: 14px;
      font-weight: 700;
      color: #dc2626;
      flex-shrink: 0;
    }
    .step-content { padding-top: 8px; }
    .step-title {
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
    }
    .step-desc {
      font-size: 14px;
      color: #64748b;
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
      border-radius: 16px;
      padding: 20px;
    }
    .include-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    .include-icon {
      background: rgba(220, 38, 38, 0.2);
      padding: 8px;
      border-radius: 8px;
    }
    .include-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }
    .include-desc {
      font-size: 14px;
      color: #64748b;
      line-height: 1.6;
    }
    
    /* SHIFT Skills Section */
    .skills-section {
      background: linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(220, 38, 38, 0.1) 100%);
      border: 1px solid rgba(220, 38, 38, 0.2);
      border-radius: 16px;
      padding: 24px;
      margin: 40px;
    }
    .skills-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .skills-icon { color: #dc2626; }
    .skills-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }
    .skills-desc {
      color: #64748b;
      margin-bottom: 20px;
    }
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .skill-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
    }
    .skill-name {
      font-weight: 600;
      color: #dc2626;
      font-size: 14px;
      margin-bottom: 4px;
    }
    .skill-detail {
      font-size: 13px;
      color: #64748b;
    }
    
    /* CTA Section */
    .cta-section {
      background: rgba(220, 38, 38, 0.05);
      padding: 40px;
      text-align: center;
      border-top: 1px solid rgba(220, 38, 38, 0.2);
    }
    .cta-icon {
      width: 48px;
      height: 48px;
      background: #dc2626;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      color: white;
    }
    .cta-title {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 12px;
    }
    .cta-desc {
      color: #64748b;
      max-width: 500px;
      margin: 0 auto 20px;
    }
    .cta-contact {
      font-size: 16px;
      color: #dc2626;
      font-weight: 600;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      padding: 24px;
      border-top: 1px solid #e2e8f0;
      color: #64748b;
      font-size: 14px;
    }
    .footer-logo {
      font-weight: 700;
      color: #dc2626;
      font-size: 16px;
      margin-bottom: 8px;
    }
    
    @media print {
      body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .hero, .outcomes-section, .skills-section, .cta-section { -webkit-print-color-adjust: exact !important; }
    }
  </style>
</head>
<body>
  <!-- Hero Section -->
  <div class="hero">
    <div class="back-link">← Based on your Team Diagnostic Results</div>
    <div class="hero-content">
      <div class="hero-text">
        <div class="hero-badge">
          <div class="icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <span class="duration">Morning workshop • ${workshop.duration}</span>
        </div>
        <h1>${workshop.title}</h1>
        <p class="hero-description">${workshop.resultSummary}</p>
      </div>
      <div class="hero-image">
        Leadership By Design<br/>Workshop Overview
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
    <div>
      <h2 class="section-title">The Problem This Solves</h2>
      <div class="section-text">
        <p>${primaryRecommendation === 'clarity' 
          ? "Your team is busy. Everyone's working hard. But somehow, outcomes remain inconsistent. Different people have different ideas about what success looks like. Priorities shift frequently, and meetings create more questions than answers."
          : primaryRecommendation === 'motivation'
          ? "Your team knows what to do. They have the skills. But something's missing. Energy is low, enthusiasm has faded, and people are going through the motions rather than bringing their best."
          : "Your team has capable people. But decisions get stuck. Things fall through the cracks. People wait to be told what to do rather than taking initiative. Accountability feels like blame rather than ownership."
        }</p>
        <p>${primaryRecommendation === 'clarity'
          ? "This isn't a motivation problem. It's an alignment problem. And more effort won't fix it—only clarity will."
          : primaryRecommendation === 'motivation'
          ? "This isn't a skills problem. It's an engagement problem. And pushing harder won't fix it—only reconnecting to purpose will."
          : "This isn't a competence problem. It's an ownership problem. And more oversight won't fix it—only empowerment will."
        }</p>
      </div>
    </div>
    <div>
      <h2 class="section-title">Who This Is For</h2>
      <div class="who-box">
        <div class="who-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <p class="section-text">${primaryRecommendation === 'clarity'
          ? "Leadership teams and cross-functional groups where effort is high but alignment is low. Ideal for teams experiencing frequent priority shifts, conflicting direction from different leaders, or a sense of \"busy but not productive.\""
          : primaryRecommendation === 'motivation'
          ? "Teams where the work is understood but energy and commitment are lacking. Ideal for groups experiencing burnout, disengagement, or a disconnect between effort and meaning."
          : "Teams with capable individuals where accountability is inconsistent. Ideal for groups where decisions get escalated unnecessarily, ownership is unclear, or initiative is rare."
        }</p>
      </div>
    </div>
  </div>

  <!-- Outcomes Section -->
  <div class="outcomes-section">
    <div class="outcomes-header">
      <h2 class="section-title">What You'll Achieve</h2>
      <p class="section-text">Walk away with clarity, frameworks, and agreements that transform how your team works together.</p>
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

  <!-- How It Works + Includes -->
  <div class="process-section">
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
      <div class="include-card">
        <div class="include-header">
          <div class="include-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <div class="include-title">SHIFT Methodology™</div>
        </div>
        <p class="include-desc">Our proprietary SHIFT Methodology™ is the foundation of every workshop. This proven framework creates lasting transformation by addressing root causes, not just symptoms.</p>
      </div>
      <div class="include-card">
        <div class="include-header">
          <div class="include-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="include-title">Values Assessment</div>
        </div>
        <p class="include-desc">Every participant completes our proprietary Values Assessment before the workshop. This reveals individual and collective values, helping the team understand what drives decision-making.</p>
      </div>
    </div>
  </div>

  <!-- SHIFT Skills Section -->
  <div class="skills-section">
    <div class="skills-header">
      <svg class="skills-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
      <span class="skills-title">SHIFT™ Skills Developed</span>
    </div>
    <p class="skills-desc">Based on your results, your team would benefit from strengthening these core capabilities:</p>
    <div class="skills-grid">
      ${workshop.shiftSkills.map(skill => `
        <div class="skill-card">
          <div class="skill-name">${skill.skill}</div>
          <div class="skill-detail">${skill.detail}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- CTA Section -->
  <div class="cta-section">
    <div class="cta-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    </div>
    <h2 class="cta-title">Ready to Transform Your Team?</h2>
    <p class="cta-desc">Our experts can help you design a customized intervention based on your specific team dynamics and challenges.</p>
    <p class="cta-contact">Contact: kevin@kevinbritz.com</p>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-logo">Leadership By Design</div>
    <p>© ${new Date().getFullYear()} All rights reserved. This overview was generated based on your diagnostic results.</p>
    ${secondaryRecommendation ? `<p style="margin-top: 8px;">Secondary recommendation: ${workshopDetails[secondaryRecommendation].title}</p>` : ''}
  </div>

  <script>
    window.onload = function() {
      window.print();
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

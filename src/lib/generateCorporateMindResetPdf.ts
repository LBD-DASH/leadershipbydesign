import jsPDF from 'jspdf';

const NAVY: [number, number, number] = [10, 31, 68];
const NAVY_LIGHT: [number, number, number] = [15, 45, 94];
const GOLD: [number, number, number] = [201, 168, 76];
const CREAM: [number, number, number] = [250, 246, 239];
const WHITE: [number, number, number] = [255, 255, 255];
const TEXT_MUTED: [number, number, number] = [120, 125, 140];

const LINE_HEIGHT = 5.5;

export function generateCorporateMindResetPdf(): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  const W = 210;
  const H = 297;
  const margin = 20;
  const cw = W - margin * 2;
  let y = 0;

  // ─── Helpers ───
  const setFont = (style: 'normal' | 'bold' | 'italic' = 'normal', size = 10.5) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
  };

  const drawLine = (yPos: number, color: [number, number, number] = GOLD) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, W - margin, yPos);
  };

  const addPageFooter = () => {
    doc.setFillColor(...NAVY);
    doc.rect(0, H - 12, W, 12, 'F');
    setFont('normal', 7);
    doc.setTextColor(...GOLD);
    doc.text('Leadership by Design  |  hello@leadershipbydesign.co.za  |  www.leadershipbydesign.co.za', W / 2, H - 5, { align: 'center' });
  };

  const checkPage = (needed: number) => {
    if (y + needed > H - 20) {
      addPageFooter();
      doc.addPage();
      y = 20;
    }
  };

  // ═══════════════════════════════════════
  // PAGE 1 — COVER
  // ═══════════════════════════════════════
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, H, 'F');

  // Gold accent line at top
  doc.setFillColor(...GOLD);
  doc.rect(0, 0, W, 3, 'F');

  // Label
  y = 80;
  setFont('normal', 11);
  doc.setTextColor(...GOLD);
  doc.text('CORPORATE WELLNESS PROGRAMME', W / 2, y, { align: 'center' });

  // Title
  y += 20;
  setFont('bold', 36);
  doc.setTextColor(...CREAM);
  doc.text('The Corporate', W / 2, y, { align: 'center' });
  y += 16;
  doc.text('Mind Reset', W / 2, y, { align: 'center' });

  // Divider
  y += 12;
  doc.setFillColor(...GOLD);
  doc.rect(W / 2 - 25, y, 50, 0.8, 'F');

  // Subtitle
  y += 14;
  setFont('normal', 13);
  doc.setTextColor(...CREAM);
  doc.text('Reset the Mind. Reclaim Performance.', W / 2, y, { align: 'center' });

  y += 14;
  setFont('normal', 10);
  doc.setTextColor(200, 196, 189);
  doc.text('A 4 x 90-Minute Intentional Mindset Meditation Programme', W / 2, y, { align: 'center' });
  y += 6;
  doc.text('for High-Performing Corporate Teams', W / 2, y, { align: 'center' });

  // Bottom branding
  setFont('normal', 9);
  doc.setTextColor(...GOLD);
  doc.text('Leadership by Design', W / 2, H - 30, { align: 'center' });
  setFont('normal', 8);
  doc.setTextColor(160, 156, 149);
  doc.text('www.leadershipbydesign.co.za', W / 2, H - 23, { align: 'center' });

  addPageFooter();

  // ═══════════════════════════════════════
  // PAGE 2 — THE PROBLEM
  // ═══════════════════════════════════════
  doc.addPage();
  y = 25;

  setFont('bold', 18);
  doc.setTextColor(...NAVY);
  doc.text('The Challenge', margin, y);

  y += 4;
  drawLine(y);
  y += 12;

  setFont('normal', 11);
  doc.setTextColor(...NAVY);
  const challengeText = doc.splitTextToSize(
    'Your team is showing up -- but are they really present? The modern workplace demands peak mental performance. Most organisations are leaving it to chance.',
    cw
  );
  doc.text(challengeText, margin, y);
  y += challengeText.length * LINE_HEIGHT + 10;

  // Pain point cards
  const painPoints = [
    { title: 'Burnout', stat: '67% of employees report chronic stress directly affecting their output.' },
    { title: 'Distraction', stat: 'The average employee loses 2.1 hours per day to mental noise and reactive thinking.' },
    { title: 'Disengagement', stat: 'Disengaged teams cost businesses up to 34% of an employee\'s annual salary.' },
  ];

  painPoints.forEach((p) => {
    checkPage(30);
    // Card background
    doc.setFillColor(...CREAM);
    doc.roundedRect(margin, y, cw, 24, 3, 3, 'F');

    setFont('bold', 11);
    doc.setTextColor(...NAVY);
    doc.text(p.title, margin + 8, y + 9);

    setFont('normal', 9.5);
    doc.setTextColor(...TEXT_MUTED);
    const statLines = doc.splitTextToSize(p.stat, cw - 16);
    doc.text(statLines, margin + 8, y + 16);

    y += 30;
  });

  // Bold statement
  y += 5;
  checkPage(20);
  doc.setFillColor(...NAVY);
  doc.roundedRect(margin, y, cw, 18, 3, 3, 'F');
  setFont('italic', 10);
  doc.setTextColor(...GOLD);
  doc.text('"The modern workplace demands peak mental performance."', W / 2, y + 11, { align: 'center' });
  y += 28;

  addPageFooter();

  // ═══════════════════════════════════════
  // PAGE 3 — THE SOLUTION + SESSIONS
  // ═══════════════════════════════════════
  doc.addPage();
  y = 25;

  setFont('bold', 18);
  doc.setTextColor(...NAVY);
  doc.text('The Corporate Mind Reset', margin, y);
  y += 4;
  drawLine(y);
  y += 12;

  setFont('normal', 10.5);
  doc.setTextColor(60, 60, 70);
  const solutionText = doc.splitTextToSize(
    'This is not yoga. This is not relaxation. The Corporate Mind Reset is science-backed, intentional mindset training that rewires how your people think, respond, and perform under pressure. Delivered in 4 x 90-minute facilitated sessions, this programme creates measurable shifts in focus, resilience, and leadership presence.',
    cw
  );
  doc.text(solutionText, margin, y);
  y += solutionText.length * LINE_HEIGHT + 14;

  // Sessions
  setFont('bold', 14);
  doc.setTextColor(...NAVY);
  doc.text('Programme Structure: 4 x 90-Minute Sessions', margin, y);
  y += 10;

  const sessions = [
    { num: '01', title: 'Clearing the Noise', subtitle: 'Stress Reduction & Burnout Prevention', desc: 'Identify and release the mental patterns driving chronic stress. Walk away with tools to immediately reduce overwhelm.' },
    { num: '02', title: 'Sharpening the Edge', subtitle: 'High-Performance Focus & Mental Clarity', desc: 'Train the mind to move from reactive to intentional. Build the focus muscle your team needs to perform at the highest level.' },
    { num: '03', title: 'Bouncing Forward', subtitle: 'Emotional Resilience Under Pressure', desc: 'Develop the emotional agility to stay grounded, adaptive, and effective -- even when conditions are challenging.' },
    { num: '04', title: 'Leading From Within', subtitle: 'Intentional Leadership Mindset', desc: 'Anchor the entire programme with a deep dive into purposeful, conscious leadership. Leave with a personal mindset blueprint.' },
  ];

  sessions.forEach((s) => {
    checkPage(40);
    // Session card
    doc.setFillColor(...CREAM);
    doc.roundedRect(margin, y, cw, 34, 3, 3, 'F');

    // Number
    setFont('bold', 24);
    doc.setTextColor(...GOLD);
    doc.text(s.num, margin + 6, y + 14);

    // Title + subtitle
    setFont('bold', 11);
    doc.setTextColor(...NAVY);
    doc.text(s.title, margin + 24, y + 9);

    setFont('italic', 9);
    doc.setTextColor(...GOLD);
    doc.text(s.subtitle, margin + 24, y + 15);

    // Description
    setFont('normal', 9);
    doc.setTextColor(80, 80, 90);
    const descLines = doc.splitTextToSize(s.desc, cw - 32);
    doc.text(descLines, margin + 24, y + 22);

    y += 40;
  });

  addPageFooter();

  // ═══════════════════════════════════════
  // PAGE 4 — OUTCOMES + WHO IS THIS FOR
  // ═══════════════════════════════════════
  doc.addPage();
  y = 25;

  setFont('bold', 18);
  doc.setTextColor(...NAVY);
  doc.text('What Changes After The Programme', margin, y);
  y += 4;
  drawLine(y);
  y += 12;

  const outcomes = [
    'Measurable reduction in workplace stress',
    'Sharper focus and faster decision-making',
    'Greater emotional resilience',
    'Improved team cohesion and communication',
    'Reduced absenteeism and presenteeism',
    'A culture of psychological safety',
  ];

  outcomes.forEach((o, i) => {
    checkPage(12);
    const bgColor = i % 2 === 0 ? CREAM : WHITE;
    doc.setFillColor(...bgColor);
    doc.roundedRect(margin, y, cw, 10, 2, 2, 'F');

    // Gold bullet
    doc.setFillColor(...GOLD);
    doc.circle(margin + 6, y + 5, 1.5, 'F');

    setFont('normal', 10);
    doc.setTextColor(...NAVY);
    doc.text(o, margin + 12, y + 6.5);

    y += 13;
  });

  y += 10;
  checkPage(50);

  setFont('bold', 16);
  doc.setTextColor(...NAVY);
  doc.text('Designed For Leaders at Every Level', margin, y);
  y += 10;

  const audiences = [
    { title: 'HR Directors & L&D Managers', desc: 'Looking to invest in employee wellbeing with measurable ROI.' },
    { title: 'C-Suite Executives', desc: 'Seeking to build a high-performance culture from the top down.' },
    { title: 'Team Leaders & Middle Management', desc: 'Ready to lead with more presence, clarity, and impact.' },
  ];

  audiences.forEach((a) => {
    checkPage(22);
    doc.setFillColor(...NAVY);
    doc.roundedRect(margin, y, cw, 18, 3, 3, 'F');

    setFont('bold', 10);
    doc.setTextColor(...GOLD);
    doc.text(a.title, margin + 8, y + 8);

    setFont('normal', 9);
    doc.setTextColor(...CREAM);
    doc.text(a.desc, margin + 8, y + 14);

    y += 23;
  });

  addPageFooter();

  // ═══════════════════════════════════════
  // PAGE 5 — FACILITATOR + CTA
  // ═══════════════════════════════════════
  doc.addPage();
  y = 25;

  setFont('bold', 18);
  doc.setTextColor(...NAVY);
  doc.text('Meet Your Facilitator', margin, y);
  y += 4;
  drawLine(y);
  y += 14;

  setFont('bold', 16);
  doc.setTextColor(...NAVY);
  doc.text('Kevin Britz', margin, y);
  y += 7;

  setFont('italic', 10);
  doc.setTextColor(...GOLD);
  doc.text('Master Practitioner in Time Line Therapy & Hypnotherapy', margin, y);
  y += 5;
  doc.text('Founder, Leadership by Design', margin, y);
  y += 10;

  setFont('normal', 10.5);
  doc.setTextColor(60, 60, 70);
  const bioText = doc.splitTextToSize(
    'With over 11 years of experience and more than 3,000 coaching sessions delivered, Kevin brings a unique blend of executive coaching expertise and mindset methodology to The Corporate Mind Reset. His approach is practical, evidence-based, and designed specifically for the pressures of the modern corporate environment.',
    cw
  );
  doc.text(bioText, margin, y);
  y += bioText.length * LINE_HEIGHT + 10;

  // Stat badges
  const stats = ['11 Years Experience', '3,000+ Coaching Sessions', '10,000+ Leaders Impacted'];
  const badgeWidth = (cw - 10) / 3;
  stats.forEach((s, i) => {
    const bx = margin + i * (badgeWidth + 5);
    doc.setFillColor(...CREAM);
    doc.roundedRect(bx, y, badgeWidth, 12, 3, 3, 'F');
    setFont('bold', 8.5);
    doc.setTextColor(...GOLD);
    doc.text(s, bx + badgeWidth / 2, y + 7.5, { align: 'center' });
  });

  y += 30;

  // Final CTA block
  checkPage(60);
  doc.setFillColor(...NAVY);
  doc.roundedRect(margin, y, cw, 55, 4, 4, 'F');

  setFont('bold', 16);
  doc.setTextColor(...CREAM);
  doc.text("Your team's next level starts", W / 2, y + 15, { align: 'center' });
  doc.text('with a single reset.', W / 2, y + 23, { align: 'center' });

  setFont('normal', 10);
  doc.setTextColor(200, 196, 189);
  doc.text('Limited group bookings available. Reach out to secure your dates.', W / 2, y + 33, { align: 'center' });

  // Gold CTA button
  const btnW = 70;
  const btnH = 10;
  const btnX = W / 2 - btnW / 2;
  const btnY = y + 39;
  doc.setFillColor(...GOLD);
  doc.roundedRect(btnX, btnY, btnW, btnH, 3, 3, 'F');
  setFont('bold', 10);
  doc.setTextColor(...NAVY);
  doc.text('Book Your Programme', W / 2, btnY + 6.8, { align: 'center' });

  addPageFooter();

  // ─── Save ───
  doc.save('The-Corporate-Mind-Reset-Brochure.pdf');
}

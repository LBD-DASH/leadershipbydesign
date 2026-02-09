import jsPDF from 'jspdf';

interface PdfSummary {
  title: string;
  takeaways: string[];
  summary: string;
  action_steps: string[];
  product_cta: {
    product_name: string;
    product_description: string;
    product_price: string;
    product_url: string;
  };
  diagnostic_cta: {
    diagnostic_name: string;
    diagnostic_description: string;
    diagnostic_url: string;
  };
}

// Brand colors
const BRAND = {
  dark: [27, 42, 74] as [number, number, number],
  accent: [42, 123, 136] as [number, number, number],
  accentLight: [230, 244, 246] as [number, number, number],
  text: [40, 40, 50] as [number, number, number],
  textLight: [100, 100, 110] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  bgLight: [248, 249, 252] as [number, number, number],
  gold: [180, 155, 100] as [number, number, number],
  divider: [210, 218, 226] as [number, number, number],
};

export async function generateLeadMagnetPdf(
  pdfSummary: PdfSummary,
  videoTitle?: string | null
): Promise<void> {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 22;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const checkPage = (needed: number) => {
    if (y + needed > 272) {
      addPageFooter();
      doc.addPage();
      y = 25;
      addPageHeader();
    }
  };

  const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(text, maxWidth);
  };

  // Thin accent bar at very top of every page
  const addPageHeader = () => {
    doc.setFillColor(...BRAND.accent);
    doc.rect(0, 0, pageWidth, 2.5, 'F');
  };

  // Subtle footer on every page
  const addPageFooter = () => {
    doc.setFontSize(7);
    doc.setTextColor(...BRAND.textLight);
    doc.setFont('helvetica', 'normal');
    doc.text('leadershipbydesign.co', margin, 290);
    doc.text('© Leadership by Design', pageWidth - margin, 290, { align: 'right' });
  };

  // Rounded rect helper
  const roundedRect = (x: number, ry: number, w: number, h: number, r: number, fill: [number, number, number], stroke?: [number, number, number]) => {
    doc.setFillColor(...fill);
    if (stroke) {
      doc.setDrawColor(...stroke);
      doc.setLineWidth(0.4);
    }
    doc.roundedRect(x, ry, w, h, r, r, stroke ? 'FD' : 'F');
  };

  // Section title helper
  const sectionTitle = (title: string, iconChar: string) => {
    checkPage(18);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND.dark);
    doc.text(`${iconChar}  ${title}`, margin, y);
    y += 2;
    doc.setDrawColor(...BRAND.accent);
    doc.setLineWidth(1);
    doc.line(margin, y, margin + 45, y);
    // Thin extension line
    doc.setLineWidth(0.2);
    doc.setDrawColor(...BRAND.divider);
    doc.line(margin + 45, y, margin + contentWidth, y);
    y += 8;
  };

  // ═══════════════════════════════════════
  // PAGE 1 — COVER HEADER
  // ═══════════════════════════════════════
  addPageHeader();

  // Full-width header block with gradient effect
  doc.setFillColor(...BRAND.dark);
  doc.rect(0, 2.5, pageWidth, 58, 'F');

  // Decorative accent stripe
  doc.setFillColor(...BRAND.accent);
  doc.rect(0, 58, pageWidth, 3, 'F');

  // Brand name
  doc.setTextColor(...BRAND.gold);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('LEADERSHIP BY DESIGN', margin, 18);

  // Decorative dot separator
  doc.setFillColor(...BRAND.gold);
  doc.circle(margin + doc.getTextWidth('LEADERSHIP BY DESIGN') + 4, 16.5, 1, 'F');

  // Subtitle
  doc.setTextColor(180, 195, 220);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('INSIGHT BRIEF', margin + doc.getTextWidth('LEADERSHIP BY DESIGN') + 8, 18);

  // Title
  doc.setTextColor(...BRAND.white);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  const titleLines = wrapText(pdfSummary.title, contentWidth - 10, 22);
  let titleY = 32;
  for (const line of titleLines) {
    doc.text(line, margin, titleY);
    titleY += 9;
  }

  // Tagline
  doc.setTextColor(160, 180, 210);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Key Insights & Action Steps', margin, Math.min(titleY + 3, 55));

  y = 70;

  // ═══════════════════════════════════════
  // KEY TAKEAWAYS
  // ═══════════════════════════════════════
  sectionTitle('Key Takeaways', '◆');

  for (let i = 0; i < pdfSummary.takeaways.length; i++) {
    const takeaway = pdfSummary.takeaways[i];
    checkPage(14);
    const lines = wrapText(takeaway, contentWidth - 14, 10.5);
    const blockHeight = lines.length * 4.8 + 4;

    // Alternating subtle background
    if (i % 2 === 0) {
      roundedRect(margin, y - 3.5, contentWidth, blockHeight, 2, BRAND.bgLight);
    }

    // Teal bullet circle
    doc.setFillColor(...BRAND.accent);
    doc.circle(margin + 4, y, 1.8, 'F');
    doc.setTextColor(...BRAND.white);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('✓', margin + 2.8, y + 0.8);

    // Text
    doc.setTextColor(...BRAND.text);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'normal');
    doc.text(lines, margin + 12, y + 0.5);
    y += blockHeight;
  }

  y += 8;

  // ═══════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════
  sectionTitle('Summary', '■');

  const cleanSummary = pdfSummary.summary
    .replace(/###?\s*/g, '')
    .replace(/\*\*/g, '');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...BRAND.text);

  // Left accent bar for summary block
  const summaryStartY = y;
  const summaryParagraphs = cleanSummary.split('\n\n').filter(p => p.trim());

  for (const para of summaryParagraphs) {
    checkPage(12);
    const lines = wrapText(para.trim(), contentWidth - 8, 10.5);
    doc.text(lines, margin + 6, y);
    y += lines.length * 4.8 + 3;
  }

  // Draw the accent bar after we know the height
  if (y > summaryStartY + 5) {
    doc.setDrawColor(...BRAND.accent);
    doc.setLineWidth(1.5);
    doc.line(margin + 1, summaryStartY - 2, margin + 1, Math.min(y - 2, 270));
  }

  y += 8;

  // ═══════════════════════════════════════
  // ACTION STEPS
  // ═══════════════════════════════════════
  sectionTitle('Action Steps', '▶');

  for (let i = 0; i < pdfSummary.action_steps.length; i++) {
    const step = pdfSummary.action_steps[i];
    checkPage(18);

    const lines = wrapText(step, contentWidth - 20, 10.5);
    const blockH = lines.length * 4.8 + 8;

    // Card background
    roundedRect(margin, y - 4, contentWidth, blockH, 3, BRAND.bgLight, BRAND.divider);

    // Step number circle
    doc.setFillColor(...BRAND.accent);
    doc.circle(margin + 8, y + 1, 4, 'F');
    doc.setTextColor(...BRAND.white);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}`, margin + 8, y + 2, { align: 'center' });

    // Step text
    doc.setTextColor(...BRAND.text);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'normal');
    doc.text(lines, margin + 16, y + 1);

    y += blockH + 2;
  }

  y += 10;

  // ═══════════════════════════════════════
  // RECOMMENDED RESOURCE CTA
  // ═══════════════════════════════════════
  checkPage(38);

  // Dark card
  roundedRect(margin, y, contentWidth, 32, 4, BRAND.dark);

  // Gold accent line
  doc.setFillColor(...BRAND.gold);
  doc.rect(margin + 6, y + 6, 2, 20, 'F');

  doc.setTextColor(...BRAND.gold);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMMENDED RESOURCE', margin + 14, y + 10);

  doc.setTextColor(...BRAND.white);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(pdfSummary.product_cta.product_name, margin + 14, y + 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 195, 220);
  const descLines = wrapText(pdfSummary.product_cta.product_description, contentWidth - 24, 9);
  doc.text(descLines[0] || '', margin + 14, y + 25);

  // URL on right
  doc.setTextColor(...BRAND.accent);
  doc.setFontSize(8);
  doc.text('leadershipbydesign.co/products →', margin + contentWidth - 4, y + 28, { align: 'right' });

  y += 40;

  // ═══════════════════════════════════════
  // DIAGNOSTIC CTA
  // ═══════════════════════════════════════
  checkPage(32);

  roundedRect(margin, y, contentWidth, 28, 4, BRAND.accentLight, BRAND.accent);

  // Accent circle
  doc.setFillColor(...BRAND.accent);
  doc.circle(margin + 10, y + 14, 5, 'F');
  doc.setTextColor(...BRAND.white);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('?', margin + 10, y + 15.5, { align: 'center' });

  doc.setTextColor(...BRAND.accent);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('FREE ASSESSMENT', margin + 20, y + 9);

  doc.setTextColor(...BRAND.dark);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(pdfSummary.diagnostic_cta.diagnostic_name, margin + 20, y + 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BRAND.textLight);
  const diagLines = wrapText(pdfSummary.diagnostic_cta.diagnostic_description, contentWidth - 30, 9);
  doc.text(diagLines[0] || '', margin + 20, y + 23);

  y += 36;

  // ═══════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════
  checkPage(30);

  // Divider
  doc.setDrawColor(...BRAND.divider);
  doc.setLineWidth(0.3);
  doc.line(margin + 30, y, margin + contentWidth - 30, y);
  y += 10;

  doc.setTextColor(...BRAND.dark);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Leadership by Design', pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setTextColor(...BRAND.textLight);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Developing leaders who develop others', pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setTextColor(...BRAND.accent);
  doc.setFontSize(8);
  doc.text('leadershipbydesign.co  •  LinkedIn  •  hello@leadershipbydesign.co', pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setTextColor(180, 180, 180);
  doc.setFontSize(7);
  doc.text(`© ${new Date().getFullYear()} Leadership by Design. All rights reserved.`, pageWidth / 2, y, { align: 'center' });

  // Add footer to last page
  addPageFooter();

  // Save
  const slug = (pdfSummary.title || videoTitle || 'content')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);

  doc.save(`${slug}.pdf`);
}

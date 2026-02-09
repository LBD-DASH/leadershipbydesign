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

const LINE_HEIGHT = 5.5; // consistent line height for 10.5pt text

export async function generateLeadMagnetPdf(
  pdfSummary: PdfSummary,
  videoTitle?: string | null
): Promise<void> {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 22;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const checkPage = (needed: number) => {
    if (y + needed > 270) {
      addPageFooter();
      doc.addPage();
      y = 20;
      addPageHeader();
    }
  };

  const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(text, maxWidth);
  };

  const drawTextBlock = (lines: string[], x: number, startY: number, lh: number = LINE_HEIGHT): number => {
    let cy = startY;
    for (const line of lines) {
      doc.text(line, x, cy);
      cy += lh;
    }
    return cy;
  };

  const addPageHeader = () => {
    doc.setFillColor(...BRAND.accent);
    doc.rect(0, 0, pageWidth, 2.5, 'F');
  };

  const addPageFooter = () => {
    doc.setFontSize(7);
    doc.setTextColor(...BRAND.textLight);
    doc.setFont('helvetica', 'normal');
    doc.text('leadershipbydesign.co', margin, 290);
    doc.text('© Leadership by Design', pageWidth - margin, 290, { align: 'right' });
  };

  const roundedRect = (x: number, ry: number, w: number, h: number, r: number, fill: [number, number, number], stroke?: [number, number, number]) => {
    doc.setFillColor(...fill);
    if (stroke) {
      doc.setDrawColor(...stroke);
      doc.setLineWidth(0.4);
    }
    doc.roundedRect(x, ry, w, h, r, r, stroke ? 'FD' : 'F');
  };

  const sectionTitle = (title: string) => {
    checkPage(18);
    // Accent dot
    doc.setFillColor(...BRAND.accent);
    doc.circle(margin + 2, y - 1.5, 2, 'F');

    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND.dark);
    doc.text(title, margin + 8, y);
    y += 3;
    doc.setDrawColor(...BRAND.accent);
    doc.setLineWidth(0.8);
    doc.line(margin, y, margin + 45, y);
    doc.setLineWidth(0.15);
    doc.setDrawColor(...BRAND.divider);
    doc.line(margin + 45, y, margin + contentWidth, y);
    y += 9;
  };

  // ═══════════════════════════════════════
  // COVER HEADER
  // ═══════════════════════════════════════
  addPageHeader();

  doc.setFillColor(...BRAND.dark);
  doc.rect(0, 2.5, pageWidth, 58, 'F');

  doc.setFillColor(...BRAND.accent);
  doc.rect(0, 58, pageWidth, 3, 'F');

  // Brand
  doc.setTextColor(...BRAND.gold);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('LEADERSHIP BY DESIGN', margin, 18);

  // Label
  doc.setTextColor(180, 195, 220);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const brandWidth = doc.getTextWidth('LEADERSHIP BY DESIGN');
  doc.text('INSIGHT BRIEF', margin + brandWidth + 8, 18);

  // Title
  doc.setTextColor(...BRAND.white);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  const titleLines = wrapText(pdfSummary.title, contentWidth - 10, 20);
  let titleY = 32;
  for (const line of titleLines) {
    doc.text(line, margin, titleY);
    titleY += 8;
  }

  doc.setTextColor(160, 180, 210);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Key Insights & Action Steps', margin, Math.min(titleY + 4, 55));

  y = 72;

  // ═══════════════════════════════════════
  // KEY TAKEAWAYS
  // ═══════════════════════════════════════
  sectionTitle('Key Takeaways');

  for (let i = 0; i < pdfSummary.takeaways.length; i++) {
    const takeaway = pdfSummary.takeaways[i];
    const lines = wrapText(takeaway, contentWidth - 16, 10.5);
    const blockHeight = lines.length * LINE_HEIGHT + 6;
    checkPage(blockHeight);

    // Alternating row
    if (i % 2 === 0) {
      roundedRect(margin, y - 4, contentWidth, blockHeight, 2, BRAND.bgLight);
    }

    // Teal bullet
    doc.setFillColor(...BRAND.accent);
    doc.circle(margin + 4, y + 0.5, 2.2, 'F');
    // Dash inside circle (safe ASCII)
    doc.setTextColor(...BRAND.white);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('-', margin + 3.3, y + 1.5);

    // Text
    doc.setTextColor(...BRAND.text);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'normal');
    drawTextBlock(lines, margin + 12, y + 1);
    y += blockHeight;
  }

  y += 10;

  // ═══════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════
  sectionTitle('Summary');

  const cleanSummary = pdfSummary.summary
    .replace(/###?\s*/g, '')
    .replace(/\*\*/g, '');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...BRAND.text);

  const summaryStartY = y;
  const summaryParagraphs = cleanSummary.split('\n\n').filter(p => p.trim());

  for (const para of summaryParagraphs) {
    const lines = wrapText(para.trim(), contentWidth - 10, 10.5);
    const blockH = lines.length * LINE_HEIGHT + 4;
    checkPage(blockH);
    drawTextBlock(lines, margin + 8, y);
    y += blockH;
  }

  // Accent bar alongside summary
  if (y > summaryStartY + 5) {
    doc.setDrawColor(...BRAND.accent);
    doc.setLineWidth(1.5);
    doc.line(margin + 2, summaryStartY - 2, margin + 2, Math.min(y - 3, 268));
  }

  y += 10;

  // ═══════════════════════════════════════
  // ACTION STEPS
  // ═══════════════════════════════════════
  sectionTitle('Action Steps');

  for (let i = 0; i < pdfSummary.action_steps.length; i++) {
    const step = pdfSummary.action_steps[i];
    const lines = wrapText(step, contentWidth - 22, 10.5);
    const blockH = lines.length * LINE_HEIGHT + 10;
    checkPage(blockH);

    // Card bg
    roundedRect(margin, y - 4, contentWidth, blockH, 3, BRAND.bgLight, BRAND.divider);

    // Number circle
    doc.setFillColor(...BRAND.accent);
    doc.circle(margin + 8, y + 2, 4.5, 'F');
    doc.setTextColor(...BRAND.white);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}`, margin + 8, y + 3.2, { align: 'center' });

    // Step text
    doc.setTextColor(...BRAND.text);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'normal');
    drawTextBlock(lines, margin + 18, y + 2);

    y += blockH + 2;
  }

  y += 12;

  // ═══════════════════════════════════════
  // RECOMMENDED RESOURCE CTA
  // ═══════════════════════════════════════
  checkPage(40);

  roundedRect(margin, y, contentWidth, 34, 4, BRAND.dark);

  // Gold accent bar
  doc.setFillColor(...BRAND.gold);
  doc.rect(margin + 6, y + 7, 2, 20, 'F');

  doc.setTextColor(...BRAND.gold);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMMENDED RESOURCE', margin + 14, y + 11);

  doc.setTextColor(...BRAND.white);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(pdfSummary.product_cta.product_name, margin + 14, y + 19);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 195, 220);
  const descLines = wrapText(pdfSummary.product_cta.product_description, contentWidth - 24, 9);
  drawTextBlock(descLines.slice(0, 2), margin + 14, y + 26);

  y += 42;

  // ═══════════════════════════════════════
  // DIAGNOSTIC CTA
  // ═══════════════════════════════════════
  checkPage(34);

  roundedRect(margin, y, contentWidth, 30, 4, BRAND.accentLight, BRAND.accent);

  // Circle with "?"
  doc.setFillColor(...BRAND.accent);
  doc.circle(margin + 10, y + 15, 5.5, 'F');
  doc.setTextColor(...BRAND.white);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('?', margin + 10, y + 16.8, { align: 'center' });

  doc.setTextColor(...BRAND.accent);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('FREE ASSESSMENT', margin + 20, y + 10);

  doc.setTextColor(...BRAND.dark);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(pdfSummary.diagnostic_cta.diagnostic_name, margin + 20, y + 17);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BRAND.textLight);
  const diagLines = wrapText(pdfSummary.diagnostic_cta.diagnostic_description, contentWidth - 30, 9);
  doc.text(diagLines[0] || '', margin + 20, y + 24);

  y += 38;

  // ═══════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════
  checkPage(30);

  doc.setDrawColor(...BRAND.divider);
  doc.setLineWidth(0.3);
  doc.line(margin + 30, y, margin + contentWidth - 30, y);
  y += 10;

  doc.setTextColor(...BRAND.dark);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Leadership by Design', pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setTextColor(...BRAND.textLight);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Developing leaders who develop others', pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setTextColor(...BRAND.accent);
  doc.setFontSize(8);
  doc.text('leadershipbydesign.co  |  LinkedIn  |  hello@leadershipbydesign.co', pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setTextColor(180, 180, 180);
  doc.setFontSize(7);
  doc.text(`© ${new Date().getFullYear()} Leadership by Design. All rights reserved.`, pageWidth / 2, y, { align: 'center' });

  addPageFooter();

  // Save
  const slug = (pdfSummary.title || videoTitle || 'content')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);

  doc.save(`${slug}.pdf`);
}

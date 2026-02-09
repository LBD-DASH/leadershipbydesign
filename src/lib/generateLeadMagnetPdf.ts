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

export async function generateLeadMagnetPdf(
  pdfSummary: PdfSummary,
  videoTitle?: string | null
): Promise<void> {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const brandDark = '#1B2A4A';
  const accent = '#2A7B88';
  const textColor = '#1a1a2e';
  const lightGray = '#666666';

  // Helper: add new page if needed
  const checkPage = (needed: number) => {
    if (y + needed > 275) {
      doc.addPage();
      y = 20;
    }
  };

  // Helper: wrap text and return lines
  const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(text, maxWidth);
  };

  // ─── HEADER BAR ───
  doc.setFillColor(27, 42, 74); // brandDark
  doc.rect(0, 0, pageWidth, 45, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('LEADERSHIP BY DESIGN', margin, 15);

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const titleLines = wrapText(pdfSummary.title, contentWidth, 18);
  doc.text(titleLines, margin, 26);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Key Insights & Action Steps', margin, 26 + titleLines.length * 7 + 4);

  y = 55;

  // ─── KEY TAKEAWAYS ───
  doc.setTextColor(27, 42, 74);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Takeaways', margin, y);
  y += 2;

  // Accent underline
  doc.setDrawColor(42, 123, 136);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 50, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 51, 51);

  for (const takeaway of pdfSummary.takeaways) {
    checkPage(12);
    const lines = wrapText(takeaway, contentWidth - 8, 11);
    doc.setTextColor(42, 123, 136);
    doc.setFont('helvetica', 'bold');
    doc.text('✓', margin, y);
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'normal');
    doc.text(lines, margin + 8, y);
    y += lines.length * 5 + 4;
  }

  y += 6;

  // ─── SUMMARY ───
  checkPage(20);
  doc.setTextColor(27, 42, 74);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', margin, y);
  y += 2;
  doc.setDrawColor(42, 123, 136);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 35, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 51, 51);

  // Clean markdown from summary
  const cleanSummary = pdfSummary.summary
    .replace(/###?\s*/g, '')
    .replace(/\*\*/g, '');

  const summaryParagraphs = cleanSummary.split('\n\n').filter(p => p.trim());
  for (const para of summaryParagraphs) {
    checkPage(15);
    const lines = wrapText(para.trim(), contentWidth, 11);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 4;
  }

  y += 6;

  // ─── ACTION STEPS ───
  checkPage(20);
  doc.setTextColor(27, 42, 74);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Action Steps', margin, y);
  y += 2;
  doc.setDrawColor(42, 123, 136);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 42, y);
  y += 8;

  // Light background box
  const stepsStartY = y;
  doc.setFillColor(248, 249, 250);
  
  // Calculate total height for steps
  let tempY = 0;
  for (const step of pdfSummary.action_steps) {
    const lines = wrapText(step, contentWidth - 16, 11);
    tempY += lines.length * 5 + 6;
  }
  
  doc.rect(margin, y - 4, contentWidth, tempY + 8, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 51, 51);

  pdfSummary.action_steps.forEach((step, i) => {
    checkPage(15);
    // Left accent bar
    doc.setDrawColor(42, 123, 136);
    doc.setLineWidth(1);
    doc.line(margin + 4, y - 2, margin + 4, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.text(`Step ${i + 1}: `, margin + 8, y);
    const stepLabel = `Step ${i + 1}: `;
    const labelWidth = doc.getTextWidth(stepLabel);
    
    doc.setFont('helvetica', 'normal');
    const lines = wrapText(step, contentWidth - 16 - labelWidth, 11);
    doc.text(lines[0], margin + 8 + labelWidth, y);
    if (lines.length > 1) {
      for (let l = 1; l < lines.length; l++) {
        y += 5;
        doc.text(lines[l], margin + 8, y);
      }
    }
    y += 8;
  });

  y += 10;

  // ─── PRODUCT CTA ───
  checkPage(35);
  doc.setFillColor(27, 42, 74);
  doc.rect(margin, y, contentWidth, 30, 'F');
  
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.text('RECOMMENDED RESOURCE', margin + 8, y + 8);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(pdfSummary.product_cta.product_name, margin + 8, y + 16);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const descLines = wrapText(pdfSummary.product_cta.product_description, contentWidth - 16, 10);
  doc.text(descLines[0] || '', margin + 8, y + 23);

  y += 38;

  // ─── DIAGNOSTIC CTA ───
  checkPage(30);
  doc.setFillColor(240, 247, 248);
  doc.rect(margin, y, contentWidth, 25, 'F');
  doc.setDrawColor(42, 123, 136);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, contentWidth, 25, 'S');

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text('FREE ASSESSMENT', margin + 8, y + 8);

  doc.setTextColor(27, 42, 74);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(pdfSummary.diagnostic_cta.diagnostic_name, margin + 8, y + 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 51, 51);
  const diagLines = wrapText(pdfSummary.diagnostic_cta.diagnostic_description, contentWidth - 16, 10);
  doc.text(diagLines[0] || '', margin + 8, y + 21);

  y += 33;

  // ─── FOOTER ───
  checkPage(25);
  doc.setDrawColor(224, 224, 224);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 10;

  doc.setTextColor(27, 42, 74);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Leadership by Design', pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setTextColor(102, 102, 102);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Developing leaders who develop others', pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setTextColor(42, 123, 136);
  doc.setFontSize(9);
  doc.text('leadershipbydesign.co  |  LinkedIn  |  hello@leadershipbydesign.co', pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setTextColor(153, 153, 153);
  doc.setFontSize(8);
  doc.text(`© ${new Date().getFullYear()} Leadership by Design. All rights reserved.`, pageWidth / 2, y, { align: 'center' });

  // Save
  const slug = (pdfSummary.title || videoTitle || 'content')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);

  doc.save(`${slug}.pdf`);
}

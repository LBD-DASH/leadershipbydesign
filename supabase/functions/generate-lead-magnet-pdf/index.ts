import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

function generatePdfHtml(pdfSummary: PdfSummary, videoTitle: string, videoThumbnail: string, videoUrl: string): string {
  const takeawaysList = pdfSummary.takeaways
    .map(t => `<li>${escapeHtml(t)}</li>`)
    .join("");
  
  const actionStepsList = pdfSummary.action_steps
    .map((s, i) => `<li><strong>Step ${i + 1}:</strong> ${escapeHtml(s)}</li>`)
    .join("");

  // Convert markdown headings to HTML
  const formattedSummary = pdfSummary.summary
    .replace(/### (.*)/g, '<h3>$1</h3>')
    .replace(/## (.*)/g, '<h2>$1</h2>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pdfSummary.title)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
      background: #ffffff;
    }
    
    .page {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    
    /* Header */
    .header {
      background: linear-gradient(135deg, #1B2A4A 0%, #2A3F5F 100%);
      color: white;
      padding: 30px 40px;
      margin: -40px -40px 40px -40px;
    }
    
    .header-brand {
      font-size: 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.9;
      margin-bottom: 8px;
    }
    
    .header-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28px;
      font-weight: 700;
      line-height: 1.3;
    }
    
    .header-subtitle {
      font-size: 14px;
      opacity: 0.8;
      margin-top: 8px;
    }
    
    /* Video thumbnail */
    .video-section {
      margin-bottom: 30px;
      text-align: center;
    }
    
    .video-thumbnail {
      max-width: 100%;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    
    .video-link {
      display: inline-block;
      margin-top: 12px;
      color: #2A7B88;
      text-decoration: none;
      font-weight: 500;
    }
    
    /* Sections */
    .section {
      margin-bottom: 35px;
    }
    
    .section-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 22px;
      color: #1B2A4A;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #2A7B88;
    }
    
    /* Key Takeaways */
    .takeaways-list {
      list-style: none;
      padding: 0;
    }
    
    .takeaways-list li {
      position: relative;
      padding-left: 28px;
      margin-bottom: 12px;
      font-size: 15px;
    }
    
    .takeaways-list li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #2A7B88;
      font-weight: 700;
    }
    
    /* Summary */
    .summary-content {
      font-size: 15px;
      color: #333;
    }
    
    .summary-content p {
      margin-bottom: 16px;
    }
    
    .summary-content h2 {
      font-size: 18px;
      color: #1B2A4A;
      margin: 24px 0 12px 0;
    }
    
    .summary-content h3 {
      font-size: 16px;
      color: #2A7B88;
      margin: 20px 0 10px 0;
    }
    
    /* Action Steps */
    .action-steps-list {
      list-style: none;
      padding: 0;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 24px;
    }
    
    .action-steps-list li {
      margin-bottom: 16px;
      padding-left: 12px;
      border-left: 3px solid #2A7B88;
      font-size: 15px;
    }
    
    .action-steps-list li:last-child {
      margin-bottom: 0;
    }
    
    /* CTA Boxes */
    .cta-section {
      display: grid;
      gap: 20px;
      margin-top: 40px;
    }
    
    .cta-box {
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 24px;
      transition: all 0.3s ease;
    }
    
    .cta-box-product {
      background: linear-gradient(135deg, #1B2A4A 0%, #2A3F5F 100%);
      color: white;
      border: none;
    }
    
    .cta-box-diagnostic {
      background: #f0f7f8;
      border-color: #2A7B88;
    }
    
    .cta-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.8;
      margin-bottom: 8px;
    }
    
    .cta-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 20px;
      margin-bottom: 8px;
    }
    
    .cta-description {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 12px;
    }
    
    .cta-price {
      font-size: 24px;
      font-weight: 700;
      color: #2A7B88;
    }
    
    .cta-box-product .cta-price {
      color: #7dd3fc;
    }
    
    .cta-link {
      display: inline-block;
      margin-top: 12px;
      padding: 10px 24px;
      background: #2A7B88;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
    }
    
    .cta-box-product .cta-link {
      background: white;
      color: #1B2A4A;
    }
    
    /* Footer */
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
    }
    
    .footer-brand {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 20px;
      color: #1B2A4A;
      margin-bottom: 8px;
    }
    
    .footer-tagline {
      font-size: 14px;
      color: #666;
      margin-bottom: 16px;
    }
    
    .footer-links {
      font-size: 13px;
      color: #2A7B88;
    }
    
    .footer-links a {
      color: #2A7B88;
      text-decoration: none;
      margin: 0 12px;
    }
    
    .footer-copyright {
      font-size: 12px;
      color: #999;
      margin-top: 16px;
    }
    
    @media print {
      .page {
        padding: 20px;
      }
      
      .header {
        margin: -20px -20px 30px -20px;
        padding: 20px;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .cta-box-product {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="header">
      <div class="header-brand">Leadership by Design</div>
      <h1 class="header-title">${escapeHtml(pdfSummary.title)}</h1>
      <div class="header-subtitle">Key Insights & Action Steps</div>
    </header>
    
    ${videoThumbnail ? `
    <div class="video-section">
      <img src="${escapeHtml(videoThumbnail)}" alt="Video thumbnail" class="video-thumbnail">
      <br>
      <a href="${escapeHtml(videoUrl)}" class="video-link">▶ Watch the full video</a>
    </div>
    ` : ''}
    
    <section class="section">
      <h2 class="section-title">Key Takeaways</h2>
      <ul class="takeaways-list">
        ${takeawaysList}
      </ul>
    </section>
    
    <section class="section">
      <h2 class="section-title">Summary</h2>
      <div class="summary-content">
        <p>${formattedSummary}</p>
      </div>
    </section>
    
    <section class="section">
      <h2 class="section-title">Action Steps</h2>
      <ol class="action-steps-list">
        ${actionStepsList}
      </ol>
    </section>
    
    <div class="cta-section">
      <div class="cta-box cta-box-product">
        <div class="cta-label">Recommended Resource</div>
        <h3 class="cta-title">${escapeHtml(pdfSummary.product_cta.product_name)}</h3>
        <p class="cta-description">${escapeHtml(pdfSummary.product_cta.product_description)}</p>
        <div class="cta-price">${escapeHtml(pdfSummary.product_cta.product_price)}</div>
        <a href="${escapeHtml(pdfSummary.product_cta.product_url)}" class="cta-link">Get It Now →</a>
      </div>
      
      <div class="cta-box cta-box-diagnostic">
        <div class="cta-label">Free Assessment</div>
        <h3 class="cta-title">${escapeHtml(pdfSummary.diagnostic_cta.diagnostic_name)}</h3>
        <p class="cta-description">${escapeHtml(pdfSummary.diagnostic_cta.diagnostic_description)}</p>
        <a href="${escapeHtml(pdfSummary.diagnostic_cta.diagnostic_url)}" class="cta-link">Take the Free Diagnostic →</a>
      </div>
    </div>
    
    <footer class="footer">
      <div class="footer-brand">Leadership by Design</div>
      <div class="footer-tagline">Developing leaders who develop others</div>
      <div class="footer-links">
        <a href="https://leadershipbydesign.co">Website</a>
        <a href="https://linkedin.com/company/leadership-by-design-sa">LinkedIn</a>
        <a href="mailto:hello@leadershipbydesign.co">Contact</a>
      </div>
      <div class="footer-copyright">© ${new Date().getFullYear()} Leadership by Design. All rights reserved.</div>
    </footer>
    
    <div class="no-print" style="position:fixed;top:20px;right:20px;z-index:1000;">
      <button onclick="window.print()" style="padding:12px 24px;background:#2A7B88;color:white;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
        📄 Save as PDF
      </button>
    </div>
  </div>
  <script>
    if (window.location.search.includes('print=1')) {
      window.addEventListener('load', function() {
        setTimeout(function() { window.print(); }, 800);
      });
    }
  </script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration is missing");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { pdfSummary, videoTitle, videoThumbnail, videoUrl, contentAssetId } = await req.json();

    if (!pdfSummary) {
      throw new Error("PDF summary content is required");
    }

    console.log(`Generating PDF for: ${videoTitle}`);

    // Generate HTML content
    const htmlContent = generatePdfHtml(pdfSummary, videoTitle, videoThumbnail, videoUrl);

    // Generate a slug from the title
    const slug = (pdfSummary.title || videoTitle || "content")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);

    const filename = `${slug}-${Date.now()}.html`;

    // Upload HTML to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("lead-magnets")
      .upload(filename, htmlContent, {
        contentType: "text/html",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("lead-magnets")
      .getPublicUrl(filename);

    console.log(`PDF uploaded: ${publicUrl}`);

    // Update content_assets record if ID provided
    if (contentAssetId) {
      const { error: updateError } = await supabase
        .from("content_assets")
        .update({ 
          pdf_url: publicUrl,
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", contentAssetId);

      if (updateError) {
        console.error("Failed to update content_assets:", updateError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        pdfUrl: publicUrl,
        filename,
        slug,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-lead-magnet-pdf:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

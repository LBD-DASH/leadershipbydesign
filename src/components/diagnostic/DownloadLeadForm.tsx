import { useState } from "react";
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

export default function DownloadLeadForm({ 
  open, 
  onOpenChange, 
  submissionId,
  result
}: DownloadLeadFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const primaryWorkshop = workshopDetails[result.primaryRecommendation];

  const generateWorkshopOverview = () => {
    const { scores, primaryRecommendation, secondaryRecommendation } = result;
    const workshop = workshopDetails[primaryRecommendation];
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${workshop.title} - Workshop Overview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2563eb; padding-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
    h1 { font-size: 28px; color: #1a1a1a; margin-bottom: 10px; }
    .subtitle { color: #666; font-size: 16px; }
    .scores { background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 30px; }
    .scores h2 { font-size: 18px; margin-bottom: 15px; color: #1a1a1a; }
    .score-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
    .score-item:last-child { border-bottom: none; }
    .score-label { font-weight: 500; }
    .score-value { color: #2563eb; font-weight: bold; }
    .primary { color: #2563eb; }
    .section { margin-bottom: 30px; }
    .section h2 { font-size: 20px; color: #1a1a1a; margin-bottom: 15px; border-left: 4px solid #2563eb; padding-left: 15px; }
    .section p { color: #444; margin-bottom: 10px; }
    ul { padding-left: 25px; color: #444; }
    li { margin-bottom: 8px; }
    .skills { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px; }
    .skill { background: #eff6ff; padding: 15px; border-radius: 8px; }
    .skill-name { font-weight: 600; color: #2563eb; margin-bottom: 5px; }
    .skill-detail { font-size: 14px; color: #666; }
    .cta { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-top: 40px; }
    .cta h2 { color: white; margin-bottom: 10px; }
    .cta p { color: rgba(255,255,255,0.9); margin-bottom: 15px; }
    .cta a { color: white; font-weight: bold; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #666; font-size: 14px; }
    @media print { body { padding: 20px; } .cta { background: #2563eb; -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Leadership By Design</div>
    <h1>${workshop.title}</h1>
    <p class="subtitle">Personalized Workshop Overview Based on Your Diagnostic Results</p>
  </div>

  <div class="scores">
    <h2>Your Diagnostic Scores</h2>
    <div class="score-item">
      <span class="score-label ${primaryRecommendation === 'clarity' ? 'primary' : ''}">Team Alignment</span>
      <span class="score-value">${scores.clarity}/25</span>
    </div>
    <div class="score-item">
      <span class="score-label ${primaryRecommendation === 'motivation' ? 'primary' : ''}">Team Energy</span>
      <span class="score-value">${scores.motivation}/25</span>
    </div>
    <div class="score-item">
      <span class="score-label ${primaryRecommendation === 'leadership' ? 'primary' : ''}">Team Ownership</span>
      <span class="score-value">${scores.leadership}/25</span>
    </div>
    <p style="margin-top: 15px; font-size: 13px; color: #666;">
      Higher scores indicate greater need for intervention in that area.
      ${secondaryRecommendation ? `Secondary recommendation: ${workshopDetails[secondaryRecommendation].title}` : ''}
    </p>
  </div>

  <div class="section">
    <h2>Workshop Overview</h2>
    <p>${workshop.resultSummary}</p>
    <p><strong>Duration:</strong> ${workshop.duration}</p>
  </div>

  <div class="section">
    <h2>What This Workshop Delivers</h2>
    <ul>
      ${workshop.delivers.map(item => `<li>${item}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <h2>What's Included</h2>
    <ul>
      ${workshop.includes.map(item => `<li>${item}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <h2>SHIFT™ Skills Developed</h2>
    <div class="skills">
      ${workshop.shiftSkills.map(skill => `
        <div class="skill">
          <div class="skill-name">${skill.skill}</div>
          <div class="skill-detail">${skill.detail}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="cta">
    <h2>Ready to Transform Your Team?</h2>
    <p>Our experts can help you design a customized intervention based on your specific team dynamics.</p>
    <p><a href="https://leadershipbydesign.lovable.app/contact">Contact Us</a> | <a href="mailto:kevin@kevinbritz.com">kevin@kevinbritz.com</a></p>
  </div>

  <div class="footer">
    <p>© ${new Date().getFullYear()} Leadership By Design. All rights reserved.</p>
    <p>This overview was generated based on your diagnostic results.</p>
  </div>
</body>
</html>
    `;
    
    return html;
  };

  const handleDownload = (html: string) => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${primaryWorkshop.title.replace(/\s+/g, '-')}-Overview.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        // Continue anyway - don't block download for DB errors
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
        // Continue anyway - don't block download for email errors
      }

      // Generate and trigger download
      const html = generateWorkshopOverview();
      handleDownload(html);
      
      setIsComplete(true);
      toast.success("Your workshop overview is downloading!");
      
      // Reset and close after delay
      setTimeout(() => {
        setIsComplete(false);
        setEmail("");
        setName("");
        onOpenChange(false);
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
            <Download className="w-5 h-5 text-primary" />
            Download Your Workshop Overview
          </DialogTitle>
          <DialogDescription className="text-sm">
            Get a personalized overview of <span className="font-medium">{primaryWorkshop.title}</span> based on your diagnostic results.
          </DialogDescription>
        </DialogHeader>

        {isComplete ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">Download Started!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Check your downloads folder for your workshop overview.
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
              className="w-full"
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
                  Download Overview
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

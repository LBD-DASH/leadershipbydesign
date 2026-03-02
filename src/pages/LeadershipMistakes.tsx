import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, CheckCircle, Shield, Zap, Users, AlertTriangle } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useUtmParams } from "@/hooks/useUtmParams";
import { calculateLeadScore } from "@/utils/leadScoring";
import { processLead } from "@/utils/notifications";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import heroImage from "@/assets/leadership-mistakes-hero.jpg";
const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
});

const teaserBullets = [
  "The weekly habit that makes employees feel invisible",
  "Why your 'open door policy' might be backfiring",
  "The conversation you're avoiding that's costing you trust",
  "The development approach that's actually holding them back",
  "The feedback pattern that drives top performers away",
];

export default function LeadershipMistakes() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const utmParams = useUtmParams();

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = formSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare lead data for scoring
      const leadData = {
        name: result.data.name,
        email: result.data.email,
        source: 'lead-magnet' as const
      };

      // Calculate lead score
      const leadScore = calculateLeadScore(leadData);
      console.log(`📊 Lead scored: ${leadScore.score}/100 (${leadScore.temperature})`);

      // Save to database with lead scoring
      const { data: insertedData, error: dbError } = await supabase
        .from("lead_magnet_downloads")
        .insert({
          name: result.data.name,
          email: result.data.email,
          lead_magnet: "leadership-mistakes-checklist",
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
          utm_content: utmParams.utm_content,
          utm_term: utmParams.utm_term,
          // Lead scoring data
          lead_score: leadScore.score,
          lead_temperature: leadScore.temperature,
          buyer_persona: leadScore.buyerPersona
        })
        .select('id')
        .single();

      if (dbError) throw dbError;

      // Fire GA4 conversion event
      const { trackLeadMagnetDownload } = await import('@/utils/gtmEvents');
      trackLeadMagnetDownload({ lead_magnet: 'leadership-mistakes-checklist' });

      // Send email with PDF link
      const { error: emailError } = await supabase.functions.invoke("send-lead-magnet-email", {
        body: {
          name: result.data.name,
          email: result.data.email,
          leadMagnet: "leadership-mistakes-checklist",
        },
      });

      if (emailError) {
        console.error("Email error:", emailError);
        // Don't block success if email fails - they can still download
      }

      // Process lead for AI analysis and notification (non-blocking)
      processLead(leadData).then(({ aiAnalysis }) => {
        // Update the submission with AI analysis
        if (insertedData?.id && aiAnalysis) {
          supabase
            .from('lead_magnet_downloads')
            .update({ ai_analysis: aiAnalysis })
            .eq('id', insertedData.id)
            .then(() => console.log('💾 AI analysis saved'));
        }
      }).catch(err => console.error('Lead processing error:', err));

      setIsSuccess(true);
      toast.success("Your checklist is downloading!");

      // Open checklist in new tab for instant download
      window.open("/leadership-mistakes-checklist", "_blank");
      
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="5 Leadership Mistakes Costing You Your Best Employees | Free Checklist"
        description="Download the free checklist that reveals why your top performers are quietly looking elsewhere. Fix these 5 common leadership mistakes today."
        keywords="leadership mistakes, employee retention, leadership checklist, free leadership guide, retain top performers"
        canonicalUrl="/leadership-mistakes"
      />
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
        {/* Hero Image Section - Responsive */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] md:aspect-[3/1] lg:aspect-[4/1] overflow-hidden">
          <img 
            src={heroImage} 
            alt="Leadership team having a productive conversation" 
            className="w-full h-full object-cover object-center"
            loading="eager"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>
        
        <div className="container mx-auto px-4 py-12 md:py-16 -mt-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  Free Leadership Checklist
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  The 5 Leadership Mistakes{" "}
                  <span className="text-primary">Costing You Your Best Employees</span>
                </h1>
                
                <p className="text-lg text-muted-foreground">
                  A 2-minute checklist that reveals why your top performers are quietly looking elsewhere — and how to fix it.
                </p>

                <div className="space-y-3 pt-2">
                  <p className="text-sm font-semibold text-foreground">Inside you'll discover:</p>
                  <ul className="space-y-2">
                    {teaserBullets.map((bullet, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>500+ leaders</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>2-min read</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {isSuccess ? (
                  <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Check Your Email!</h2>
                    <p className="text-muted-foreground">
                      We've sent the checklist to your inbox. If you don't see it, check your spam folder.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => window.location.href = "/leader-assessment"}
                    >
                      Take the Leadership Diagnostic →
                    </Button>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                        <Download className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="text-xl font-bold text-foreground">
                        Get Your Free Checklist
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Instant download • No spam
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          First Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your first name"
                          value={formData.name}
                          onChange={handleChange("name")}
                          className={errors.name ? "border-destructive" : ""}
                          disabled={isSubmitting}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive">{errors.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@company.com"
                          value={formData.email}
                          onChange={handleChange("email")}
                          className={errors.email ? "border-destructive" : ""}
                          disabled={isSubmitting}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive">{errors.email}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download Free Checklist
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                      <Shield className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <p>
                        We respect your privacy. Unsubscribe anytime.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

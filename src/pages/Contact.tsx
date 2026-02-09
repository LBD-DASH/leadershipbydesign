import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Mail, Phone, MapPin, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { calculateLeadScore } from "@/utils/leadScoring";
import { processLead } from "@/utils/notifications";
import { useUtmParams } from "@/hooks/useUtmParams";

export default function Contact() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    company: "",
    role: "",
    service_interest: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const utmParams = useUtmParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare lead data for scoring
      const leadData = {
        name: formData.full_name,
        email: formData.email,
        role: formData.role,
        company: formData.company,
        message: formData.message,
        source: 'contact-form' as const
      };

      // Calculate lead score
      const leadScore = calculateLeadScore(leadData);
      console.log(`📊 Lead scored: ${leadScore.score}/100 (${leadScore.temperature})`);

      // Save to database with lead scoring data
      const { error: dbError } = await supabase
        .from('contact_form_submissions')
        .insert({
          name: formData.full_name,
          email: formData.email,
          company: formData.company || null,
          role: formData.role || null,
          service_interest: formData.service_interest || null,
          message: formData.message || null,
          utm_source: utmParams.utm_source || null,
          utm_medium: utmParams.utm_medium || null,
          utm_campaign: utmParams.utm_campaign || null,
          utm_content: utmParams.utm_content || null,
          utm_term: utmParams.utm_term || null,
          lead_score: leadScore.score,
          lead_temperature: leadScore.temperature,
          buyer_persona: leadScore.buyerPersona,
          company_size: leadScore.companySize,
          urgency: leadScore.urgency,
          next_action: leadScore.nextAction,
          scoring_breakdown: leadScore.breakdown
        });

      if (dbError) {
        console.error('Database save error:', dbError);
        // Continue with email even if database save fails
      }

      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.full_name,
          email: formData.email,
          company: formData.company,
          phone: formData.role,
          serviceInterest: formData.service_interest,
          message: formData.message,
          // Include lead scoring data in email
          leadScore: leadScore.score,
          leadTemperature: leadScore.temperature,
          buyerPersona: leadScore.buyerPersona,
        }
      });

      if (error) throw error;

      // Process lead for AI analysis and notification (non-blocking)
      processLead(leadData).catch(err => console.error('Lead processing error:', err));

      setSubmitted(true);
      setFormData({
        full_name: "",
        email: "",
        company: "",
        role: "",
        service_interest: "",
        message: "",
      });
      toast({
        title: "Request Sent",
        description: "We'll be in touch within 24 hours.",
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <>
        <SEO
          title="Book a Consultation | Leadership by Design"
          description="Book a free discovery session with Leadership by Design. Executive coaching, team workshops, and leadership development for South African organizations."
          canonicalUrl="/contact"
          ogImage="https://leadershipbydesign.co/og-contact.jpg"
          keywords="contact leadership by design, book consultation, executive coaching inquiry, leadership consultation"
        />
        <div className="min-h-screen">
          <Header />
        <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#212529] mb-3 sm:mb-4 px-4">
            Thank You!
          </h2>
          <p className="text-lg sm:text-xl text-[#495057] mb-6 sm:mb-8 px-4">
            We've received your consultation request. Kevin will be in touch within 24 hours.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            className="bg-[#3A7CA5] hover:bg-[#2d6384] text-white px-6 sm:px-8 py-5 sm:py-6 rounded-full"
          >
            Submit Another Request
          </Button>
        </motion.div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Book a Consultation | Leadership by Design"
        description="Book a free discovery session with Leadership by Design. Executive coaching, team workshops, and leadership development for South African organizations."
        canonicalUrl="/contact"
        ogImage="https://leadershipbydesign.co/og-contact.jpg"
        keywords="contact leadership by design, book consultation, executive coaching inquiry, leadership consultation"
      />
      <div className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="pt-24 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#3A7CA5] to-[#2d6384]">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6"
          >
            Let's Connect
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light px-4"
          >
            Ready to transform your leadership? Schedule a consultation with Kevin and let's design your success together.
          </motion.p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#212529] mb-6 sm:mb-8">
              Schedule a Consultation
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="full_name" className="text-[#495057] font-medium mb-2 block">
                  Full Name *
                </Label>
                <Input
                  id="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  className="h-11 sm:h-12 rounded-xl border-gray-200 focus:border-[#3A7CA5] focus:ring-[#3A7CA5]"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-[#495057] font-medium mb-2 block">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="h-11 sm:h-12 rounded-xl border-gray-200 focus:border-[#3A7CA5] focus:ring-[#3A7CA5]"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <Label htmlFor="company" className="text-[#495057] font-medium mb-2 block">
                  Company
                </Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="h-11 sm:h-12 rounded-xl border-gray-200 focus:border-[#3A7CA5] focus:ring-[#3A7CA5]"
                  placeholder="Your Company"
                />
              </div>

              <div>
                <Label htmlFor="role" className="text-[#495057] font-medium mb-2 block">
                  Your Role
                </Label>
                <Input
                  id="role"
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className="h-11 sm:h-12 rounded-xl border-gray-200 focus:border-[#3A7CA5] focus:ring-[#3A7CA5]"
                  placeholder="CEO, Manager, etc."
                />
              </div>

              <div>
                <Label htmlFor="service_interest" className="text-[#495057] font-medium mb-2 block">
                  Service Interest *
                </Label>
                <Select
                  value={formData.service_interest}
                  onValueChange={(value) => handleChange("service_interest", value)}
                >
                  <SelectTrigger className="h-11 sm:h-12 rounded-xl border-gray-200">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contagious Identity Coaching">Contagious Identity Coaching</SelectItem>
                    <SelectItem value="Team Workshops">Team Workshops</SelectItem>
                    <SelectItem value="SHIFT Leadership Development">SHIFT Leadership Development</SelectItem>
                    <SelectItem value="Leadership Essentials">Leadership Essentials</SelectItem>
                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message" className="text-[#495057] font-medium mb-2 block">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="min-h-28 sm:min-h-32 rounded-xl border-gray-200 focus:border-[#3A7CA5] focus:ring-[#3A7CA5]"
                  placeholder="Tell us about your leadership goals..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 sm:h-14 bg-[#3A7CA5] hover:bg-[#2d6384] text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 sm:space-y-12"
          >
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#212529] mb-6 sm:mb-8">
                Get in Touch
              </h2>
              <p className="text-base sm:text-lg text-[#495057] leading-relaxed mb-6 sm:mb-8">
                I'm here to help you transform your leadership approach. Reach out through the form 
                or contact me directly using the information below.
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#3A7CA5]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#3A7CA5]" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#212529] mb-1">Contact Person</h3>
                  <p className="text-sm sm:text-base text-[#495057] font-medium">Kevin Britz</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#3A7CA5]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#3A7CA5]" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#212529] mb-1">Email</h3>
                  <a href="mailto:kevin@kevinbritz.com" className="text-sm sm:text-base text-[#495057] hover:text-[#3A7CA5] transition-colors break-all">
                    kevin@kevinbritz.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#3A7CA5]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#3A7CA5]" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#212529] mb-1">Phone</h3>
                  <a href="tel:+27844141852" className="text-sm sm:text-base text-[#495057] hover:text-[#3A7CA5] transition-colors">
                    +27 84 414 1852
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#3A7CA5]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#3A7CA5]" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#212529] mb-1">Location</h3>
                  <p className="text-sm sm:text-base text-[#495057]">South Africa</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#3A7CA5] to-[#2d6384] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white mb-8">
              <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Why Work With Me?
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-white/90">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                  <span>40% average productivity gains in 90 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                  <span>50% reduction in team conflict</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                  <span>200+ companies transformed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                  <span>35% faster decision-making</span>
                </li>
              </ul>
            </div>

            {/* Risk Reversal */}
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">
                90-Day Results Guarantee
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                If you don't see measurable results in 90 days, we work for free until you do.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}
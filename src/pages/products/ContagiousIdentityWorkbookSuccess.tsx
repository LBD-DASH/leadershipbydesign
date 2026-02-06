import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Download, ArrowRight, Gift, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const colors = {
  navy: "#1B2A4A",
  gold: "#C8A864",
};

export default function ContagiousIdentityWorkbookSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  useEffect(() => {
    // Trigger automatic download
    const timer = setTimeout(() => {
      window.open("/contagious-identity-workbook.pdf", "_blank");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SEO
        title="Download Your Contagious Identity Workbook | Leadership by Design"
        description="Your Contagious Identity Workbook is ready for download."
      />
      <Header />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: `${colors.gold}20` }}
            >
              <CheckCircle className="w-10 h-10" style={{ color: colors.gold }} />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Workbook is Ready!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your purchase. Your Contagious Identity Workbook should download automatically.
            </p>

            {/* Download Button */}
            <div className="mb-12">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-6"
                style={{ backgroundColor: colors.gold, color: colors.navy }}
              >
                <a href="/contagious-identity-workbook.pdf" download>
                  <Download className="w-5 h-5 mr-2" />
                  Download Workbook
                </a>
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                If the download didn't start automatically, click the button above.
              </p>
            </div>

            {/* What's Inside Reminder */}
            <div className="bg-card rounded-2xl p-8 border border-border text-left mb-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Inside Your Workbook</h2>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Complete Identity Discovery Process with self-coaching prompts</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Leadership Presence Framework and Culture Influence Tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>50% discount codes</strong> for Values Blueprint, Purpose Blueprint, and 6 Human Needs</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>"Ask Your Coach" prompts throughout for deeper reflection</span>
                </li>
              </ul>
            </div>

            {/* Upgrade Path */}
            <div 
              className="rounded-2xl p-8 text-left border-2"
              style={{ borderColor: colors.gold, backgroundColor: `${colors.gold}08` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-6 h-6" style={{ color: colors.gold }} />
                <h2 className="text-xl font-semibold">Ready for Guided Coaching?</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Your R697 workbook purchase is fully credited if you upgrade to our 
                Executive Coaching programme within 90 days. Walk through the workbook 
                with an experienced coach and accelerate your identity transformation.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/contagious-identity">
                  Explore Coaching Options
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Reference */}
            {reference && (
              <p className="text-xs text-muted-foreground mt-8">
                Reference: {reference}
              </p>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}

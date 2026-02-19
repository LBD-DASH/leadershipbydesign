import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Headphones, ArrowRight, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const BespokeMeditationsSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const isFreeDiscount = reference?.startsWith("FREE");

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Order Confirmed | Bespoke Meditations" description="Your meditation order has been confirmed." />
      <Header />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {isFreeDiscount ? "Access Granted!" : "Order Confirmed!"}
            </h1>

            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Thank you for your purchase. Here's what happens next:
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-card rounded-xl border border-border p-8 mb-8 text-left space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Check Your Email</h3>
                <p className="text-muted-foreground text-sm">
                  A confirmation email with your receipt and next steps has been sent.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Headphones className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Your Meditation</h3>
                <p className="text-muted-foreground text-sm">
                  For bespoke orders, we'll be in touch within 48 hours to gather your preferences and begin crafting your personalised meditation. For ready-to-buy meditations, your download link is in your email.
                </p>
              </div>
            </div>
          </motion.div>

          {reference && (
            <p className="text-xs text-muted-foreground mb-6">Reference: {reference}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link to="/products">
                Browse More Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild>
              <Link to="/bespoke-meditations">
                Back to Meditations
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BespokeMeditationsSuccess;

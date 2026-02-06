import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle, 
  Download, 
  Lock, 
  Sparkles, 
  BookOpen,
  Target,
  Users,
  Gift
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "@/components/products/CheckoutModal";
import productHandshake from "@/assets/product-handshake.jpg";

const colors = {
  navy: "#1B2A4A",
  gold: "#C8A864",
};

const workbookFeatures = [
  "Complete Identity Discovery Process",
  "Leadership Presence Framework",
  "Culture Influence Tools",
  "Self-Coaching Prompts Throughout",
  "50% Discount Codes for 3 Premium Tools",
  "Executive Coaching Preview",
];

const includedDiscounts = [
  { tool: "Values Blueprint Premium", value: "50% off" },
  { tool: "Purpose Blueprint Pro", value: "50% off" },
  { tool: "6 Human Needs Advanced", value: "50% off" },
];

export default function ContagiousIdentityWorkbook() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <SEO
        title="Contagious Identity Workbook | Leadership by Design"
        description="Build your leadership identity with the Contagious Identity Workbook. Discover who you are as a leader and how that identity spreads through your organisation."
        canonicalUrl="/contagious-identity-workbook"
        keywords="leadership identity, executive workbook, leadership development, identity coaching, leadership legacy"
      />
      <Header />

      <main className="min-h-screen bg-background">
        {/* Back Navigation */}
        <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>

        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={productHandshake}
                    alt="Contagious Identity Workbook"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  className="absolute -bottom-4 -right-4 px-6 py-3 rounded-xl shadow-lg"
                  style={{ backgroundColor: colors.gold }}
                >
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: colors.navy }}
                  >
                    R697
                  </span>
                </div>
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="text-primary font-medium text-sm uppercase tracking-wider">
                    Digital Workbook
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Contagious Identity Workbook
                </h1>

                <p className="text-lg text-muted-foreground mb-6">
                  The comprehensive self-coaching workbook for leaders who want to 
                  discover, define, and transmit their authentic leadership identity.
                </p>

                <div className="space-y-3 mb-8">
                  {workbookFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Bonus Section */}
                <div 
                  className="rounded-xl p-6 mb-8 border-2"
                  style={{ borderColor: colors.gold, backgroundColor: `${colors.gold}10` }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Gift className="w-5 h-5" style={{ color: colors.gold }} />
                    <span className="font-semibold" style={{ color: colors.navy }}>
                      Included Discount Codes
                    </span>
                  </div>
                  <div className="space-y-2">
                    {includedDiscounts.map((discount, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{discount.tool}</span>
                        <span className="font-medium text-primary">{discount.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full md:w-auto text-lg px-10 py-6 font-semibold"
                  style={{ backgroundColor: colors.gold, color: colors.navy }}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Buy Now — R697
                </Button>

                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Instant PDF download • Secure checkout via Paystack</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Two Paths Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Two Ways to Work With This Material
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the path that fits your leadership journey.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Path 1: Standalone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-8 border border-border"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Path 1: Self-Guided</h3>
                <div className="text-2xl font-bold text-primary mb-4">R697</div>
                <p className="text-muted-foreground mb-6">
                  Work through the workbook at your own pace. Hit the "Ask Your Coach" 
                  prompts throughout, discover the 50% discount codes for three premium tools, 
                  and build your leadership identity independently.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Complete the work on your schedule
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Unlock 50% discounts on 3 premium tools
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Natural pathway to coaching when ready
                  </li>
                </ul>
              </motion.div>

              {/* Path 2: With Coaching */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-8 border-2 relative overflow-hidden"
                style={{ borderColor: colors.gold }}
              >
                <div className="absolute top-4 right-4">
                  <span 
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: colors.gold, color: colors.navy }}
                  >
                    PREMIUM
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${colors.gold}20` }}>
                  <Users className="w-6 h-6" style={{ color: colors.gold }} />
                </div>
                <h3 className="text-xl font-bold mb-2">Path 2: With Coaching</h3>
                <div className="text-2xl font-bold mb-4" style={{ color: colors.gold }}>
                  From R15,000
                </div>
                <p className="text-muted-foreground mb-6">
                  Get the workbook included free as part of a 6-session coaching package. 
                  Your coach walks you through it session by session, providing personalised 
                  guidance and accountability.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.gold }} />
                    Workbook included at no extra cost
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.gold }} />
                    6 × 90-minute coaching sessions
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.gold }} />
                    Personalised identity development
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/contagious-identity">
                    Explore Coaching Options
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Upgrade Credit Note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto mt-12 text-center"
            >
              <div className="bg-card rounded-xl p-6 border border-border">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Upgrade Credit Available</h3>
                <p className="text-muted-foreground text-sm">
                  If you purchase the workbook at R697 and later decide to upgrade to coaching, 
                  your workbook purchase is fully credited toward the coaching package if you 
                  upgrade within 90 days. Zero-risk entry point.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What's Inside Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  What's Inside the Workbook
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Identity Discovery",
                    description: "Uncover the leadership identity you're already transmitting—consciously and unconsciously."
                  },
                  {
                    title: "Values Excavation",
                    description: "Go beyond stated values to find the ones you actually live by under pressure."
                  },
                  {
                    title: "Presence Framework",
                    description: "Define how you want to show up in every leadership moment."
                  },
                  {
                    title: "Influence Mapping",
                    description: "Understand how your identity spreads through your organisation."
                  },
                  {
                    title: "Gap Analysis",
                    description: "Identify the disconnect between intended identity and experienced identity."
                  },
                  {
                    title: "Legacy Design",
                    description: "Shape the leadership identity that will outlast your tenure."
                  },
                ].map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card p-6 rounded-xl border border-border"
                  >
                    <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                    <p className="text-muted-foreground text-sm">{section.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section 
          className="py-16 md:py-24"
          style={{ background: `linear-gradient(135deg, ${colors.navy} 0%, #2a3f6a 100%)` }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Start Building Your Contagious Identity
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Your leadership identity is spreading whether you're intentional about it or not. 
                This workbook helps you take control.
              </p>
              <Button
                size="lg"
                onClick={() => setCheckoutOpen(true)}
                className="text-lg px-10 py-6 font-semibold"
                style={{ backgroundColor: colors.gold, color: colors.navy }}
              >
                <Download className="w-5 h-5 mr-2" />
                Get the Workbook — R697
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        productName="Contagious Identity Workbook"
        price={697}
        priceDisplay="R697"
        successPath="/contagious-identity-workbook/success"
      />
    </>
  );
}

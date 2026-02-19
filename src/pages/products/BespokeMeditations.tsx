import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Dumbbell, Briefcase, ArrowLeft, Headphones, Clock, ShieldCheck, CheckCircle, Sparkles, Play, MessageCircle } from "lucide-react";
import meditationHero from "@/assets/meditation-hero.jpg";
import meditationMindset from "@/assets/meditation-mindset.jpg";
import meditationSport from "@/assets/meditation-sport.jpg";
import meditationCorporate from "@/assets/meditation-corporate.jpg";
import meditationMillionaireMindset from "@/assets/meditation-millionaire-mindset.jpg";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutModal } from "@/components/products/CheckoutModal";
import InterestModal from "@/components/shared/InterestModal";
import { useGeoPricing } from "@/hooks/useGeoPricing";
import { supabase } from "@/integrations/supabase/client";

interface MeditationProduct {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price_zar: number;
  duration: string | null;
  file_url: string | null;
  is_active: boolean;
}

const bespokeCategories = [
  {
    id: "mindset",
    icon: Brain,
    image: meditationMindset,
    title: "Mindset",
    description: "Reprogram your subconscious for abundance, personal power, and identity transformation.",
    bullets: [
      "Millionaire mindset programming",
      "Abundance & wealth visualisation",
      "Personal power activation",
      "Identity transformation journeys",
      "Confidence & self-belief anchoring",
    ],
  },
  {
    id: "sport",
    icon: Dumbbell,
    image: meditationSport,
    title: "Sport",
    description: "Gain the mental edge with competition visualisation and peak performance programming.",
    bullets: [
      "PowerLifting competition prep",
      "Athletic performance visualisation",
      "Pre-competition mental priming",
      "Pain threshold & endurance focus",
      "Victory state anchoring",
    ],
  },
  {
    id: "corporate",
    icon: Briefcase,
    image: meditationCorporate,
    title: "Corporate Executives",
    description: "Command presence in the boardroom with clarity, confidence, and strategic thinking meditations.",
    bullets: [
      "Leadership presence activation",
      "Boardroom confidence anchoring",
      "High-stakes decision clarity",
      "Executive stress resilience",
      "Strategic thinking visualisation",
    ],
  },
];

const BespokeMeditations = () => {
  const [interestOpen, setInterestOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; price: number; priceDisplay: string } | null>(null);
  const [readyToBuyProducts, setReadyToBuyProducts] = useState<MeditationProduct[]>([]);

  const bespokePricing = useGeoPricing(1987);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("meditation_products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      if (data) setReadyToBuyProducts(data);
    };
    fetchProducts();
  }, []);

  const openReadyToBuyCheckout = (product: MeditationProduct, priceDisplay: string) => {
    setSelectedProduct({
      name: product.title,
      price: product.price_zar,
      priceDisplay,
    });
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Bespoke Mindset Meditations & Visualisations | Leadership by Design"
        description="Custom-made meditation and visualisation audio for mindset, sport, and corporate executives. Premium bespoke recordings tailored to your goals."
        canonicalUrl="/bespoke-meditations"
        ogImage="https://leadershipbydesign.co/og-products.jpg"
        keywords="bespoke meditations, mindset meditation, sport visualisation, executive meditation, custom meditation audio"
      />
      <Header />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="relative rounded-2xl overflow-hidden mb-8">
              <img src={meditationHero} alt="Bespoke meditation session" className="w-full aspect-video object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-center">
                <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                  <Headphones className="w-4 h-4" />
                  Premium Audio Content
                </div>
                <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
                  Bespoke Mindset Meditations & Visualisations
                </h1>
                <div className="w-20 h-1 bg-primary mx-auto mb-4" />
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Custom-crafted audio experiences designed to rewire your mind for peak performance — whether in business, sport, or personal transformation.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Three Bespoke Category Cards */}
          <section className="mb-16">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
              Order Your Bespoke Meditation
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto">
              We interview you, use your personal content, name, and goals to record a meditation that is uniquely yours.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              {bespokeCategories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Card className="h-full border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img src={cat.image} alt={cat.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors -mt-7 relative z-10 border-4 border-background">
                        <cat.icon className="w-7 h-7 text-primary" />
                      </div>
                      <CardTitle className="font-serif text-xl">{cat.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 text-center">{cat.description}</p>
                      <ul className="space-y-2">
                        {cat.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                      {cat.id === "mindset" && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs font-medium text-primary mb-2 flex items-center gap-1.5">
                            <Headphones className="w-3.5 h-3.5" />
                            30-Second Snippet
                          </p>
                          <audio controls preload="metadata" className="w-full h-8 [&::-webkit-media-controls-panel]:bg-muted/50 rounded">
                            <source src="/audio/mindset-hypnosis-snippet.m4a" type="audio/mp4" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                      {cat.id === "sport" && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs font-medium text-primary mb-2 flex items-center gap-1.5">
                            <Headphones className="w-3.5 h-3.5" />
                            30-Second Snippet
                          </p>
                          <audio controls preload="metadata" className="w-full h-8 [&::-webkit-media-controls-panel]:bg-muted/50 rounded">
                            <source src="/audio/sport-lauren-snippet.m4a" type="audio/mp4" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Single CTA for bespoke - now opens contact form */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-2xl font-bold text-foreground mb-1">
                {bespokePricing.localPrice}
              </p>
              <p className="text-sm text-muted-foreground mb-4">per custom bespoke recording</p>
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => setInterestOpen(true)}>
                <MessageCircle className="w-5 h-5 mr-2" />
                Enquire About Bespoke Meditation
              </Button>
            </motion.div>
          </section>

          {/* Ready-to-Buy Meditations */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                Ready-to-Buy Meditations
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Pre-recorded meditations available for instant download. Purchase and start listening immediately.
              </p>
            </motion.div>

            {readyToBuyProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {readyToBuyProducts.map((product, i) => (
                  <ReadyToBuyCard key={product.id} product={product} index={i} onBuy={(priceDisplay) => openReadyToBuyCheckout(product, priceDisplay)} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center py-12 bg-muted/30 rounded-xl border border-border"
              >
                <Headphones className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Coming Soon</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Pre-recorded meditations are being crafted and will be available here shortly. In the meantime, order a bespoke meditation above.
                </p>
              </motion.div>
            )}
          </section>

          {/* Guarantee */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-12 bg-primary/5 rounded-2xl border border-primary/20 mb-12"
          >
            <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">Quality Guarantee</h3>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Every meditation is professionally crafted with proven neuroscience-backed techniques. If your bespoke meditation doesn't meet your expectations, we'll revise it at no extra cost.
            </p>
          </motion.section>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              Ready to Transform Your Mind?
            </h2>
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => setInterestOpen(true)}>
              <MessageCircle className="w-5 h-5 mr-2" />
              Enquire About Bespoke — {bespokePricing.localPrice}
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />

      {/* Bespoke inquiry modal */}
      <InterestModal
        open={interestOpen}
        onOpenChange={setInterestOpen}
        context="Bespoke Meditation Enquiry (R1,987)"
      />

      {/* Ready-to-buy checkout modal */}
      {selectedProduct && (
        <CheckoutModal
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          productName={selectedProduct.name}
          price={selectedProduct.price}
          priceDisplay={selectedProduct.priceDisplay}
          successPath="/bespoke-meditations/success"
        />
      )}
    </div>
  );
};


function ReadyToBuyCard({ product, index, onBuy }: { product: MeditationProduct; index: number; onBuy: (priceDisplay: string) => void }) {
  const pricing = useGeoPricing(product.price_zar);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="h-full border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
        {product.category === "mindset" && (
          <div className="aspect-video overflow-hidden">
            <img src={meditationMillionaireMindset} alt={product.title} className="w-full h-full object-cover object-top" />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Play className="w-5 h-5 text-primary" />
            </div>
            {product.duration && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {product.duration}
              </span>
            )}
          </div>
          <CardTitle className="font-serif text-lg">{product.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {product.description && (
            <p className="text-muted-foreground text-sm mb-4 flex-1">{product.description}</p>
          )}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
            <span className="text-lg font-bold text-foreground">{pricing.localPrice}</span>
            <Button size="sm" onClick={() => onBuy(pricing.localPrice)}>
              Buy Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default BespokeMeditations;

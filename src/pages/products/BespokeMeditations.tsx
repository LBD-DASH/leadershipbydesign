import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Dumbbell, Briefcase, ArrowLeft, Headphones, Clock, ShieldCheck, CheckCircle, Sparkles, Play, MessageCircle } from "lucide-react";
import meditationHero from "@/assets/meditation-hero.jpg";
import meditationMindset from "@/assets/meditation-mindset.jpg";
import meditationSport from "@/assets/meditation-sport.jpg";
import meditationCorporate from "@/assets/meditation-corporate.jpg";
import meditationMillionaireMindset from "@/assets/meditation-millionaire-mindset.jpg";
import medBoardroomPresence from "@/assets/med-boardroom-presence.jpg";
import medDecisionClarity from "@/assets/med-decision-clarity.jpg";
import medBurnoutReset from "@/assets/med-burnout-reset.jpg";
import medStrategicThinking from "@/assets/med-strategic-thinking.jpg";
import medImposterRecode from "@/assets/med-imposter-recode.jpg";
import medNegotiation from "@/assets/med-negotiation.jpg";
import medSleepProtocol from "@/assets/med-sleep-protocol.jpg";
import medLeadershipConfidence from "@/assets/med-leadership-confidence.jpg";
import medConflictReset from "@/assets/med-conflict-reset.jpg";
import medDifficultConvo from "@/assets/med-difficult-convo.jpg";
import medVisionAlignment from "@/assets/med-vision-alignment.jpg";
import medOwnership from "@/assets/med-ownership.jpg";
import medMorningActivation from "@/assets/med-morning-activation.jpg";
import medEveningDetox from "@/assets/med-evening-detox.jpg";
import medOverthinking from "@/assets/med-overthinking.jpg";
import medConfidencePressure from "@/assets/med-confidence-pressure.jpg";
import medFutureSelf from "@/assets/med-future-self.jpg";
import medPregameFocus from "@/assets/med-pregame-focus.jpg";
import medClutchMoment from "@/assets/med-clutch-moment.jpg";
import medComeback from "@/assets/med-comeback.jpg";
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

const themedProducts = [
  {
    theme: "🏢 Executive Performance",
    products: [
      { name: "Boardroom Presence Primer™", tagline: "7-min executive authority activation before high-stakes meetings.", price: 891, image: medBoardroomPresence },
      { name: "Decision Clarity Reset™", tagline: "Cut noise. Sharpen thinking. Lead without emotional distortion.", price: 891, image: medDecisionClarity },
      { name: "High-Performance Burnout Reset™", tagline: "Nervous system recalibration for leaders under sustained pressure.", price: 1041, image: medBurnoutReset },
      { name: "Strategic Thinking Deep Dive™", tagline: "A guided cognitive reset to think 3 moves ahead.", price: 1041, image: medStrategicThinking },
      { name: "Imposter Syndrome Recode™", tagline: "Identity shift for newly promoted or high-achieving leaders.", price: 891, image: medImposterRecode },
      { name: "Negotiation Neutrality™", tagline: "Emotional composure and psychological leverage before tough deals.", price: 1041, image: medNegotiation },
      { name: "Executive Sleep Protocol™", tagline: "Mental offloading ritual for true recovery.", price: 741, image: medSleepProtocol },
      { name: "Leadership Confidence Amplifier™", tagline: "Embody calm authority before stepping into influence.", price: 891, image: medLeadershipConfidence },
    ],
  },
  {
    theme: "🚀 Team & Organisational Performance",
    products: [
      { name: "Conflict Reset for Leaders™", tagline: "Detach ego. Re-enter the conversation with clarity.", price: 891, image: medConflictReset },
      { name: "Difficult Conversation Priming™", tagline: "Emotional steadiness before feedback or accountability meetings.", price: 891, image: medDifficultConvo },
      { name: "Vision Alignment Visualisation™", tagline: "Reconnect to long-term strategy when overwhelmed by operations.", price: 1041, image: medVisionAlignment },
      { name: "Ownership & Accountability Activation™", tagline: "Identity shift from manager to leader.", price: 891, image: medOwnership },
    ],
  },
  {
    theme: "🧠 Personal Mental Edge",
    products: [
      { name: "Morning Strategic Activation™", tagline: "Start the day aligned, focused, and decisive.", price: 741, image: medMorningActivation },
      { name: "Evening Cognitive Detox™", tagline: "Shut down rumination and mental replay loops.", price: 741, image: medEveningDetox },
      { name: "Overthinking Interruption Protocol™", tagline: "Reset analytical paralysis in under 8 minutes.", price: 741, image: medOverthinking },
      { name: "Confidence Under Pressure™", tagline: "Perform when it matters most.", price: 891, image: medConfidencePressure },
      { name: "Future Self Leadership Integration™", tagline: "Step into the identity of the leader you are becoming.", price: 1041, image: medFutureSelf },
    ],
  },
  {
    theme: "🏆 Sports/Competing Performance",
    products: [
      { name: "Pre-Game Focus Lock™", tagline: "Narrow attention and elevate competitive readiness.", price: 891, image: medPregameFocus },
      { name: "Clutch Moment Simulation™", tagline: "Train your nervous system for pressure moments.", price: 891, image: medClutchMoment },
      { name: "Comeback Mindset Reset™", tagline: "Emotional recovery after mistakes or losses.", price: 891, image: medComeback },
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
                      {cat.id === "corporate" && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs font-medium text-primary mb-2 flex items-center gap-1.5">
                            <Headphones className="w-3.5 h-3.5" />
                            30-Second Snippet
                          </p>
                          <audio controls preload="metadata" className="w-full h-8 [&::-webkit-media-controls-panel]:bg-muted/50 rounded">
                            <source src="https://fdtlljyfjdlrymfeguoa.supabase.co/storage/v1/object/public/lead-magnets/audio/corporate-executive-snippet.mp3" type="audio/mpeg" />
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

          {/* Themed Pre-Recorded Catalogue */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                Ready-to-Buy Meditations
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Pre-recorded meditations available for instant download. Purchase and start listening immediately.
              </p>
            </motion.div>

            {themedProducts.map((theme, ti) => {
              // Map DB products into matching theme categories
              const categoryMap: Record<string, number> = { mindset: 2, sport: 3, corporate: 0 };
              const matchingDbProducts = readyToBuyProducts.filter(p => categoryMap[p.category] === ti);

              return (
              <div key={ti} className="mb-10">
                <h3 className="font-serif text-lg md:text-xl font-bold text-foreground mb-4">{theme.theme}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {/* DB-driven products as compact cards */}
                  {matchingDbProducts.map((product, di) => {
                    const dbPricing = product.price_zar;
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: di * 0.05, duration: 0.35 }}
                      >
                        <Card className="h-full border-primary/30 hover:border-primary/50 hover:shadow-md transition-all duration-300 group overflow-hidden flex flex-col ring-1 ring-primary/20">
                          <div className="h-20 bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_40%,white_0%,transparent_60%)]" />
                            <Play className="w-8 h-8 text-white/90 relative z-10 group-hover:scale-110 transition-transform" />
                            <span className="absolute top-1 right-1 bg-white/20 text-white text-[8px] px-1.5 py-0.5 rounded-full font-medium backdrop-blur-sm">AVAILABLE</span>
                          </div>
                          <CardContent className="p-3 flex-1 flex flex-col">
                            <h4 className="font-semibold text-xs leading-tight text-foreground mb-1">{product.title}</h4>
                            <p className="text-[10px] text-muted-foreground leading-snug mb-3 flex-1">{product.description}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <span className="text-sm font-bold text-foreground">R{dbPricing}</span>
                              <Button size="sm" variant="default" className="h-7 text-[10px] px-2" onClick={() => openReadyToBuyCheckout(product, `R${dbPricing}`)}>
                                Buy Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                  {theme.products.map((product, pi) => {
                    return (
                      <motion.div
                        key={pi}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (matchingDbProducts.length + pi) * 0.05, duration: 0.35 }}
                      >
                        <Card className="h-full border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group overflow-hidden flex flex-col">
                          <div className="h-20 overflow-hidden relative">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          </div>
                          <CardContent className="p-3 flex-1 flex flex-col">
                            <h4 className="font-semibold text-xs leading-tight text-foreground mb-1">{product.name}</h4>
                            <p className="text-[10px] text-muted-foreground leading-snug mb-3 flex-1">{product.tagline}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <span className="text-sm font-bold text-foreground">R{product.price}</span>
                              <Button size="sm" variant="default" className="h-7 text-[10px] px-2" onClick={() => setInterestOpen(true)}>
                                Buy Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              );
            })}
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

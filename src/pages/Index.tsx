import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import OrganizationSchema from "@/components/OrganizationSchema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingSocial from "@/components/FloatingSocial";
import kevinImage from "@/assets/kevin-britz-facilitator.jpg";
import heroImage from "@/assets/hero-leadership-team.jpg";
import lacImage from "@/assets/leader-as-coach.jpg";
import shiftImage from "@/assets/shift-hero-team.jpg";
import ciImage from "@/assets/contagious-identity-coaching-hero.jpg";
import problemImage from "@/assets/leadership-feedback.jpg";

const Index = () => {
  return (
    <>
      <SEO
        title="Manager Coaching Programme South Africa | Leader as Coach | Leadership by Design"
        description="Install coaching capability into your management layer in 90 days. Proven with 4,000+ leaders across 50+ organisations in South African financial services. Book a discovery call."
        canonicalUrl="/"
        keywords="manager coaching programme, leader as coach, leadership development, executive coaching, South Africa, financial services, Kevin Britz"
      />
      <OrganizationSchema />
      <div className="min-h-screen">
        <Header />

        {/* SECTION 1 — HERO */}
        <section
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: "#0F1F2E" }}
        >
          <img
            src={heroImage}
            alt="Leadership team in collaborative session"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div
            className="absolute inset-0 animate-[heroGradient_12s_ease_infinite]"
            style={{
              background: "linear-gradient(135deg, rgba(15,31,46,0.85) 0%, rgba(26,50,69,0.75) 50%, rgba(15,31,46,0.85) 100%)",
              backgroundSize: "200% 200%",
            }}
          />
          <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
            <p
              className="uppercase tracking-[0.25em] text-sm mb-6"
              style={{ color: "#C8A864", fontFamily: "'Source Sans 3', sans-serif" }}
            >
              Leadership by Design
            </p>
            <h1
              className="font-serif font-bold mb-6 leading-tight"
              style={{ color: "#FFFFFF", fontSize: "clamp(40px, 5vw, 64px)", maxWidth: 800, margin: "0 auto 1.5rem" }}
            >
              Built by design.
              <br />
              Not by default.
            </h1>
            <p
              className="mb-10 mx-auto"
              style={{
                color: "rgba(248,246,241,0.7)",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 20,
                maxWidth: 600,
                lineHeight: 1.6,
              }}
            >
              Most organisations end up with the leadership culture they have by accident. We build the one they need on purpose.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/leader-as-coach">
                <button
                  className="px-8 py-3.5 rounded-md font-semibold text-base transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#C8A864", color: "#0F1F2E", fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  See the Programme
                </button>
              </Link>
              <Link to="/leader-as-coach-diagnostic">
                <button
                  className="px-8 py-3.5 rounded-md font-semibold text-base border-2 transition-opacity hover:opacity-80"
                  style={{ borderColor: "#C8A864", color: "#C8A864", backgroundColor: "transparent", fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  Take the Diagnostic
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 2 — PROOF BAR */}
        <section style={{ backgroundColor: "#2A7B88" }} className="py-6 sm:py-8">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0">
              {[
                { value: "4,000+", label: "Leaders Developed" },
                { value: "750+", label: "Programmes Delivered" },
                { value: "30+", label: "Organisations" },
                { value: "11 Years", label: "In Practice" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center sm:border-r last:border-r-0"
                  style={{ borderColor: "rgba(200,168,100,0.3)" }}
                >
                  <p className="font-serif font-bold text-2xl sm:text-3xl text-white">{stat.value}</p>
                  <p style={{ color: "#F8F6F1", fontFamily: "'Source Sans 3', sans-serif", fontSize: 13 }} className="mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 — THE PROBLEM */}
        <section style={{ backgroundColor: "#F8F6F1" }} className="py-20 sm:py-28 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p
                  className="uppercase tracking-[0.2em] text-sm mb-4"
                  style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  The Gap We Close
                </p>
                <h2
                  className="font-serif font-bold mb-8 leading-tight"
                  style={{ color: "#0F1F2E", fontSize: "clamp(28px, 3.5vw, 44px)" }}
                >
                  Your managers were promoted for what they could do.
                  <br className="hidden sm:block" />
                  Not for how they lead people.
                </h2>
                <div
                  className="space-y-4 mb-10"
                  style={{ color: "#0F1F2E", fontFamily: "'Source Sans 3', sans-serif", fontSize: 18, lineHeight: 1.8 }}
                >
                  <p>
                    The result shows up everywhere. In attrition numbers that nobody can fully explain. In performance reviews that say nothing. In escalations that should never reach your desk. In a culture that talks about development and delivers compliance.
                  </p>
                  <p>
                    This is not a training problem. It is an operating system problem. And no two-day workshop has ever fixed an operating system.
                  </p>
                </div>
                <blockquote
                  className="pl-6 py-2"
                  style={{ borderLeft: "4px solid #C8A864" }}
                >
                  <p className="font-serif italic" style={{ color: "#0F1F2E", fontSize: 20 }}>
                    "Behaviour follows identity. Change the identity, change the behaviour."
                  </p>
                </blockquote>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={problemImage}
                  alt="Leadership development feedback session"
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — THREE PROGRAMME CARDS */}
        <section className="py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p
                className="uppercase tracking-[0.2em] text-sm mb-4"
                style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}
              >
                What We Build
              </p>
              <h2 className="font-serif font-bold mb-4" style={{ color: "#0F1F2E", fontSize: "clamp(28px, 3.5vw, 44px)" }}>
                Three ways we work with organisations.
              </h2>
              <p style={{ color: "#666666", fontFamily: "'Source Sans 3', sans-serif", fontSize: 18 }}>
                One signature programme. Two supporting frameworks. All built on the same operating system.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* CARD 1 — Leader as Coach (elevated) */}
              <div
                className="rounded-lg overflow-hidden flex flex-col shadow-xl lg:-mt-4 lg:mb-4"
                style={{ backgroundColor: "#0F1F2E" }}
              >
                <div className="h-48 overflow-hidden">
                  <img src={lacImage} alt="Leader as Coach programme session" className="w-full h-full object-cover" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <p className="uppercase tracking-[0.15em] text-xs font-semibold mb-2" style={{ color: "#C8A864", fontFamily: "'Source Sans 3', sans-serif" }}>
                    Signature Programme
                  </p>
                  <h3 className="font-serif font-bold text-[28px] text-white mb-1">Leader as Coach</h3>
                  <p className="text-sm mb-4" style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}>
                    90-Day Manager Coaching Accelerator
                  </p>
                  <p className="mb-6" style={{ color: "#F8F6F1", fontFamily: "'Source Sans 3', sans-serif", fontSize: 16, lineHeight: 1.7 }}>
                    The management layer is where leadership culture is won or lost. This is a structured 90-day process that turns your managers into coaches — permanently. Not a workshop. An operating system.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["Month 1: Foundation", "Month 2: Practice", "Month 3: Embed"].map((phase) => (
                      <span key={phase} className="px-3 py-1 rounded-full text-xs text-white" style={{ backgroundColor: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}>
                        {phase}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <Link to="/leader-as-coach" className="block">
                      <button className="w-full py-3 rounded-md font-semibold text-base" style={{ backgroundColor: "#C8A864", color: "#0F1F2E", fontFamily: "'Source Sans 3', sans-serif" }}>
                        See the Programme
                      </button>
                    </Link>
                    <p className="text-center mt-2" style={{ color: "rgba(248,246,241,0.6)", fontFamily: "'Source Sans 3', sans-serif", fontSize: 13 }}>
                      SDL-eligible spend
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD 2 — SHIFT */}
              <div className="rounded-lg overflow-hidden flex flex-col shadow-md border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderTop: "3px solid #C8A864" }}>
                <div className="h-48 overflow-hidden">
                  <img src={shiftImage} alt="SHIFT leadership development team" className="w-full h-full object-cover" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="font-serif font-bold text-[28px] mb-1" style={{ color: "#0F1F2E" }}>SHIFT</h3>
                  <p className="text-sm mb-4" style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}>
                    The Leadership Operating System for the AI Era
                  </p>
                  <p className="mb-6" style={{ color: "#444444", fontFamily: "'Source Sans 3', sans-serif", fontSize: 16, lineHeight: 1.7 }}>
                    Six skills every leader needs to stay relevant in the next decade. Self-Management. Human Intelligence. Innovation. Focus. Thinking. Your AI Edge. Not a framework to learn — a system to run on.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {["Self-Management", "Human Intelligence", "Innovation", "Focus", "Thinking", "Your AI Edge"].map((skill) => (
                      <span key={skill} className="px-3 py-1.5 rounded text-xs text-white text-center" style={{ backgroundColor: "#0F1F2E", fontFamily: "'Source Sans 3', sans-serif" }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <Link to="/shift-diagnostic" className="block">
                      <button className="w-full py-3 rounded-md font-semibold text-base text-white" style={{ backgroundColor: "#0F1F2E", fontFamily: "'Source Sans 3', sans-serif" }}>
                        Explore SHIFT
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* CARD 3 — Contagious Identity */}
              <div className="rounded-lg overflow-hidden flex flex-col shadow-md border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderTop: "3px solid #C8A864" }}>
                <div className="h-48 overflow-hidden">
                  <img src={ciImage} alt="Executive coaching session" className="w-full h-full object-cover" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="font-serif font-bold text-[28px] mb-1" style={{ color: "#0F1F2E" }}>Contagious Identity</h3>
                  <p className="text-sm mb-4" style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}>
                    Executive Coaching for Senior Leaders
                  </p>
                  <p className="mb-4" style={{ color: "#444444", fontFamily: "'Source Sans 3', sans-serif", fontSize: 16, lineHeight: 1.7 }}>
                    How a leader sees themselves determines how they lead others. Contagious Identity is a six-session executive coaching programme that works at identity level — because that is where leadership actually lives.
                  </p>
                  <p className="mb-6" style={{ color: "#888888", fontFamily: "'Source Sans 3', sans-serif", fontSize: 14 }}>
                    6 sessions. One-to-one. Senior leaders only.
                  </p>
                  <div className="mt-auto">
                    <Link to="/contagious-identity" className="block">
                      <button className="w-full py-3 rounded-md font-semibold text-base text-white" style={{ backgroundColor: "#0F1F2E", fontFamily: "'Source Sans 3', sans-serif" }}>
                        Explore Executive Coaching
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — DIAGNOSTIC CTA BANNER */}
        <section style={{ backgroundColor: "#2A7B88" }} className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif font-bold text-white mb-4" style={{ fontSize: "clamp(28px, 3vw, 36px)" }}>
              Not sure where your management layer sits?
            </h2>
            <p className="mb-8 mx-auto" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Source Sans 3', sans-serif", fontSize: 18, maxWidth: 560, lineHeight: 1.6 }}>
              Take the free LAC Diagnostic. 15 questions. 3 minutes. A clear picture of whether your organisation is ready to build a coaching culture — and where to start.
            </p>
            <Link to="/leader-as-coach-diagnostic">
              <button className="px-8 py-3.5 rounded-md font-semibold text-base" style={{ backgroundColor: "#C8A864", color: "#0F1F2E", fontFamily: "'Source Sans 3', sans-serif" }}>
                Take the Free Diagnostic
              </button>
            </Link>
            <p className="mt-3" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Source Sans 3', sans-serif", fontSize: 13 }}>
              Free. No email required to start.
            </p>
          </div>
        </section>

        {/* SECTION 6 — ABOUT KEVIN */}
        <section style={{ backgroundColor: "#F8F6F1" }} className="py-20 sm:py-28 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <p
              className="uppercase tracking-[0.2em] text-sm mb-8"
              style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}
            >
              Who Builds This
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif font-bold mb-1" style={{ color: "#0F1F2E", fontSize: 36 }}>Kevin Britz</h2>
                <p className="font-serif mb-6" style={{ color: "#0F1F2E", fontSize: 20 }}>Leadership Architect</p>
                <div style={{ color: "#0F1F2E", fontFamily: "'Source Sans 3', sans-serif", fontSize: 17, lineHeight: 1.8 }} className="space-y-4 mb-8">
                  <p>
                    I have spent 11 years inside South African organisations watching the same gap destroy the same potential. Technically strong people put into leadership positions with no operating system for the human side of the job.
                  </p>
                  <p>
                    Leadership by Design exists to close that gap. Not with training content. With architecture.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Executive Coach", "Leadership Architect", "11 Years Practice"].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded text-xs text-white" style={{ backgroundColor: "#0F1F2E", fontFamily: "'Source Sans 3', sans-serif", fontSize: 13 }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to="/leader-as-coach" className="inline-flex items-center gap-1 underline" style={{ color: "#2A7B88", fontFamily: "'Source Sans 3', sans-serif" }}>
                  Read more about our approach <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div
                className="aspect-square rounded-lg overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: "#0F1F2E", border: "2px solid #2A7B88" }}
              >
                <img
                  src={kevinImage}
                  alt="Kevin Britz — Leadership Architect"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7 — FINAL CTA */}
        <section style={{ backgroundColor: "#0F1F2E" }} className="py-20 sm:py-28 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif font-bold text-white mb-4" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", maxWidth: 700, margin: "0 auto 1rem" }}>
              Ready to build a management layer that actually leads?
            </h2>
            <p className="mb-10" style={{ color: "rgba(248,246,241,0.7)", fontFamily: "'Source Sans 3', sans-serif", fontSize: 18 }}>
              Start with a 20-minute discovery call. No pitch. A real conversation about your situation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://calendly.com/kevinbritz/discovery-call" target="_blank" rel="noopener noreferrer">
                <button className="px-8 py-3.5 rounded-md font-semibold text-base" style={{ backgroundColor: "#C8A864", color: "#0F1F2E", fontFamily: "'Source Sans 3', sans-serif" }}>
                  Book a Discovery Call
                </button>
              </a>
              <Link to="/leader-as-coach">
                <button className="px-8 py-3.5 rounded-md font-semibold text-base border-2" style={{ borderColor: "#C8A864", color: "#C8A864", backgroundColor: "transparent", fontFamily: "'Source Sans 3', sans-serif" }}>
                  See the Programme
                </button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
        <FloatingSocial />
      </div>

      <style>{`
        @keyframes heroGradient {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
        }
      `}</style>
    </>
  );
};

export default Index;

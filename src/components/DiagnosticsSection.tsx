import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, User, ArrowRight, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DiagnosticsSection() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
            Free Diagnostics
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover where you and your team need the most support with our complimentary assessments.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Team Diagnostic Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link to="/team-diagnostic" className="block group">
              <div className="bg-background rounded-2xl p-8 border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Free Assessment</span>
                    <h3 className="text-2xl font-bold text-foreground">Team Diagnostic</h3>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Identify your team's primary friction point and discover which SHIFT workshop will create the biggest impact. Get personalized recommendations based on your team's unique challenges.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <ClipboardCheck className="w-4 h-4 text-primary flex-shrink-0" />
                    15 targeted questions
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <ClipboardCheck className="w-4 h-4 text-primary flex-shrink-0" />
                    Instant results & recommendations
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <ClipboardCheck className="w-4 h-4 text-primary flex-shrink-0" />
                    Downloadable workshop overview
                  </li>
                </ul>

                <Button className="w-full group-hover:bg-primary/90">
                  Take Team Diagnostic
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Link>
          </motion.div>

          {/* Leadership Diagnostic Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-background rounded-2xl p-8 border border-border h-full relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                Coming Soon
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                  <User className="w-7 h-7 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Free Assessment</span>
                  <h3 className="text-2xl font-bold text-foreground">Leadership Diagnostic</h3>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Assess your personal leadership identity and discover how you show up as a leader. Understand your strengths, blind spots, and areas for growth with the Leadership Elevation Index™.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ClipboardCheck className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                  Comprehensive leadership assessment
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ClipboardCheck className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                  Personal leadership profile
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ClipboardCheck className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                  Development recommendations
                </li>
              </ul>

              <Button disabled className="w-full" variant="secondary">
                Coming Soon
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

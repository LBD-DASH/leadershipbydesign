import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import kevinPhoto from "@/assets/kevin-britz-facilitator.jpg";

export default function CredibilityBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="py-16 sm:py-20 bg-muted/50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
          {/* Photo — 2 columns */}
          <div className="md:col-span-2 flex justify-center">
            <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-2xl overflow-hidden shadow-lg border-4 border-background">
              <img
                src={kevinPhoto}
                alt="Kevin Britz — Executive Coach and Leadership Facilitator"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text — 3 columns */}
          <div className="md:col-span-3 text-center md:text-left">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
              11 Years. 750 Workshops.<br />
              4,000+ Leaders Developed.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-xl">
              Kevin Britz is a sought-after executive coach, leadership facilitator, and business school faculty member with over a decade of experience designing bespoke leadership programmes for South Africa's most respected organisations.
            </p>

            <ul className="space-y-3 mb-8 text-sm sm:text-base text-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✦</span>
                750+ workshops delivered across corporate, NGO, and academic environments
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✦</span>
                4,000+ leaders developed through coaching, facilitation, and proprietary methodology
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✦</span>
                Business school faculty · Bespoke programme designer · Trusted by Discovery, FNB, MIT Management School, and 50+ leading organisations
              </li>
            </ul>

            <Link to="/about">
              <Button className="rounded-full group">
                Meet Kevin
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe } from "lucide-react";

export default function InternationalSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-primary relative overflow-hidden">
      {/* Abstract globe background */}
      <div className="absolute inset-0 opacity-5">
        <Globe className="w-[600px] h-[600px] absolute -right-40 -bottom-40 text-primary-foreground" strokeWidth={0.5} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Working With Organisations Across Africa and Beyond
        </h2>
        <div className="w-16 h-0.5 bg-accent mx-auto mb-8" />
        <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-3xl mx-auto mb-10">
          Leadership by Design works with multinationals, JSE-listed companies, and growth-stage organisations across Sub-Saharan Africa, the UK, and the Middle East. Kevin's SHIFT methodology is built on universal principles of human behaviour and performance — it translates across industries, cultures, and geographies.
        </p>
        <Link to="/contact">
          <Button size="lg" className="bg-accent text-accent-foreground hover:opacity-90 px-8 py-6 text-base font-semibold">
            Discuss Your Organisation's Needs
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import ldbLogo from "@/assets/ldb-logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src={ldbLogo} alt="Leadership by Design" className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="text-xs text-primary-foreground/60">
              Transforming leaders and organisations through evidence-based coaching and development systems.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-accent">Services</h4>
            <ul className="space-y-2">
              <li><Link to="/programmes" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">SHIFT Programmes</Link></li>
              <li><Link to="/contagious-identity" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">Contagious Identity Coaching</Link></li>
              <li><Link to="/workshops/alignment" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">Team Workshops</Link></li>
              <li><Link to="/shift-certified" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">SHIFT Certified Facilitator Programme</Link></li>
              <li><Link to="/contact" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">Leadership Advisory Retainer</Link></li>
              <li><Link to="/contact" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">Speaking Engagements</Link></li>
            </ul>
          </div>

          {/* Diagnostics */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-accent">Diagnostics</h4>
            <ul className="space-y-2">
              <li><Link to="/leadership-diagnostic" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">Leadership Diagnostic</Link></li>
              <li><Link to="/team-diagnostic" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">Team Diagnostic</Link></li>
              <li><Link to="/shift-diagnostic" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">SHIFT Diagnostic</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-accent">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">Blog</Link></li>
              <li><Link to="/podcast" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">Podcast</Link></li>
              <li><Link to="/case-studies" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">Case Studies</Link></li>
              <li><Link to="/about" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">About Kevin</Link></li>
              <li>
                <a href="https://www.linkedin.com/in/kevinbritz-leadership/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  <Linkedin className="w-3 h-3" /> LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Global Reach */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-accent">Global Reach</h4>
            <ul className="space-y-2">
              <li className="text-xs text-primary-foreground/70">South Africa</li>
              <li className="text-xs text-primary-foreground/70">Sub-Saharan Africa</li>
              <li className="text-xs text-primary-foreground/70">United Kingdom</li>
              <li className="text-xs text-primary-foreground/70">Middle East</li>
              <li><Link to="/contact" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">Enquire about your region →</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-8 text-center">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} Leadership by Design. All rights reserved. | SHIFT® is a registered methodology of Leadership by Design.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from "react-router-dom";
import { Linkedin, Phone } from "lucide-react";
import ldbLogo from "@/assets/ldb-logo.png";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
            <Link to="/" className="inline-block mb-3 sm:mb-4">
              <img src={ldbLogo} alt="Leadership by Design" className="h-8 sm:h-10 w-auto" />
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Transforming leaders and organisations through evidence-based coaching and development programmes.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">Services</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/programmes" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Programmes</Link></li>
              <li><Link to="/executive-coaching" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Executive Coaching</Link></li>
              <li><Link to="/contagious-identity" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Contagious Identity</Link></li>
              <li><Link to="/shift-methodology" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">SHIFT Methodology</Link></li>
              <li><Link to="/workshops/alignment" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Alignment Workshop</Link></li>
              <li><Link to="/workshops/motivation" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Motivation Workshop</Link></li>
              <li><Link to="/workshops/leadership" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Leadership Workshop</Link></li>
            </ul>
          </div>

          {/* Assessments */}
          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">Assessments</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/team-diagnostic" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Team Diagnostic</Link></li>
              <li><Link to="/leadership-diagnostic" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Leadership Diagnostic</Link></li>
              <li><Link to="/ai-readiness" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">AI Readiness</Link></li>
              <li><Link to="/shift-diagnostic" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">SHIFT Diagnostic</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">Resources</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/blog" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/podcast" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Podcast</Link></li>
              <li><Link to="/case-studies" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Case Studies</Link></li>
              <li><Link to="/resources" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Resource Library</Link></li>
              <li><Link to="/book" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Book</Link></li>
              <li><Link to="/products" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Products</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">Connect</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/about" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Get in Touch</Link></li>
              <li><Link to="/hellocoach" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">HelloCoach</Link></li>
              <li>
                <a href="https://valuesblueprint.online" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Values Blueprint</a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/kevinbritz-leadership/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-[#0A66C2] transition-colors">
                  <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {new Date().getFullYear()} Leadership by Design. All rights reserved.
            </p>
            <Link to="/privacy-policy" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/marketing" className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium bg-muted text-muted-foreground px-4 py-2 rounded-md hover:bg-muted/80 transition-colors">
              Admin
            </Link>
            <Link to="/cold-call-prompter" className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              Call Centre Prompter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

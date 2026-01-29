import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import ldbLogo from "@/assets/ldb-logo.png";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-3 sm:mb-4">
              <img src={ldbLogo} alt="Leadership by Design" className="h-8 sm:h-10 w-auto" />
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Transforming leaders and organisations through evidence-based coaching and development programmes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link to="/programmes" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Programmes
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">Tools</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link to="/hellocoach" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  HelloCoach
                </Link>
              </li>
              <li>
                <a href="https://valuesblueprint.online" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Values Blueprint
                </a>
              </li>
              <li>
                <a href="https://6humanneeds.online" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  6 Human Needs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Connect */}
          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-3 sm:mb-4">Connect</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link to="/contact" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Get in Touch
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/in/kevinbritz-leadership/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-[#0A66C2] transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Leadership by Design. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

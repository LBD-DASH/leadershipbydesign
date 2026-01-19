import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import ldbLogo from "@/assets/ldb-logo.png";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src={ldbLogo} alt="Leadership by Design" className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Transforming leaders and organisations through evidence-based coaching and development programmes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/programmes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Programmes
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Tools</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/hellocoach" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  HelloCoach
                </Link>
              </li>
              <li>
                <a href="https://valuesblueprint.online" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Values Blueprint
                </a>
              </li>
              <li>
                <a href="https://6humanneeds.online" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  6 Human Needs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Connect */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Get in Touch
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/in/kevinbritz/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0A66C2] transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Leadership by Design. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

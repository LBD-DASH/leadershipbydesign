import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, ExternalLink } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import ldbLogo from "@/assets/ldb-logo.png";
import { cn } from "@/lib/utils";

const Header = () => {
  const [programmesOpen, setProgrammesOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isProgrammesActive = ["/leadership-diagnostic", "/team-diagnostic", "/programmes", "/workshops/alignment", "/workshops/motivation", "/workshops/leadership", "/shift-methodology", "/contagious-identity", "/corporate-mind-reset"].some(
    path => location.pathname.startsWith(path)
  );

  const isProductsActive = location.pathname.startsWith("/products") || location.pathname.startsWith("/bespoke-meditations");

  const isResourcesActive = ["/resources", "/blog", "/hellocoach", "/book", "/leadership-mistakes", "/case-studies", "/podcast"].some(
    path => location.pathname.startsWith(path)
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <img src={ldbLogo} alt="Leadership by Design" className="h-10 w-auto" />
        </NavLink>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink 
            to="/" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-foreground"
          >
            Home
          </NavLink>

          {/* Programmes Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setProgrammesOpen(true)}
            onMouseLeave={() => setProgrammesOpen(false)}
          >
            <button 
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors",
                isProgrammesActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Programmes
              <ChevronDown className={cn("w-4 h-4 transition-transform", programmesOpen && "rotate-180")} />
            </button>
            
            {programmesOpen && (
              <div className="absolute top-full left-0 pt-2">
                <div className="bg-background border border-border rounded-lg shadow-lg py-2 min-w-[200px]">
                  <Link 
                    to="/leadership-diagnostic" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Leadership Diagnostic
                  </Link>
                  <Link 
                    to="/team-diagnostic" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Team Diagnostic
                  </Link>
                  <Link 
                    to="/shift-methodology" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    SHIFT Methodology™
                  </Link>
                  <Link 
                    to="/contagious-identity" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Contagious Identity Coaching
                  </Link>
                  <Link 
                    to="/corporate-mind-reset" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Corporate Mind Reset
                  </Link>
                  <div className="border-t border-border my-1"></div>
                  <Link 
                    to="/programmes" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    All Programmes
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Products Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button 
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors",
                isProductsActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Products
              <ChevronDown className={cn("w-4 h-4 transition-transform", productsOpen && "rotate-180")} />
            </button>
            
            {productsOpen && (
              <div className="absolute top-full left-0 pt-2">
                <div className="bg-background border border-border rounded-lg shadow-lg py-2 min-w-[180px]">
                  <Link 
                    to="/products" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Leadership Tools
                  </Link>
                  <a 
                    href="https://valuesblueprint.online" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Values
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://findmypurpose.me" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Purpose
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://sixhumanneeds.lovable.app" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    6 Human Needs
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://leadershipindex.lovable.app" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Leadership Index
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <Link 
                    to="/bespoke-meditations" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Bespoke Meditations
                  </Link>
                </div>
              </div>
            )}
          </div>


          {/* Resources Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button 
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors",
                isResourcesActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Resources
              <ChevronDown className={cn("w-4 h-4 transition-transform", resourcesOpen && "rotate-180")} />
            </button>
            
            {resourcesOpen && (
              <div className="absolute top-full left-0 pt-2">
                <div className="bg-background border border-border rounded-lg shadow-lg py-2 min-w-[160px]">
                  <Link 
                    to="/resources" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Free Resources
                  </Link>
                  <Link 
                    to="/blog" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Blog
                  </Link>
                  <Link 
                    to="/podcast" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Podcast
                  </Link>
                  <Link 
                    to="/hellocoach" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    HelloCoach
                  </Link>
                  <Link 
                    to="/leadership-mistakes" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Leadership Checklist
                  </Link>
                  <Link 
                    to="/case-studies" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Case Studies
                  </Link>
                  <Link 
                    to="/book" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    The Book
                  </Link>
                </div>
              </div>
            )}
          </div>

          <NavLink 
            to="/about" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-foreground"
          >
            About
          </NavLink>

          {/* Contact Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setContactOpen(true)}
            onMouseLeave={() => setContactOpen(false)}
          >
            <button 
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors",
                location.pathname === "/contact" || location.pathname === "/marketing" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Contact
              <ChevronDown className={cn("w-4 h-4 transition-transform", contactOpen && "rotate-180")} />
            </button>
            
            {contactOpen && (
              <div className="absolute top-full right-0 pt-2">
                <div className="bg-background border border-border rounded-lg shadow-lg py-2 min-w-[140px]">
                  <Link 
                    to="/contact" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Get in Touch
                  </Link>
                  <Link 
                    to="/marketing" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Admin
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-6 py-4 space-y-4">
            <Link 
              to="/" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Programmes</p>
              <Link 
                to="/leadership-diagnostic" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leadership Diagnostic
              </Link>
              <Link 
                to="/team-diagnostic" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Team Diagnostic
              </Link>
              <Link 
                to="/shift-methodology" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                SHIFT Methodology™
              </Link>
              <Link 
                to="/contagious-identity" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contagious Identity Coaching
              </Link>
              <Link 
                to="/corporate-mind-reset" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Corporate Mind Reset
              </Link>
              <Link 
                to="/programmes" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Programmes
              </Link>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Products</p>
              <Link 
                to="/products" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leadership Tools
              </Link>
              <a 
                href="https://valuesblueprint.online" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Values
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://findmypurpose.me" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Purpose
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://sixhumanneeds.lovable.app" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                6 Human Needs
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://leadershipindex.lovable.app" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leadership Index
                <ExternalLink className="w-3 h-3" />
              </a>
              <Link 
                to="/bespoke-meditations" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bespoke Meditations
              </Link>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resources</p>
              <Link 
                to="/resources" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Free Resources
              </Link>
              <Link 
                to="/blog" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/podcast" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Podcast
              </Link>
              <Link 
                to="/hellocoach" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                HelloCoach
              </Link>
              <Link 
                to="/leadership-mistakes" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leadership Checklist
              </Link>
              <Link 
                to="/case-studies" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Case Studies
              </Link>
              <Link 
                to="/book" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                The Book
              </Link>
            </div>

            <Link 
              to="/about" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</p>
              <Link 
                to="/contact" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get in Touch
              </Link>
              <Link 
                to="/marketing" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

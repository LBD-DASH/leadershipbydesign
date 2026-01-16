import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import ldbLogo from "@/assets/ldb-logo.png";
import { cn } from "@/lib/utils";

const Header = () => {
  const [programmesOpen, setProgrammesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isProgrammesActive = ["/leadership-diagnostic", "/leadership-levels", "/team-diagnostic", "/programmes", "/workshops/alignment", "/workshops/motivation", "/workshops/leadership", "/shift-methodology"].some(
    path => location.pathname.startsWith(path)
  );

  const isResourcesActive = ["/resources", "/blog", "/hellocoach"].some(
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
                    to="/leadership-levels" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Leadership Levels
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
                    to="/hellocoach" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    HelloCoach
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

          <NavLink 
            to="/contact" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-foreground"
          >
            Contact
          </NavLink>
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
                to="/leadership-levels" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leadership Levels
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
                to="/programmes" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Programmes
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
                to="/hellocoach" 
                className="block text-sm text-muted-foreground hover:text-foreground pl-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                HelloCoach
              </Link>
            </div>

            <Link 
              to="/about" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>

            <Link 
              to="/contact" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

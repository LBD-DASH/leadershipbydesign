import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import ldbLogo from "@/assets/ldb-logo.png";
import { cn } from "@/lib/utils";

const Header = () => {
  const [orgsOpen, setOrgsOpen] = useState(false);
  const [diagOpen, setDiagOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setMobileMenuOpen(false);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-primary/98 backdrop-blur shadow-lg"
          : "bg-primary/95 backdrop-blur"
      )}
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={ldbLogo} alt="Leadership by Design" className="h-10 w-auto brightness-0 invert" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <Link
            to="/contagious-identity"
            className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            For Executives
          </Link>

          {/* For Organisations Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOrgsOpen(true)}
            onMouseLeave={() => setOrgsOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              For Organisations
              <ChevronDown className={cn("w-4 h-4 transition-transform", orgsOpen && "rotate-180")} />
            </button>
            {orgsOpen && (
              <div className="absolute top-full left-0 pt-2">
                <div className="bg-card border border-border rounded-lg shadow-xl py-2 min-w-[220px]">
                  <Link to="/programmes" className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setOrgsOpen(false)}>SHIFT Programmes</Link>
                  <Link to="/workshops/alignment" className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setOrgsOpen(false)}>Team Workshops</Link>
                  <Link to="/corporate-mind-reset" className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setOrgsOpen(false)}>Corporate Mind Reset</Link>
                  <Link to="/programmes" className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setOrgsOpen(false)}>Leading in the AI Era</Link>
                  <Link to="/leader-as-coach-programme" className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setOrgsOpen(false)}>Leader as Coach</Link>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/shift-certified"
            className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            Certify Your Team
          </Link>

          {/* Diagnostics Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDiagOpen(true)}
            onMouseLeave={() => setDiagOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Diagnostics
              <ChevronDown className={cn("w-4 h-4 transition-transform", diagOpen && "rotate-180")} />
            </button>
            {diagOpen && (
              <div className="absolute top-full left-0 pt-2">
                <div className="bg-card border border-border rounded-lg shadow-xl py-2 min-w-[200px]">
                  <Link to="/leadership-diagnostic" className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setDiagOpen(false)}>Leadership Diagnostic</Link>
                  <Link to="/team-diagnostic" className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setDiagOpen(false)}>Team Diagnostic</Link>
                  <Link to="/shift-diagnostic" className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setDiagOpen(false)}>AI Readiness</Link>
                  <Link to="/shift-diagnostic" className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setDiagOpen(false)}>SHIFT Diagnostic</Link>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/about"
            className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            About Kevin
          </Link>

          <Link
            to="/contact"
            className="bg-accent text-accent-foreground px-6 py-2.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Work With Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2 text-primary-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto px-6 py-6 space-y-5">
            <Link to="/contagious-identity" className="block text-sm font-medium text-foreground" onClick={close}>For Executives</Link>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">For Organisations</p>
              <Link to="/programmes" className="block text-sm text-muted-foreground hover:text-foreground pl-3" onClick={close}>SHIFT Programmes</Link>
              <Link to="/workshops/alignment" className="block text-sm text-muted-foreground hover:text-foreground pl-3" onClick={close}>Team Workshops</Link>
              <Link to="/corporate-mind-reset" className="block text-sm text-muted-foreground hover:text-foreground pl-3" onClick={close}>Corporate Mind Reset</Link>
              <Link to="/programmes" className="block text-sm text-muted-foreground hover:text-foreground pl-3" onClick={close}>Leading in the AI Era</Link>
              <Link to="/leader-as-coach-programme" className="block text-sm text-muted-foreground hover:text-foreground pl-3" onClick={close}>Leader as Coach</Link>
            </div>

            <Link to="/shift-certified" className="block text-sm font-medium text-foreground" onClick={close}>Certify Your Team</Link>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Diagnostics</p>
              <Link to="/leadership-diagnostic" className="block text-sm text-muted-foreground hover:text-foreground pl-3" onClick={close}>Leadership Diagnostic</Link>
              <Link to="/team-diagnostic" className="block text-sm text-muted-foreground hover:text-foreground pl-3" onClick={close}>Team Diagnostic</Link>
              <Link to="/shift-diagnostic" className="block text-sm text-muted-foreground hover:text-foreground pl-3" onClick={close}>AI Readiness</Link>
              <Link to="/shift-diagnostic" className="block text-sm text-muted-foreground hover:text-foreground pl-3" onClick={close}>SHIFT Diagnostic</Link>
            </div>

            <Link to="/about" className="block text-sm font-medium text-foreground" onClick={close}>About Kevin</Link>

            <Link
              to="/contact"
              className="block text-center bg-accent text-accent-foreground px-6 py-3 rounded text-sm font-semibold"
              onClick={close}
            >
              Work With Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

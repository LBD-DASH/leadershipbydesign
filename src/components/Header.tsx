import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <NavLink to="/" className="text-xl font-semibold text-primary">
          Leadership by Design
        </NavLink>
        
        <div className="hidden md:flex items-center gap-8">
          <NavLink 
            to="/" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-foreground"
          >
            Home
          </NavLink>
          <NavLink 
            to="/programmes" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-foreground"
          >
            Programmes
          </NavLink>
          <NavLink 
            to="/about" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-foreground"
          >
            About
          </NavLink>
          <NavLink 
            to="/hellocoach" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-foreground"
          >
            HelloCoach
          </NavLink>
          <NavLink 
            to="/resources" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-foreground"
          >
            Resources
          </NavLink>
          <NavLink 
            to="/contact" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-foreground"
          >
            Contact
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;

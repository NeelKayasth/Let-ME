import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/letme-logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/", isRoute: true },
    { name: "Make Payment", href: "/make-payment", isRoute: true },
    { name: "Contact Us", href: "/contact", isRoute: true },
    { name: "Bournemouth & Poole", href: "/bournemouth-poole", isRoute: true },
    { name: "Christchurch", href: "/christchurch", isRoute: true },
    { name: "Yeovil", href: "/yeovil", isRoute: true },
    { name: "Weymouth", href: "/weymouth", isRoute: true },
    { name: "Portsmouth", href: "/portsmouth", isRoute: true },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="LetMe" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => 
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-all rounded-lg hover:bg-secondary/50 hover:scale-105"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-all rounded-lg hover:bg-secondary/50 hover:scale-105"
                >
                  {link.name}
                </a>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => 
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

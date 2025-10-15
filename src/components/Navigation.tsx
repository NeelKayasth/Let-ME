import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import logo from "@/assets/letme-logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const areaLinks = [
    { name: "Bournemouth & Poole", href: "/bournemouth-poole" },
    { name: "Christchurch", href: "/christchurch" },
    { name: "Yeovil", href: "/yeovil" },
    { name: "Weymouth", href: "/weymouth" },
    { name: "Portsmouth", href: "/portsmouth" },
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
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-all rounded-lg hover:bg-secondary/50 hover:scale-105"
            >
              Home
            </Link>
            <Link
              to="/make-payment"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-all rounded-lg hover:bg-secondary/50 hover:scale-105"
            >
              Make Payment
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-all rounded-lg hover:bg-secondary/50 hover:scale-105"
            >
              Contact Us
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Properties</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-1 p-2 w-56">
                      {areaLinks.map((area) => (
                        <NavigationMenuLink asChild key={area.name}>
                          <Link
                            to={area.href}
                            className="px-3 py-2 text-sm rounded-md hover:bg-secondary/60"
                          >
                            {area.name}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
            <Link to="/" className="block px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/make-payment" className="block px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>Make Payment</Link>
            <Link to="/contact" className="block px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>Contact Us</Link>
            <div className="px-4 pt-2 text-xs uppercase tracking-wide text-muted-foreground">Properties</div>
            <div className="pl-2">
              {areaLinks.map((area) => (
                <Link key={area.name} to={area.href} className="block px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
                  {area.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

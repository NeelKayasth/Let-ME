import { Link, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/letme-logo.png";

const Footer = () => {
  const navigate = useNavigate();
  const quickLinks = [
    { name: "Home", href: "/", isRoute: true },
    { name: "Bournemouth & Poole", href: "/bournemouth-poole", isRoute: true },
    { name: "Christchurch", href: "/christchurch", isRoute: true },
    { name: "Yeovil", href: "/yeovil", isRoute: true },
    { name: "Weymouth", href: "/weymouth", isRoute: true },
    { name: "Portsmouth", href: "/portsmouth", isRoute: true },
    { name: "Contact", href: "/contact", isRoute: true },
  ];

  const locations = [
    "Bournemouth",
    "Poole",
    "Weymouth",
    "Yeovil",
    "Southampton",
    "Portsmouth",
  ];

  return (
    <footer id="contact" className="bg-foreground text-background pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={logo} alt="LetMe" className="h-12 w-auto invert brightness-0" />
            <p className="text-background/80 leading-relaxed">
              Quality furnished accommodation across Dorset and Hampshire with all bills included.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-background/10 hover:bg-background/20 rounded-lg transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-background/10 hover:bg-background/20 rounded-lg transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-background/10 hover:bg-background/20 rounded-lg transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => {
                      navigate(link.href);
                      // ensure scroll to top
                      requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior }));
                    }}
                    className="text-left text-background/80 hover:text-background transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Locations</h3>
            <ul className="space-y-2">
              {locations.map((location) => (
                <li key={location} className="text-background/80">
                  {location}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@letme.com" className="text-background/80 hover:text-background transition-colors">
                  info@letme.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <a href="tel:01234567890" className="text-background/80 hover:text-background transition-colors">
                  01234 567 890
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-background/80">
                  Dorset & Hampshire, UK
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/20 text-center text-sm text-background/70">
          <p>© {new Date().getFullYear()} LetMe.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

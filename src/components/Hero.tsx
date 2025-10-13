import { Button } from "@/components/ui/button";
import { ArrowRight, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-[hsl(var(--hero-gradient-to))]/90"></div>
      
      {/* Decorative Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
          <div className="inline-block px-4 py-2 bg-primary/25 backdrop-blur-sm rounded-full mb-4">
            <span className="text-foreground font-semibold text-sm">✨ Over 400 Properties Available</span>
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-foreground drop-shadow-2xl">
            Rooms, Studios, and Flats in Dorset and Hampshire
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-foreground/90 max-w-3xl mx-auto leading-relaxed font-medium">
            All utility bills included · Zero deposit with guarantor
          </p>
          
          <p className="text-base md:text-lg text-foreground/75 max-w-2xl mx-auto leading-relaxed">
            Discover quality accommodation across Bournemouth, Poole, Weymouth, Yeovil, Southampton, and Portsmouth
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link to="/rooms">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-7 shadow-large hover:shadow-glow transition-all hover:scale-105 font-semibold"
              >
                Check Availability
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <a href="#newsletter">
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-7 border-2 border-foreground/30 bg-background/15 backdrop-blur-sm text-foreground hover:bg-background/30 hover:border-foreground/50 transition-all font-semibold"
              >
                <Bell className="mr-2 h-5 w-5" />
                Sign up for Newsletter
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1200 120" className="w-full h-20 fill-background drop-shadow-2xl">
          <path d="M0,60 C300,100 900,20 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;

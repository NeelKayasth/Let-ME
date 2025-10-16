import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Home, CreditCard, Mail, Phone, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";

const Index = () => {
  const areas = [
    { name: "Bournemouth & Poole", href: "/bournemouth-poole", description: "Coastal living with beautiful beaches" },
    { name: "Christchurch", href: "/christchurch", description: "Historic town with modern amenities" },
    { name: "Yeovil", href: "/yeovil", description: "Charming town in Somerset" },
    { name: "Weymouth", href: "/weymouth", description: "Seaside resort with stunning views" },
    { name: "Portsmouth", href: "/portsmouth", description: "Historic port city with rich heritage" }
  ];

  const features = [
    "All utility bills included",
    "Zero deposit with guarantor",
    "Fully furnished accommodation",
    "Professional cleaning service",
    "24/7 customer support",
    "Flexible rental terms"
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Bournemouth",
      text: "LetMe made finding accommodation so easy. All bills included and zero deposit - perfect for students!",
      rating: 5
    },
    {
      name: "Mike Chen",
      location: "Portsmouth",
      text: "Great service and beautiful properties. The team was very helpful throughout the process.",
      rating: 5
    },
    {
      name: "Emma Williams",
      location: "Weymouth",
      text: "Love my new place! Everything was ready when I moved in and the location is perfect.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-[hsl(var(--hero-gradient-to))]/90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          
          <div className="container mx-auto px-4 py-10 md:py-28 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-5 md:space-y-8 animate-slide-up">
              <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-primary/25 backdrop-blur-sm rounded-full mb-2 md:mb-4">
                <span className="text-foreground font-semibold text-xs md:text-sm">✨ Over 400 Properties Available</span>
              </div>
              
              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-foreground drop-shadow-2xl line-clamp-2">
                Rooms, Studios, and Flats in Dorset and Hampshire
              </h1>
              
              <p className="text-base md:text-2xl lg:text-3xl text-foreground/90 max-w-3xl mx-auto leading-relaxed font-medium">
                All utility bills included · Zero deposit with guarantor
              </p>
              
              <p className="text-sm md:text-lg text-foreground/75 max-w-2xl mx-auto leading-relaxed line-clamp-2">
                Discover quality accommodation across Bournemouth, Poole, Weymouth, Yeovil, Southampton, and Portsmouth
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pt-4 md:pt-6">
                <Link to="/bournemouth-poole">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="text-base md:text-lg px-5 py-3 md:px-8 md:py-7 shadow-large hover:shadow-glow transition-all hover:scale-105 font-semibold"
                  >
                    Browse Properties
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Link to="/contact">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-base md:text-lg px-5 py-3 md:px-8 md:py-7 border-2 border-foreground/30 bg-background/15 backdrop-blur-sm text-foreground hover:bg-background/30 hover:border-foreground/50 transition-all font-semibold"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative wave removed on mobile to avoid thin white strip */}
        </section>

        {/* Areas Section */}
        <section className="py-10 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="font-heading text-2xl md:text-4xl font-bold mb-2 md:mb-4">Our Locations</h2>
                <p className="text-muted-foreground text-sm md:text-lg">Find your perfect home across the South Coast</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {areas.map((area, index) => (
                  <Link key={index} to={area.href}>
                    <Card className="shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 border-none cursor-pointer">
                      <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-heading text-base md:text-lg font-bold text-foreground">
                              {area.name}
                            </h3>
                            <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
                              {area.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-primary font-medium">
                          <span className="text-xs md:text-sm">View Properties</span>
                          <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-10 md:py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="font-heading text-2xl md:text-4xl font-bold mb-2 md:mb-4">Why Choose LetMe?</h2>
                <p className="text-muted-foreground text-sm md:text-lg">Everything you need for comfortable living</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 md:p-4 bg-card rounded-lg shadow-soft">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                      </div>
                    </div>
                    <p className="text-foreground text-sm md:text-base font-medium">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Property Showcase */}
        <section className="py-10 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="font-heading text-2xl md:text-4xl font-bold mb-2 md:mb-4">Featured Properties</h2>
                <p className="text-muted-foreground text-sm md:text-lg">Take a look at some of our beautiful accommodations</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 border-none">
                  <div className="relative h-40 md:h-64 overflow-hidden">
                    <img
                      src={room1}
                      alt="Modern Double Room"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-accent text-accent-foreground shadow-medium">
                        Available
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                    <h3 className="font-heading text-lg md:text-xl font-bold text-foreground">
                      Modern Double Room
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      Beautifully furnished room with all amenities included
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">From</p>
                        <p className="text-xl md:text-2xl font-bold text-primary">£650/month</p>
                      </div>
                      <Button size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 border-none">
                  <div className="relative h-40 md:h-64 overflow-hidden">
                    <img
                      src={room2}
                      alt="Contemporary Studio"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-accent text-accent-foreground shadow-medium">
                        Available
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                    <h3 className="font-heading text-lg md:text-xl font-bold text-foreground">
                      Contemporary Studio
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      Spacious studio with kitchen and en-suite bathroom
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">From</p>
                        <p className="text-xl md:text-2xl font-bold text-primary">£850/month</p>
                      </div>
                      <Button size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 border-none">
                  <div className="relative h-40 md:h-64 overflow-hidden">
                    <img
                      src={room3}
                      alt="Spacious 2-Bed Flat"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-accent text-accent-foreground shadow-medium">
                        Available
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                    <h3 className="font-heading text-lg md:text-xl font-bold text-foreground">
                      Spacious 2-Bed Flat
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      Perfect for couples or small families
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">From</p>
                        <p className="text-xl md:text-2xl font-bold text-primary">£1,200/month</p>
                      </div>
                      <Button size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">What Our Tenants Say</h2>
                <p className="text-muted-foreground text-lg">Real experiences from our happy residents</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="shadow-medium border-none">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic">
                        "{testimonial.text}"
                      </p>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Card className="shadow-large border-none bg-gradient-to-br from-primary to-[hsl(var(--hero-gradient-to))] text-primary-foreground">
                <CardContent className="p-8 md:p-12 space-y-6">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold">
                    Ready to Find Your New Home?
                  </h2>
                  <p className="text-lg text-primary-foreground/90">
                    Browse our properties and apply today. All bills included, zero deposit with guarantor.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/bournemouth-poole">
                      <Button 
                        size="lg"
                        variant="secondary"
                        className="shadow-medium hover:shadow-large transition-all hover:scale-105"
                      >
                        Browse Properties
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button 
                        size="lg"
                        variant="outline"
                        className="border-primary-foreground/30 bg-background/15 backdrop-blur-sm text-primary-foreground hover:bg-background/30"
                      >
                        Contact Us
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

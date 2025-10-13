import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Check, Star } from "lucide-react";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";

const FlexibleAccommodationPage = () => {
  const flexibleUnits = [
    {
      id: 1,
      image: room1,
      title: "City Center Studio",
      location: "Bournemouth",
      pricePerNight: "£45",
      pricePerWeek: "£280",
      pricePerMonth: "£950",
      minStay: "1 night",
      maxStay: "3 months",
      rating: 4.8,
      features: ["WiFi", "Kitchen", "Bills Included", "Weekly Cleaning"],
    },
    {
      id: 2,
      image: room2,
      title: "Modern Flat",
      location: "Southampton",
      pricePerNight: "£55",
      pricePerWeek: "£350",
      pricePerMonth: "£1,100",
      minStay: "1 night",
      maxStay: "3 months",
      rating: 4.9,
      features: ["WiFi", "Parking", "Bills Included", "Gym Access"],
    },
    {
      id: 3,
      image: room3,
      title: "Coastal Apartment",
      location: "Poole",
      pricePerNight: "£50",
      pricePerWeek: "£320",
      pricePerMonth: "£1,050",
      minStay: "1 night",
      maxStay: "3 months",
      rating: 4.7,
      features: ["WiFi", "Sea View", "Bills Included", "Balcony"],
    },
  ];

  const benefits = [
    "No long-term commitment required",
    "All bills and utilities included",
    "Fully furnished and ready to move in",
    "Flexible booking from 1 night to 3 months",
    "Professional cleaning service",
    "24/7 customer support",
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main>
        {/* Header Section */}
        <section className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Clock className="h-4 w-4" />
                <span className="font-semibold text-sm">Flexible Stays</span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold">
                Stay as Long as You Need
              </h1>
              <p className="text-lg md:text-xl text-accent-foreground/90">
                From 1 night to 3 months - flexible furnished accommodation at competitive rates
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Flexible Accommodation?</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-card rounded-lg shadow-soft">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <p className="text-foreground font-medium">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Available Units */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Available Flexible Units</h2>
              <p className="text-muted-foreground text-lg">Choose your perfect temporary home</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {flexibleUnits.map((unit) => (
                <Card 
                  key={unit.id} 
                  className="overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 border-none"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={unit.image}
                      alt={unit.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-medium">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-semibold text-sm">{unit.rating}</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                        {unit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{unit.location}</p>
                    </div>

                    <div className="space-y-2 py-4 border-y border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Per Night</span>
                        <span className="font-bold text-primary">{unit.pricePerNight}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Per Week</span>
                        <span className="font-bold text-primary">{unit.pricePerWeek}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Per Month</span>
                        <span className="font-bold text-primary">{unit.pricePerMonth}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Min: {unit.minStay}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Max: {unit.maxStay}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {unit.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      size="lg"
                      className="w-full shadow-soft hover:shadow-medium transition-all mt-4"
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold">Choose Your Unit</h3>
                  <p className="text-muted-foreground">
                    Browse available properties and select your preferred accommodation
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold">Select Duration</h3>
                  <p className="text-muted-foreground">
                    Choose how long you need to stay - from 1 night to 3 months
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold">Move In</h3>
                  <p className="text-muted-foreground">
                    Complete booking and move into your fully furnished home
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FlexibleAccommodationPage;

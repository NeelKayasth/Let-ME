import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Bed, Wifi, Zap, Home } from "lucide-react";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";

const Rooms = () => {
  const properties = [
    {
      id: 1,
      image: room1,
      title: "Modern Double Room",
      location: "Bournemouth",
      type: "Room",
      price: "£650",
      beds: 1,
      capacity: 1,
      available: true,
      features: ["All Bills Included", "WiFi", "Fully Furnished"],
    },
    {
      id: 2,
      image: room2,
      title: "Contemporary Studio",
      location: "Southampton",
      type: "Studio",
      price: "£850",
      beds: 1,
      capacity: 1,
      available: true,
      features: ["All Bills Included", "WiFi", "Kitchen", "En-suite"],
    },
    {
      id: 3,
      image: room3,
      title: "Spacious 2-Bed Flat",
      location: "Poole",
      type: "Flat",
      price: "£1,200",
      beds: 2,
      capacity: 2,
      available: true,
      features: ["All Bills Included", "WiFi", "Living Room", "Parking"],
    },
    {
      id: 4,
      image: room1,
      title: "Single Room with Ensuite",
      location: "Weymouth",
      type: "Room",
      price: "£550",
      beds: 1,
      capacity: 1,
      available: false,
      features: ["All Bills Included", "WiFi", "En-suite"],
    },
    {
      id: 5,
      image: room2,
      title: "Deluxe Studio Apartment",
      location: "Portsmouth",
      type: "Studio",
      price: "£900",
      beds: 1,
      capacity: 1,
      available: true,
      features: ["All Bills Included", "WiFi", "Kitchen", "Balcony"],
    },
    {
      id: 6,
      image: room3,
      title: "3-Bed House Share",
      location: "Yeovil",
      type: "Flat",
      price: "£1,500",
      beds: 3,
      capacity: 3,
      available: true,
      features: ["All Bills Included", "WiFi", "Garden", "Parking"],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main>
        {/* Header Section */}
        <section className="bg-gradient-to-br from-primary to-[hsl(var(--hero-gradient-to))] text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4 animate-fade-in">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold">
                Available Rooms & Properties
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90">
                Browse our collection of quality furnished accommodation with all bills included
              </p>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {properties.map((property) => (
                <Card 
                  key={property.id} 
                  className="overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 border-none"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      {property.available ? (
                        <Badge className="bg-accent text-accent-foreground shadow-medium">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="shadow-medium">
                          Reserved
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="secondary" className="shadow-medium">
                        {property.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-muted-foreground gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.beds} bed{property.beds > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{property.capacity} person{property.capacity > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {property.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground">Per month</p>
                        <p className="text-2xl font-bold text-primary">{property.price}</p>
                      </div>
                      <Button 
                        size="lg"
                        disabled={!property.available}
                        className="shadow-soft hover:shadow-medium transition-all"
                      >
                        {property.available ? 'Book Now' : 'Reserved'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <Card className="max-w-2xl mx-auto bg-gradient-to-br from-secondary/50 to-secondary/30 border-none shadow-medium">
                <CardContent className="p-8 space-y-4">
                  <Home className="h-12 w-12 mx-auto text-primary" />
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    Can't find what you're looking for?
                  </h3>
                  <p className="text-muted-foreground">
                    Contact us and we'll help you find the perfect accommodation
                  </p>
                  <a href="#contact">
                    <Button size="lg" className="mt-2">
                      Contact Us
                    </Button>
                  </a>
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

export default Rooms;

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase, Property } from "@/lib/supabase";
import { getImageUrl } from "@/lib/imageUtils";

const PortsmouthPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('Properties')
          .select(`
            *,
            areas:AreaID (AreaName),
            addresses:AddressID (Address)
          `)
          .eq('AreaID', 5); // Portsmouth area ID

        if (error) {
          console.error('Error fetching properties:', error);
        } else {
          setProperties(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main>
        {/* Header Section */}
        <section className="bg-gradient-to-br from-primary to-[hsl(var(--hero-gradient-to))] text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4 animate-fade-in">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold">
                Portsmouth
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90">
                Discover our properties in the historic port city of Portsmouth
              </p>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading properties...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-12">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                    Available Properties
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {properties.length} properties available in Portsmouth
                  </p>
                </div>

                {properties.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {properties.map((property) => (
                      <Card 
                        key={property.PropertyID} 
                        className="overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 border-none"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={getImageUrl(property.image_url, 'property')}
                            alt={property.Properties || 'Property'}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            onError={(e) => {
                              // Fallback to default image if the current one fails to load
                              e.currentTarget.src = getImageUrl(null, 'property');
                            }}
                          />
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-accent text-accent-foreground shadow-medium">
                              Available
                            </Badge>
                          </div>
                        </div>
                        
                        <CardContent className="p-6 space-y-4">
                          <div>
                            <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                              {property.Properties || `Property ${property.PropertyID}`}
                            </h3>
                            <div className="flex items-center text-muted-foreground gap-1">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">{property.addresses?.Address}</span>
                            </div>
                          </div>

                          {property.Description && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {property.Description}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div>
                              <p className="text-sm text-muted-foreground">Properties in this building</p>
                              <p className="text-lg font-bold text-primary">Multiple Units</p>
                            </div>
                            <Link to={`/property/${property.PropertyID}`}>
                              <Button 
                                size="lg"
                                className="shadow-soft hover:shadow-medium transition-all"
                              >
                                View Units
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Properties Available</h3>
                    <p className="text-muted-foreground">
                      We're working on adding more properties in this area. Check back soon!
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <Card className="max-w-2xl mx-auto bg-gradient-to-br from-secondary/50 to-secondary/30 border-none shadow-medium">
                <CardContent className="p-8 space-y-4">
                  <Home className="h-12 w-12 mx-auto text-primary" />
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    Can't find what you're looking for?
                  </h3>
                  <p className="text-muted-foreground">
                    Contact us and we'll help you find the perfect accommodation in Portsmouth
                  </p>
                  <Link to="/contact">
                    <Button size="lg" className="mt-2">
                      Contact Us
                    </Button>
                  </Link>
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

export default PortsmouthPage;

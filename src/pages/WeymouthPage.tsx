import Navigation from "@/components/Navigation";
import MobileBackBar from "@/components/MobileBackBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase, Property, Unit } from "@/lib/supabase";
import { getImageUrl } from "@/lib/imageUtils";

const WeymouthPage = () => {
  const [properties, setProperties] = useState<(Property & { units?: Unit[]; availableCount?: number; minPrice?: number; maxPrice?: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('Properties')
          .select(`
            *,
            areas:AreaID (AreaName),
            addresses:AddressID (Address),
            units:Units (*)
          `)
          .eq('AreaID', 4); // Weymouth area ID

        if (error) {
          console.error('Error fetching properties:', error);
        } else {
          const computed = (data || []).map((p: any) => {
            const units: Unit[] = (p.units || []) as Unit[];
            const availableUnits = units.filter(u => u.Available);
            const availableCount = availableUnits.length;
            const prices = availableUnits.map(u => u.MonthlyPrice);
            const minPrice = prices.length ? Math.min(...prices) : undefined;
            const maxPrice = prices.length ? Math.max(...prices) : undefined;
            return { ...p, units, availableCount, minPrice, maxPrice };
          }).sort((a: any, b: any) => {
            const aCount = a.availableCount || 0;
            const bCount = b.availableCount || 0;
            if (bCount !== aCount) return bCount - aCount;
            const aMin = a.minPrice ?? Number.POSITIVE_INFINITY;
            const bMin = b.minPrice ?? Number.POSITIVE_INFINITY;
            if (aMin !== bMin) return aMin - bMin;
            return (a.Properties || '').localeCompare(b.Properties || '');
          });
          setProperties(computed);
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
      <MobileBackBar />
      
      <main>
        {/* Header Section */}
        <section className="bg-gradient-to-br from-primary to-[hsl(var(--hero-gradient-to))] text-primary-foreground py-10 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4 animate-fade-in">
              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold">
                Weymouth
              </h1>
              <p className="text-sm md:text-xl text-primary-foreground/90">
                Explore our properties in the beautiful seaside town of Weymouth
              </p>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-10 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading properties...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8 md:mb-12">
                  <h2 className="font-heading text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                    Available Properties
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-lg">
                    {properties.length} properties available in Weymouth
                  </p>
                </div>

                {properties.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {properties.map((property) => (
                      <Card 
                        key={property.PropertyID} 
                        className="overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 border-none"
                      >
                        <div className="relative h-40 md:h-64 overflow-hidden">
                          <img
                            src={getImageUrl(property.image_url, 'property')}
                            alt={property.Properties || 'Property'}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            onError={(e) => {
                              // Fallback to default image if the current one fails to load
                              e.currentTarget.src = getImageUrl(null, 'property');
                            }}
                          />
                          {(property.availableCount || 0) > 0 && (
                            <div className="absolute top-4 right-4">
                              <Badge className="bg-accent text-accent-foreground shadow-medium">
                                {property.availableCount} Available
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                          <div>
                            <h3 className="font-heading text-lg md:text-xl font-bold text-foreground mb-1 md:mb-2">
                              {property.Properties || `Property ${property.PropertyID}`}
                            </h3>
                            <div className="flex items-center text-muted-foreground gap-1">
                              <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                              <span className="text-xs md:text-sm line-clamp-1">{property.addresses?.Address}</span>
                            </div>
                          </div>

                          {property.Description && (
                            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 md:line-clamp-3">
                              {property.Description}
                            </p>
                          )}

                          <div className="pt-4 border-t border-border space-y-3">
                            {property.availableCount && property.availableCount > 0 ? (
                              <>
                                <p className="text-base md:text-lg font-bold text-foreground">
                                  {property.minPrice === property.maxPrice || property.maxPrice === undefined
                                    ? `£${property.minPrice} pcm`
                                    : `£${property.minPrice} - £${property.maxPrice} pcm`}
                                </p>
                                <Link to={`/property/${property.PropertyID}`} className="block">
                                  <Button 
                                    size="sm"
                                    className="w-full bg-[#F2B41E] hover:bg-[#E0A61A] text-black font-semibold"
                                  >
                                    {`View ${property.availableCount} available units in this building`}
                                  </Button>
                                </Link>
                              </>
                            ) : (
                              <p className="text-xs md:text-sm text-muted-foreground">No units available</p>
                            )}
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
                    Contact us and we'll help you find the perfect accommodation in Weymouth
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

export default WeymouthPage;

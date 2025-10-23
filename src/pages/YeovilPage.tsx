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

const YeovilPage = () => {
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
          .eq('AreaID', 3); // Yeovil area ID

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
        {/* Desktop hero; hidden on mobile for compact layout */}
        <section className="hidden md:block bg-gradient-to-br from-primary to-[hsl(var(--hero-gradient-to))] text-primary-foreground py-10 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4 animate-fade-in">
              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold">Yeovil</h1>
              <p className="text-sm md:text-xl text-primary-foreground/90">Discover our properties in the charming town of Yeovil</p>
            </div>
          </div>
        </section>

        {/* Mobile breadcrumb bar */}
        <div className="md:hidden border-y border-black bg-black sticky top-[64px] z-30">
          <div className="container mx-auto px-4 py-2 text-sm text-white">
            <Link to="/" className="underline text-white">To Let</Link>
            <span className="mx-1 opacity-80">/</span>
            <span className="font-medium">Yeovil</span>
          </div>
        </div>

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
                    {properties.length} properties available in Yeovil
                  </p>
                </div>

                {properties.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {properties.map((property) => (
                      <Link key={property.PropertyID} to={`/property/${property.PropertyID}`} className="block">
                        <Card className="overflow-hidden shadow-medium border-none hover-outline cursor-pointer">
                          <div className="p-4 md:hidden">
                            <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                              {property.Properties || `Property ${property.PropertyID}`}
                            </h3>
                            <div className="flex items-center text-muted-foreground gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="text-xs line-clamp-1">{property.addresses?.Address}</span>
                            </div>
                          </div>

                          <div className="relative h-40 md:h-64 overflow-hidden">
                            {/* Primary Image */}
                            <img
                              src={getImageUrl(property.image_url, 'property')}
                              alt={property.Properties || 'Property'}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = getImageUrl(null, 'property'); }}
                            />
                            
                            {/* Additional Images Overlay */}
                            {property.Images && JSON.parse(property.Images).length > 0 && (
                              <div className="absolute bottom-2 right-2 flex gap-1">
                                {JSON.parse(property.Images).slice(0, 3).map((image: string, index: number) => (
                                  <div key={index} className="w-8 h-8 rounded border border-white overflow-hidden">
                                    <img
                                      src={image}
                                      alt={`Additional ${index + 1}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => { e.currentTarget.src = getImageUrl(null, 'property'); }}
                                    />
                                  </div>
                                ))}
                                {JSON.parse(property.Images).length > 3 && (
                                  <div className="w-8 h-8 rounded border border-white bg-black bg-opacity-50 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">+{JSON.parse(property.Images).length - 3}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {(property.availableCount || 0) > 0 && (
                              <div className="hidden md:block absolute top-4 right-4">
                                <Badge className="bg-accent text-accent-foreground shadow-medium">
                                  {property.availableCount} Available
                                </Badge>
                              </div>
                            )}
                          </div>

                          <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                            <div className="hidden md:block">
                              <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                                {property.Properties || `Property ${property.PropertyID}`}
                              </h3>
                              <div className="flex items-center text-muted-foreground gap-1">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm line-clamp-1">{property.addresses?.Address}</span>
                              </div>
                            </div>

                            {property.Description && (
                              <p className="text-xs md:text-sm text-muted-foreground md:line-clamp-3">
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
                                  <Button size="sm" className="w-full bg-[#F2B41E] hover:bg-[#E0A61A] text-black font-semibold">
                                    {`View ${property.availableCount} available units in this building`}
                                  </Button>
                                </>
                              ) : (
                                <p className="text-xs md:text-sm text-muted-foreground">No units available</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
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
                    Contact us and we'll help you find the perfect accommodation in Yeovil
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

export default YeovilPage;

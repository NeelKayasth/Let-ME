import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Bed, Wifi, Zap, Home, ArrowRight, Calendar, PoundSterling } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase, Property, Unit } from "@/lib/supabase";
import { getImageUrl } from "@/lib/imageUtils";

const PropertyPage = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!propertyId) return;

      try {
        // Fetch property details
        const { data: propertyData, error: propertyError } = await supabase
          .from('Properties')
          .select(`
            *,
            areas:AreaID (AreaName),
            addresses:AddressID (Address)
          `)
          .eq('PropertyID', propertyId)
          .single();

        if (propertyError) {
          console.error('Error fetching property:', propertyError);
        } else {
          setProperty(propertyData);
        }

        // Fetch units for this property
        const { data: unitsData, error: unitsError } = await supabase
          .from('Units')
          .select('*')
          .eq('PropertyID', propertyId)
          .eq('Available', true);

        if (unitsError) {
          console.error('Error fetching units:', unitsError);
        } else {
          setUnits(unitsData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading property details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Property Not Found</h2>
            <p className="text-muted-foreground">The property you're looking for doesn't exist.</p>
            <Link to="/" className="mt-4 inline-block">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main>
        {/* Property Header */}
        <section className="bg-gradient-to-br from-primary to-[hsl(var(--hero-gradient-to))] text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <MapPin className="h-4 w-4" />
                <span className="font-semibold text-sm">{property.areas?.AreaName}</span>
              </div>
              
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold">
                {property.Properties || `Property ${property.PropertyID}`}
              </h1>
              
              <div className="flex items-center gap-4 text-primary-foreground/90">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{property.addresses?.Address}</span>
                </div>
                {property.PlusCode && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      {property.PlusCode}
                    </span>
                  </div>
                )}
              </div>

              {property.Description && (
                <p className="text-lg text-primary-foreground/90 max-w-3xl">
                  {property.Description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Property Images */}
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Primary Image */}
                <div className="relative h-64 overflow-hidden rounded-lg shadow-medium">
                  <img
                    src={getImageUrl(property.image_url, 'property')}
                    alt={`${property.Properties} - Main Image`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = getImageUrl(null, 'property');
                    }}
                  />
                </div>
                
                {/* Additional Images from JSON array */}
                {property.Images && JSON.parse(property.Images).map((image: string, index: number) => (
                  <div key={index} className="relative h-64 overflow-hidden rounded-lg shadow-medium">
                    <img
                      src={image}
                      alt={`${property.Properties} - Image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = getImageUrl(null, 'property');
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Available Units */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                  Available Units
                </h2>
                <p className="text-muted-foreground text-lg">
                  {units.length} units available in this property
                </p>
              </div>

              {units.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {units.map((unit) => (
                    <Card 
                      key={unit.UnitID} 
                      className="overflow-hidden shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 border-none"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={getImageUrl(unit.image_url, 'unit')}
                          alt={unit.UnitName}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = getImageUrl(null, 'unit');
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
                            {unit.UnitName}
                          </h3>
                          {unit.Description && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {unit.Description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly rent</p>
                            <p className="text-2xl font-bold text-primary">
                              £{unit.MonthlyPrice.toLocaleString()}
                            </p>
                          </div>
                          <Link to={`/apply/${unit.UnitID}`}>
                            <Button 
                              size="lg"
                              className="shadow-soft hover:shadow-medium transition-all"
                            >
                              Apply Now
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
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Units Available</h3>
                  <p className="text-muted-foreground">
                    All units in this property are currently occupied. Check back soon for availability.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Property Features */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
                Property Features
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center shadow-medium border-none">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Wifi className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      WiFi Included
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      High-speed internet included in rent
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center shadow-medium border-none">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      All Bills Included
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Utilities, council tax, and more
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center shadow-medium border-none">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Home className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      Fully Furnished
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Ready to move in immediately
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center shadow-medium border-none">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <PoundSterling className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      Zero Deposit
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      With guarantor option available
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyPage;

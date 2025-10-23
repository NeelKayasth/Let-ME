import Navigation from "@/components/Navigation";
import MobileBackBar from "@/components/MobileBackBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Bed, Wifi, Zap, Home, ArrowRight, Calendar, PoundSterling, CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase, Unit, Property } from "@/lib/supabase";
import { getImageUrl } from "@/lib/imageUtils";

const UnitPage = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnitData = async () => {
      if (!unitId) return;

      try {
        // Fetch unit details with property information
        const { data: unitData, error: unitError } = await supabase
          .from('Units')
          .select(`
            *,
            properties:PropertyID (
              *,
              areas:AreaID (AreaName),
              addresses:AddressID (Address)
            )
          `)
          .eq('UnitID', unitId)
          .single();

        if (unitError) {
          console.error('Error fetching unit:', unitError);
        } else {
          setUnit(unitData);
          setProperty(unitData.properties);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnitData();
  }, [unitId]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading unit details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!unit || !property) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Unit Not Found</h2>
            <p className="text-muted-foreground">The unit you're looking for doesn't exist.</p>
            <Link to="/" className="mt-4 inline-block">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const features = [
    "All Bills Included",
    "WiFi",
    "Fully Furnished",
    "Zero Deposit with Guarantor",
    "Professional Cleaning",
    "24/7 Support"
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <MobileBackBar />
      {/* Mobile back bar */}
      {/* import-less usage since component is local */}
      
      <main>
        {/* Unit Header - hide on mobile, show on desktop */}
        <section className="hidden md:block bg-gradient-to-br from-primary to-[hsl(var(--hero-gradient-to))] text-primary-foreground py-10 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <MapPin className="h-4 w-4" />
                <span className="font-semibold text-sm">{property.areas?.AreaName}</span>
              </div>
              
              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold">
                {unit.UnitName}
              </h1>
              
              <div className="flex items-center gap-4 text-primary-foreground/90 flex-wrap">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{property.addresses?.Address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">£{unit.MonthlyPrice.toLocaleString()}</span>
                  <span className="text-sm">/month</span>
                </div>
                <a
                  href={property.PlusCode && property.PlusCode.startsWith('http')
                    ? property.PlusCode
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.addresses?.Address || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
                >
                  {property.PlusCode && !property.PlusCode.startsWith('http') ? property.PlusCode : 'Open in Google Maps'}
                </a>
              </div>

              {unit.Description && (
                <p className="text-sm md:text-lg text-primary-foreground/90 max-w-3xl line-clamp-3">
                  {unit.Description}
                </p>
              )}

              <div className="flex items-center gap-4">
                {unit.Available ? (
                  <Badge className="bg-accent text-accent-foreground text-lg px-4 py-2">
                    Available Now
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Currently Occupied
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile breadcrumb bar */}
        <div className="md:hidden border-y border-black bg-black sticky top-[64px] z-30">
          <div className="container mx-auto px-4 py-2 text-sm text-white">
            <Link to="/" className="underline text-white">To Let</Link>
            <span className="mx-1 opacity-80">/</span>
            <span className="font-medium">{property.areas?.AreaName}</span>
            <span className="mx-1 opacity-80">/</span>
            <span className="font-medium">{unit.UnitName}</span>
          </div>
        </div>

        {/* Unit Images */}
        <section className="py-6 md:py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {/* Primary Image */}
                <div className="relative h-44 md:h-64 overflow-hidden rounded-lg shadow-medium">
                  <img
                    src={getImageUrl(unit.image_url, 'unit')}
                    alt={`${unit.UnitName} - Main Image`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = getImageUrl(null, 'unit');
                    }}
                  />
                </div>
                
                {/* Additional Images from JSON array */}
                {unit.Images && JSON.parse(unit.Images).map((image: string, index: number) => (
                  <div key={index} className="relative h-44 md:h-64 overflow-hidden rounded-lg shadow-medium">
                    <img
                      src={image}
                      alt={`${unit.UnitName} - Image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = getImageUrl(null, 'unit');
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Unit Details */}
        <section className="py-10 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  <Card className="shadow-medium border-none">
                    <CardContent className="p-8">
                      <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                        About This Unit
                      </h2>
                      {unit.Description ? (
                        <p className="text-muted-foreground leading-relaxed">
                          {unit.Description}
                        </p>
                      ) : (
                        <p className="text-muted-foreground leading-relaxed">
                          This beautifully furnished unit offers comfortable living in a prime location. 
                          Perfect for professionals, students, or anyone looking for quality accommodation 
                          with all bills included.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="shadow-medium border-none">
                    <CardContent className="p-8">
                      <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                        What's Included
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-primary" />
                              </div>
                            </div>
                            <span className="text-foreground font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card className="shadow-medium border-none sticky top-20 md:top-24">
                    <CardContent className="p-5 md:p-6">
                      <div className="text-center space-y-4">
                        <div>
                          <p className="text-xs md:text-sm text-muted-foreground">Monthly Rent</p>
                          <p className="text-2xl md:text-3xl font-bold text-primary">
                            £{unit.MonthlyPrice.toLocaleString()}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">All bills included</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Unit Name:</span>
                            <span className="font-medium">{unit.UnitName}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Property:</span>
                            <span className="font-medium">{property.Properties || `Property ${property.PropertyID}`}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{property.areas?.AreaName}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium">
                              {unit.Available ? 'Available' : 'Occupied'}
                            </span>
                          </div>
                        </div>

                        {unit.Available ? (
                          <Link to={`/apply/${unit.UnitID}`} className="block">
                            <Button 
                              size="sm"
                              className="w-full shadow-soft hover:shadow-medium transition-all"
                            >
                              Apply Now
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        ) : (
                          <Button 
                            size="sm"
                            variant="outline"
                            className="w-full"
                            disabled
                          >
                            Currently Occupied
                          </Button>
                        )}

                        <p className="text-xs text-muted-foreground text-center">
                          Zero deposit with guarantor option available
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-medium border-none">
                    <CardContent className="p-6">
                      <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                        Property Information
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <span className="text-muted-foreground">{property.addresses?.Address}</span>
                        </div>
                        {property.PlusCode && (
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">Plus Code:</span>
                            <span className="font-mono text-xs bg-secondary px-2 py-1 rounded">
                              {property.PlusCode}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
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

export default UnitPage;

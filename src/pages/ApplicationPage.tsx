import Navigation from "@/components/Navigation";
import MobileBackBar from "@/components/MobileBackBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Home, ArrowRight, CheckCircle, User, Mail, Phone, Calendar, MapPin as MapPinIcon, Briefcase, DollarSign } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase, Unit, Property } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const ApplicationPage = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    currentAddress: '',
    employmentStatus: '',
    monthlyIncome: ''
  });

  useEffect(() => {
    const fetchUnitData = async () => {
      if (!unitId) return;

      try {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Insert application into database
      const { error } = await supabase
        .from('applications')
        .insert({
          property_name: property?.Properties || `Property ${property?.PropertyID}`,
          unit_name: unit?.UnitName || '',
          applicant_name: formData.applicantName,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          current_address: formData.currentAddress,
          employment_status: formData.employmentStatus,
          monthly_income: parseFloat(formData.monthlyIncome)
        });

      if (error) {
        throw error;
      }

      // Send email notification via Netlify serverless function
      try {
        const response = await fetch('/.netlify/functions/send-application-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyName: property?.Properties || `Property ${property?.PropertyID}`,
            unitName: unit?.UnitName,
            areaName: property?.areas?.AreaName,
            address: property?.addresses?.Address,
            monthlyPrice: unit?.MonthlyPrice,
            applicantName: formData.applicantName,
            email: formData.email,
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth,
            currentAddress: formData.currentAddress,
            employmentStatus: formData.employmentStatus,
            monthlyIncome: formData.monthlyIncome,
          }),
        });
        if (!response.ok) {
          console.error('Email send failed');
        }
      } catch (err) {
        console.error('Email send error:', err);
      }

      toast({
        title: "Application Submitted Successfully",
        description: "Thank you for your application. We'll be in touch soon!",
      });

      // Reset form
      setFormData({
        applicantName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        currentAddress: '',
        employmentStatus: '',
        monthlyIncome: ''
      });

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading application form...</p>
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
            <p className="text-muted-foreground">The unit you're trying to apply for doesn't exist.</p>
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
      <MobileBackBar />
      
      <main>
        {/* Header Section */}
        <section className="bg-gradient-to-br from-primary to-[hsl(var(--hero-gradient-to))] text-primary-foreground py-10 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <CheckCircle className="h-4 w-4" />
                <span className="font-semibold text-sm">Application Form</span>
              </div>
              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold">
                Check Whether You Qualify
              </h1>
              <p className="text-sm md:text-xl text-primary-foreground/90">
                Apply for {unit.UnitName} at {property.Properties || `Property ${property.PropertyID}`}
              </p>
            </div>
          </div>
        </section>

        {/* Unit Summary */}
        <section className="py-6 md:py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-medium border-none">
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h2 className="font-heading text-lg md:text-xl font-bold text-foreground">
                        {unit.UnitName}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{property.addresses?.Address}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{property.areas?.AreaName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs md:text-sm text-muted-foreground">Monthly Rent</p>
                      <p className="text-xl md:text-2xl font-bold text-primary">
                        £{unit.MonthlyPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-10 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-large border-none">
                <CardContent className="p-6 md:p-10">
                  <div className="text-center mb-6 md:mb-8">
                    <h2 className="font-heading text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                      Application to Rent
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-lg">
                      Please fill out all the information below to apply for this unit
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="font-heading text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="applicantName">Full Name *</Label>
                          <Input
                            id="applicantName"
                            type="text"
                            value={formData.applicantName}
                            onChange={(e) => handleInputChange('applicantName', e.target.value)}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="Your phone number"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currentAddress">Current Address *</Label>
                        <Textarea
                          id="currentAddress"
                          value={formData.currentAddress}
                          onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                          placeholder="Your current address including postcode"
                          rows={3}
                          required
                        />
                      </div>
                    </div>

                    {/* Employment Information */}
                    <div className="space-y-4">
                      <h3 className="font-heading text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Employment Information
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="employmentStatus">Employment Status *</Label>
                          <Select
                            value={formData.employmentStatus}
                            onValueChange={(value) => handleInputChange('employmentStatus', value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select employment status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="employed">Employed</SelectItem>
                              <SelectItem value="self-employed">Self-Employed</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="unemployed">Unemployed</SelectItem>
                              <SelectItem value="retired">Retired</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="monthlyIncome">Monthly Income (£) *</Label>
                          <Input
                            id="monthlyIncome"
                            type="number"
                            value={formData.monthlyIncome}
                            onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                            placeholder="0"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-4">
                      <Card className="bg-secondary/30 border-none">
                        <CardContent className="p-5 md:p-6">
                          <h4 className="font-heading text-lg font-bold text-foreground mb-3">
                            Important Information
                          </h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• All applications are subject to reference checks</li>
                            <li>• A guarantor may be required for some applications</li>
                            <li>• Zero deposit option available with guarantor</li>
                            <li>• You will receive a confirmation email after submission</li>
                            <li>• We aim to respond to applications within 48 hours</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center pt-6">
                      <Button 
                        type="submit"
                        size="lg"
                        disabled={submitting}
                        className="shadow-soft hover:shadow-medium transition-all"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting Application...
                          </>
                        ) : (
                          <>
                            Submit Application
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
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

export default ApplicationPage;

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "info@letme.com",
      description: "Send us an email anytime",
      action: "mailto:info@letme.com"
    },
    {
      icon: Phone,
      title: "Phone",
      details: "01234 567 890",
      description: "Call us during business hours",
      action: "tel:01234567890"
    },
    {
      icon: MapPin,
      title: "Address",
      details: "Dorset & Hampshire, UK",
      description: "Serving the South Coast",
      action: null
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon-Fri: 9AM-6PM",
      description: "Saturday: 10AM-4PM",
      action: null
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main>
        {/* Header Section */}
        <section className="bg-gradient-to-br from-primary to-[hsl(var(--hero-gradient-to))] text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <MessageSquare className="h-4 w-4" />
                <span className="font-semibold text-sm">Get in Touch</span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold">
                Contact Us
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90">
                We're here to help you find your perfect accommodation
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
                <p className="text-muted-foreground text-lg">Choose your preferred way to contact us</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="text-center shadow-medium hover:shadow-large transition-all hover:scale-105 border-none">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <info.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-foreground">
                        {info.title}
                      </h3>
                      <div className="space-y-2">
                        <p className="font-semibold text-foreground">{info.details}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                      {info.action && (
                        <a href={info.action}>
                          <Button variant="outline" size="sm" className="w-full">
                            Contact
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-large border-none">
                <CardContent className="p-8 md:p-12">
                  <div className="text-center mb-8">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Send us a Message</h2>
                    <p className="text-muted-foreground text-lg">
                      Have a question about our properties? We'd love to hear from you.
                    </p>
                  </div>

                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-foreground">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium text-foreground">
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="property">Property Information</option>
                          <option value="booking">Booking Inquiry</option>
                          <option value="support">Support</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-foreground">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <div className="text-center">
                      <Button size="lg" className="shadow-soft hover:shadow-medium transition-all">
                        Send Message
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-muted-foreground text-lg">Quick answers to common questions</p>
              </div>

              <div className="space-y-6">
                <Card className="shadow-medium border-none">
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      What areas do you cover?
                    </h3>
                    <p className="text-muted-foreground">
                      We provide accommodation in Bournemouth & Poole, Christchurch, Yeovil, Weymouth, and Portsmouth.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-medium border-none">
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      Are all bills included?
                    </h3>
                    <p className="text-muted-foreground">
                      Yes, all our properties include utility bills, WiFi, and council tax in the monthly rent.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-medium border-none">
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      Do you require a deposit?
                    </h3>
                    <p className="text-muted-foreground">
                      We offer zero deposit options with a guarantor, making it easier to move in.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-medium border-none">
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      How do I apply for a property?
                    </h3>
                    <p className="text-muted-foreground">
                      Simply browse our properties, find one you like, and click "Apply Now" to start your application.
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

export default ContactPage;

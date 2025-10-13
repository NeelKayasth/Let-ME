import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Download, CreditCard, Calendar, FileText, CheckCircle } from "lucide-react";

const MakePaymentPage = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Easy Payments",
      description: "Pay your rent securely with multiple payment methods",
    },
    {
      icon: Calendar,
      title: "Payment Schedule",
      description: "View upcoming payments and payment history",
    },
    {
      icon: FileText,
      title: "Digital Statements",
      description: "Access your rent statements anytime, anywhere",
    },
    {
      icon: CheckCircle,
      title: "Instant Confirmation",
      description: "Get immediate confirmation for all transactions",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Download the CoHo App",
      description: "Available on iOS and Android devices",
    },
    {
      number: "2",
      title: "Log In with Your Details",
      description: "Use your property information to sign in",
    },
    {
      number: "3",
      title: "View Your Statement",
      description: "Check your balance and payment history",
    },
    {
      number: "4",
      title: "Make a Payment",
      description: "Pay directly to our bank account securely",
    },
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
                <Smartphone className="h-4 w-4" />
                <span className="font-semibold text-sm">For Current Tenants</span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold">
                Pay Your Rent Online
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90">
                Quick, secure, and convenient rent payments through the CoHo app
              </p>
            </div>
          </div>
        </section>

        {/* Main App Download Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Card className="shadow-large border-none bg-gradient-to-br from-card to-secondary/30 overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                        Download the CoHo App
                      </h2>
                      
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        If you are an existing LetMe tenant, download the CoHo app to manage your rent payments, 
                        view statements, and make secure payments directly to our bank account.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button 
                          size="lg"
                          className="shadow-soft hover:shadow-medium transition-all hover:scale-105"
                        >
                          <Download className="mr-2 h-5 w-5" />
                          App Store
                        </Button>
                        
                        <Button 
                          variant="outline"
                          size="lg"
                          className="shadow-soft hover:shadow-medium transition-all hover:scale-105"
                        >
                          <Download className="mr-2 h-5 w-5" />
                          Google Play
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                        <div className="relative bg-gradient-to-br from-primary to-accent p-12 rounded-3xl shadow-large">
                          <Smartphone className="h-40 w-40 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">App Features</h2>
                <p className="text-muted-foreground text-lg">Everything you need to manage your rent payments</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="text-center shadow-medium hover:shadow-large transition-all hover:scale-105 border-none">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <feature.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">How to Pay Your Rent</h2>
                <p className="text-muted-foreground text-lg">Follow these simple steps to make your payment</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, index) => (
                  <div key={index} className="relative">
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-primary/30"></div>
                    )}
                    <Card className="shadow-medium hover:shadow-large transition-all border-none h-full">
                      <CardContent className="p-6 space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-medium">
                          <span className="text-2xl font-bold text-white">{step.number}</span>
                        </div>
                        <h3 className="font-heading text-lg font-bold text-foreground">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-large border-none bg-gradient-to-br from-primary to-[hsl(var(--hero-gradient-to))] text-primary-foreground">
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold">
                    Need Help?
                  </h2>
                  <p className="text-lg text-primary-foreground/90">
                    Our support team is here to assist you with any questions about rent payments
                  </p>
                  <a href="#contact">
                    <Button 
                      size="lg"
                      variant="secondary"
                      className="shadow-medium hover:shadow-large transition-all hover:scale-105"
                    >
                      Contact Support
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

export default MakePaymentPage;

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Download } from "lucide-react";
import { Link } from "react-router-dom";

const PayRent = () => {
  return (
    <section id="pay-rent" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-medium border-none bg-gradient-to-br from-card to-secondary/30 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    <Smartphone className="h-4 w-4" />
                    For Tenants
                  </div>
                  
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                    Pay your rent
                  </h2>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    If you are an existing LetMe tenant you can download the CoHo app and log in with your property details 
                    to view your statement and make payments directly to our bank account.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link to="/pay-rent">
                      <Button 
                        size="lg"
                        className="shadow-soft hover:shadow-medium transition-all hover:scale-105"
                      >
                        <Smartphone className="mr-2 h-5 w-5" />
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                    <div className="relative bg-gradient-to-br from-primary to-accent p-8 rounded-3xl shadow-large">
                      <Smartphone className="h-32 w-32 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PayRent;

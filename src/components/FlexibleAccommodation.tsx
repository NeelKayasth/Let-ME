import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Home, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const FlexibleAccommodation = () => {
  return (
    <section id="flexible" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-medium border-none bg-card overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Flexible Stays
                  </div>
                  
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                    Flexible furnished accommodation from 1 night to 3 month stays
                  </h2>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Some of our units are available daily or for flexible stays of up to 3 months, at competitive rates. 
                    Perfect for temporary workers, students, or anyone needing short-term accommodation.
                  </p>

                  <Link to="/flexible-accommodation">
                    <Button 
                      size="lg"
                      className="shadow-soft hover:shadow-medium transition-all hover:scale-105"
                    >
                      <Home className="mr-2 h-5 w-5" />
                      View Flexible Units
                    </Button>
                  </Link>
                </div>

                <div className="flex-shrink-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 p-6 rounded-xl text-center space-y-2">
                      <Calendar className="h-8 w-8 text-primary mx-auto" />
                      <div className="text-2xl font-bold text-foreground">1 Night</div>
                      <div className="text-sm text-muted-foreground">Minimum stay</div>
                    </div>
                    <div className="bg-accent/10 p-6 rounded-xl text-center space-y-2">
                      <Clock className="h-8 w-8 text-accent mx-auto" />
                      <div className="text-2xl font-bold text-foreground">3 Months</div>
                      <div className="text-sm text-muted-foreground">Maximum stay</div>
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

export default FlexibleAccommodation;

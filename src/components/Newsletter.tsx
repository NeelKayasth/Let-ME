import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscribed successfully!",
        description: "You'll receive updates about available properties.",
      });
      setEmail("");
    }
  };

  return (
    <section id="newsletter" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-large border-none bg-gradient-to-br from-primary to-[hsl(var(--hero-gradient-to))] text-primary-foreground overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <div className="inline-flex p-4 bg-white/10 rounded-full">
                <Bell className="h-8 w-8" />
              </div>
              
              <div className="space-y-3">
                <h2 className="font-heading text-3xl md:text-4xl font-bold">
                  Stay Updated
                </h2>
                <p className="text-lg text-primary-foreground/90">
                  Subscribe to our newsletter and be the first to know about new properties and special offers.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-background/95 border-none shadow-soft"
                      required
                    />
                  </div>
                  <Button 
                    type="submit"
                    size="lg"
                    variant="secondary"
                    className="h-12 px-8 shadow-medium hover:shadow-large transition-all hover:scale-105"
                  >
                    Notify Me
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

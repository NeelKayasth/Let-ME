import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import MakePaymentPage from "./pages/MakePaymentPage";
import ContactPage from "./pages/ContactPage";
import BournemouthPoolePage from "./pages/BournemouthPoolePage";
import ChristchurchPage from "./pages/ChristchurchPage";
import YeovilPage from "./pages/YeovilPage";
import WeymouthPage from "./pages/WeymouthPage";
import PortsmouthPage from "./pages/PortsmouthPage";
import PropertyPage from "./pages/PropertyPage";
import UnitPage from "./pages/UnitPage";
import ApplicationPage from "./pages/ApplicationPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/make-payment" element={<MakePaymentPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/bournemouth-poole" element={<BournemouthPoolePage />} />
          <Route path="/christchurch" element={<ChristchurchPage />} />
          <Route path="/yeovil" element={<YeovilPage />} />
          <Route path="/weymouth" element={<WeymouthPage />} />
          <Route path="/portsmouth" element={<PortsmouthPage />} />
          <Route path="/property/:propertyId" element={<PropertyPage />} />
          <Route path="/unit/:unitId" element={<UnitPage />} />
          <Route path="/apply/:unitId" element={<ApplicationPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

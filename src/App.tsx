import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";

// Mobile-first pages
import Onboarding from "./pages/mobile/Onboarding";
import Catalog from "./pages/mobile/Catalog";
import Vault from "./pages/mobile/Vault";
import Link from "./pages/mobile/Link";
import Compare from "./pages/mobile/Compare";
import MobileSettings from "./pages/mobile/MobileSettings";

// Legacy pages (kept for compatibility)
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AddSubscription from "./pages/AddSubscription";
import Partners from "./pages/Partners";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="subcircle-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Mobile-first routes */}
              <Route path="/" element={<Catalog />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/vault" element={<Vault />} />
              <Route path="/link" element={<Link />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<MobileSettings />} />
              
              {/* Legacy routes for compatibility */}
              <Route path="/legacy" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/subscriptions/add" element={<AddSubscription />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/legacy-settings" element={<Settings />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
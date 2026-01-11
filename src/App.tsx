import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import AdminAuth from "./pages/AdminAuth";
import NotFound from "./pages/NotFound";

// Auth pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Onboarding from "./pages/auth/Onboarding";

// App pages
import Dashboard from "./pages/app/Dashboard";
import Vehicles from "./pages/app/Vehicles";

// Demo pages (legacy - can be removed later)
import DemoLogin from "./pages/demo/DemoLogin";
import DemoDashboard from "./pages/demo/DemoDashboard";
import DemoCalculator from "./pages/demo/DemoCalculator";
import DemoDeploy from "./pages/demo/DemoDeploy";
import DemoVehicles from "./pages/demo/DemoVehicles";
import DemoHistory from "./pages/demo/DemoHistory";
import DemoReports from "./pages/demo/DemoReports";
import DemoDocuments from "./pages/demo/DemoDocuments";
import DemoActiveTrips from "./pages/demo/DemoActiveTrips";

import "@/lib/storage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-auth" element={<AdminAuth />} />
            
            {/* Auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
            {/* Main App (authenticated) */}
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/vehicles" element={<Vehicles />} />
            
            {/* Demo pages (legacy) */}
            <Route path="/demo" element={<DemoLogin />} />
            <Route path="/demo/dashboard" element={<DemoDashboard />} />
            <Route path="/demo/calculator" element={<DemoCalculator />} />
            <Route path="/demo/deploy" element={<DemoDeploy />} />
            <Route path="/demo/vehicles" element={<DemoVehicles />} />
            <Route path="/demo/active-trips" element={<DemoActiveTrips />} />
            <Route path="/demo/history" element={<DemoHistory />} />
            <Route path="/demo/reports" element={<DemoReports />} />
            <Route path="/demo/documents" element={<DemoDocuments />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

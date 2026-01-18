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
import Trips from "./pages/app/Trips";
import DeployTrip from "./pages/app/DeployTrip";
import Drivers from "./pages/app/Drivers";
import Clients from "./pages/app/Clients";
import FuelCalculator from "./pages/app/FuelCalculator";
import DailyTransactions from "./pages/app/DailyTransactions";
import Invoices from "./pages/app/Invoices";
import Expenses from "./pages/app/Expenses";
import Reports from "./pages/app/Reports";
import TripBookout from "./pages/app/TripBookout";
import Documents from "./pages/app/Documents";
import MaintenanceLog from "./pages/app/MaintenanceLog";
import Inventory from "./pages/app/Inventory";
import Suppliers from "./pages/app/Suppliers";
import Tracking from "./pages/app/Tracking";
import AuditDocumentation from "./pages/app/AuditDocumentation";

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
            <Route path="/app/trips" element={<Trips />} />
            <Route path="/app/deploy" element={<DeployTrip />} />
            <Route path="/app/drivers" element={<Drivers />} />
            <Route path="/app/clients" element={<Clients />} />
            <Route path="/app/calculator" element={<FuelCalculator />} />
            <Route path="/app/transactions" element={<DailyTransactions />} />
            <Route path="/app/invoices" element={<Invoices />} />
            <Route path="/app/expenses" element={<Expenses />} />
            <Route path="/app/reports" element={<Reports />} />
            <Route path="/app/bookout" element={<TripBookout />} />
            <Route path="/app/bookout/:tripId" element={<TripBookout />} />
            <Route path="/app/documents" element={<Documents />} />
            <Route path="/app/maintenance" element={<MaintenanceLog />} />
            <Route path="/app/inventory" element={<Inventory />} />
            <Route path="/app/suppliers" element={<Suppliers />} />
            <Route path="/app/tracking" element={<Tracking />} />
            <Route path="/app/audit" element={<AuditDocumentation />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import Operations from "./pages/app/Operations";
import Fleet from "./pages/app/Fleet";
import FuelModule from "./pages/app/Fuel";
import Workshop from "./pages/app/Workshop";
import Inventory from "./pages/app/Inventory";
import Accounts from "./pages/app/Accounts";
import HR from "./pages/app/HR";
import Reports from "./pages/app/Reports";
import SettingsModule from "./pages/app/Settings";
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
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="operations" element={<Operations />} />
              <Route path="fleet" element={<Fleet />} />
              <Route path="fuel" element={<FuelModule />} />
              <Route path="workshop" element={<Workshop />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="hr" element={<HR />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<SettingsModule />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

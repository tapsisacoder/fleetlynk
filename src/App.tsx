import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import AdminAuth from "./pages/AdminAuth";
import NotFound from "./pages/NotFound";
import DemoLogin from "./pages/demo/DemoLogin";
import DemoDashboard from "./pages/demo/DemoDashboard";
import DemoCalculator from "./pages/demo/DemoCalculator";
import DemoDeploy from "./pages/demo/DemoDeploy";
import DemoVehicles from "./pages/demo/DemoVehicles";
import DemoHistory from "./pages/demo/DemoHistory";
import DemoReports from "./pages/demo/DemoReports";
import DemoDocuments from "./pages/demo/DemoDocuments";
import "@/lib/storage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-auth" element={<AdminAuth />} />
          <Route path="/demo" element={<DemoLogin />} />
          <Route path="/demo/dashboard" element={<DemoDashboard />} />
          <Route path="/demo/calculator" element={<DemoCalculator />} />
          <Route path="/demo/deploy" element={<DemoDeploy />} />
          <Route path="/demo/vehicles" element={<DemoVehicles />} />
          <Route path="/demo/history" element={<DemoHistory />} />
          <Route path="/demo/reports" element={<DemoReports />} />
          <Route path="/demo/documents" element={<DemoDocuments />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

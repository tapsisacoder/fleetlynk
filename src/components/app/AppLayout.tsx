import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Calculator, 
  Truck, 
  History, 
  BarChart3, 
  FileText,
  MapPin,
  Users,
  Receipt,
  CreditCard,
  LogOut,
  User,
  DollarSign,
  Settings,
  AlertTriangle,
  Wrench,
  Package,
  Building2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, company, profile, loading, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/app/trips", icon: MapPin, label: "Trips" },
    { path: "/app/deploy", icon: Truck, label: "Deploy Trip" },
    { path: "/app/tracking", icon: MapPin, label: "GPS Tracking" },
    { path: "/app/vehicles", icon: Truck, label: "Fleet" },
    { path: "/app/drivers", icon: Users, label: "Drivers" },
    { path: "/app/calculator", icon: Calculator, label: "Fuel Calculator" },
    { path: "/app/documents", icon: AlertTriangle, label: "Doc Reminders" },
    { divider: true, label: "Workshop" },
    { path: "/app/maintenance", icon: Wrench, label: "Maintenance Log" },
    { path: "/app/inventory", icon: Package, label: "Inventory" },
    { divider: true, label: "Accounting" },
    { path: "/app/transactions", icon: DollarSign, label: "Daily Transactions" },
    { path: "/app/invoices", icon: FileText, label: "Invoices" },
    { path: "/app/expenses", icon: Receipt, label: "Expenses" },
    { path: "/app/clients", icon: Building2, label: "Clients" },
    { path: "/app/suppliers", icon: Users, label: "Suppliers" },
    { path: "/app/reports", icon: BarChart3, label: "Reports" },
  ];

  // Auth guards - redirect unauthenticated users
  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!company) {
    return <Navigate to="/onboarding" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Top Navigation Bar */}
      <div className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <svg viewBox="0 0 32 32" className="w-full h-full">
                    <path
                      d="M6 6 L26 6 L26 12 L14 12 L14 18 L22 18"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <circle cx="6" cy="6" r="2" fill="hsl(var(--accent))" />
                    <circle cx="26" cy="6" r="2" fill="hsl(var(--accent))" />
                    <circle cx="14" cy="12" r="2" fill="hsl(var(--accent))" />
                  </svg>
                </div>
                <span className="font-bold text-primary text-lg">LynkFleet</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <span className="font-semibold text-foreground">{demoCompany.name}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-muted-foreground">Online</span>
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {demoProfile?.full_name || demoUser.email?.split('@')[0]}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-card border-r border-border min-h-[calc(100vh-64px)] p-4 sticky top-16">
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              if ('divider' in item) {
                return (
                  <div key={index} className="my-4 border-t border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-4 mb-2 px-4">
                      {item.label}
                    </p>
                  </div>
                );
              }

              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Calculator, 
  Truck, 
  History, 
  BarChart3, 
  FileText,
  Menu,
  User
} from "lucide-react";
import { company } from "@/data/demoData";

interface DemoLayoutProps {
  children: ReactNode;
}

export const DemoLayout = ({ children }: DemoLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/demo/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/demo/calculator", icon: Calculator, label: "Fuel Calculator" },
    { path: "/demo/deploy", icon: Truck, label: "Deploy Trip" },
    { path: "/demo/vehicles", icon: Truck, label: "Fleet" },
    { path: "/demo/history", icon: History, label: "Trip History" },
    { path: "/demo/reports", icon: BarChart3, label: "Reports" },
    { path: "/demo/documents", icon: FileText, label: "Documents" }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LF</span>
                </div>
                <span className="font-bold text-primary text-lg">LynkFleet</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="font-semibold text-gray-700">{company.name}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">John M.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 p-4 bg-accent/10 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">DEMO MODE</p>
            <p className="text-sm font-medium text-gray-800">
              This is a visual prototype with dummy data
            </p>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="sm"
              className="w-full mt-3"
            >
              Exit Demo
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

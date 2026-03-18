import {
  LayoutDashboard, Truck, MapPin, Fuel, Wrench, Package, Calculator, Users, BarChart3, Settings,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const modules = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard, key: "dashboard" },
  { title: "Operations", url: "/app/operations", icon: MapPin, key: "operations" },
  { title: "Fleet", url: "/app/fleet", icon: Truck, key: "fleet" },
  { title: "Fuel", url: "/app/fuel", icon: Fuel, key: "fuel" },
  { title: "Workshop", url: "/app/workshop", icon: Wrench, key: "workshop" },
  { title: "Inventory", url: "/app/inventory", icon: Package, key: "inventory" },
  { title: "Accounts", url: "/app/accounts", icon: Calculator, key: "accounts" },
  { title: "HR", url: "/app/hr", icon: Users, key: "hr" },
  { title: "Reports", url: "/app/reports", icon: BarChart3, key: "reports" },
  { title: "Settings", url: "/app/settings", icon: Settings, key: "settings" },
];

// Role-based module access
const roleAccess: Record<string, string[]> = {
  principal: ["dashboard", "operations", "fleet", "fuel", "workshop", "inventory", "accounts", "hr", "reports", "settings"],
  operations_manager: ["dashboard", "operations", "fleet", "fuel", "reports"],
  dispatcher: ["dashboard", "operations", "fuel"],
  finance_manager: ["dashboard", "accounts", "reports"],
  workshop_manager: ["dashboard", "fleet", "workshop", "inventory", "reports"],
  storeroom_clerk: ["dashboard", "workshop", "inventory"],
  hr_manager: ["dashboard", "hr"],
  viewer: ["dashboard", "operations", "fleet", "fuel", "workshop", "inventory", "accounts", "hr", "reports"],
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { profile } = useAuth();

  const userRole = profile?.role || "viewer";
  const allowedModules = roleAccess[userRole] || ["dashboard"];

  const visibleModules = modules.filter((m) => allowedModules.includes(m.key));

  return (
    <Sidebar collapsible="icon" className="bg-sidebar border-r border-sidebar-border">
      <div className="h-[52px] flex items-center px-4 border-b border-sidebar-border">
        {!collapsed && <Logo variant="light" className="h-6" />}
        {collapsed && (
          <div className="w-7 h-7 mx-auto">
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <path d="M6 6 L26 6 L26 12 L14 12 L14 18 L22 18" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="6" cy="6" r="2" fill="hsl(22, 91%, 47%)" />
              <circle cx="26" cy="6" r="2" fill="hsl(22, 91%, 47%)" />
              <circle cx="14" cy="12" r="2" fill="hsl(22, 91%, 47%)" />
            </svg>
          </div>
        )}
      </div>
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleModules.map((item) => {
                const isActive = item.url === "/app"
                  ? location.pathname === "/app"
                  : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        end={item.url === "/app"}
                        className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

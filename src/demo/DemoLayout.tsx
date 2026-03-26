import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthContext } from "@/contexts/AuthContext";
import { DemoProvider } from "./DemoContext";

const DemoLayout = () => {
  const navigate = useNavigate();

  const authValue = {
    user: { id: "demo-user" } as any,
    session: {} as any,
    profile: {
      id: "demo-user", company_id: "demo-company",
      first_name: "Tapiwa", last_name: "Chamuka",
      email: "tapiwa@mwanahaulage.co.zw", role: "principal",
      is_authoriser: true, theme_preference: "system", status: "active",
    },
    loading: false,
    signIn: async () => ({ error: null as any }),
    signOut: async () => { navigate("/"); },
  };

  return (
    <AuthContext.Provider value={authValue}>
      <DemoProvider>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-muted">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Outlet />
            </div>
          </div>
        </SidebarProvider>
      </DemoProvider>
    </AuthContext.Provider>
  );
};

export default DemoLayout;

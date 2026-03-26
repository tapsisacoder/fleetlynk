import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const AppHeader = ({ title, children }: Props) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDemo = location.pathname.startsWith("/demo");

  const handleLogout = async () => {
    await signOut();
    navigate(isDemo ? "/" : "/login");
  };

  return (
    <header className="h-[52px] flex items-center justify-between px-4 border-b border-border bg-background shrink-0">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground" />
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {children}
        {profile && (
          <span className="text-xs text-muted-foreground hidden md:block">
            {profile.first_name} {profile.last_name}
          </span>
        )}
        <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-muted-foreground hover:text-destructive">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { Users, Calendar, TrendingUp, Target, LogOut, Search, Download, RefreshCw, Mail, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ADMIN_PASSWORD = "fleetlynk2026";

interface Application {
  id: string;
  full_name: string;
  email: string;
  company_name: string;
  trucks: string;
  country: string;
  source: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem("lynkfleet_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      loadApplications();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("lynkfleet_admin_auth", "true");
      setIsAuthenticated(true);
      loadApplications();
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 500);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("lynkfleet_admin_auth");
    setIsAuthenticated(false);
    navigate("/");
  };

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("founding_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setApplications((data as unknown as Application[]) || []);
    } catch (error) {
      console.error("Error loading:", error);
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${type}!`);
  };

  const exportCSV = () => {
    const headers = ["Timestamp", "Full Name", "Email", "Company", "Trucks", "Country"];
    const rows = applications.map((app) => [
      app.created_at, app.full_name, app.email, app.company_name, app.trucks, app.country,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lynkfleet_applications_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("CSV exported!");
  };

  const filteredApplications = applications.filter((app) =>
    app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: applications.length,
    today: applications.filter((app) => new Date(app.created_at).toDateString() === new Date().toDateString()).length,
    thisWeek: applications.filter((app) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(app.created_at) >= weekAgo;
    }).length,
    zimbabwe: applications.filter((app) => app.country === "Zimbabwe").length,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="bg-background p-8 w-full max-w-md">
          <Logo className="mb-8" />
          <h1 className="text-xl font-bold text-foreground mb-6">LynkFleet Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className={passwordError ? "border-destructive" : ""} placeholder="Enter admin password" />
              {passwordError && <p className="text-sm text-destructive">Wrong password</p>}
            </div>
            <button type="submit" className="w-full bg-accent text-accent-foreground py-3 text-sm font-bold tracking-widest uppercase">
              ACCESS DASHBOARD
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-foreground">LynkFleet Admin</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-destructive text-sm">
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Total", value: stats.total, color: "text-accent" },
            { icon: Calendar, label: "Today", value: stats.today, color: "text-blue-500" },
            { icon: TrendingUp, label: "This Week", value: stats.thisWeek, color: "text-green-500" },
            { icon: Target, label: "Zimbabwe", value: stats.zimbabwe, color: "text-purple-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card p-5 border border-border">
              <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold text-foreground font-mono">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="bg-card p-4 border border-border mb-6 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(applications.map((a) => a.email).join(", "), `${applications.length} emails`)}>
            <Mail className="w-4 h-4 mr-1" /> Copy Emails
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-1" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={loadApplications} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {/* Search */}
        <div className="bg-card p-4 border border-border mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search name, email, company..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Trucks</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Country</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      {applications.length === 0 ? "No applications yet." : "No results."}
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app, i) => (
                    <tr key={app.id} className={`border-t ${i % 2 === 0 ? "bg-card" : "bg-muted/30"} hover:bg-muted/50 transition-colors`}>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                        {new Date(app.created_at).toLocaleDateString("en-ZA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{app.full_name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{app.company_name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{app.email}</td>
                      <td className="px-4 py-3 text-sm font-mono">{app.trucks}</td>
                      <td className="px-4 py-3 text-sm">{app.country}</td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>View</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-lg">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">{selectedApp.full_name}</DialogTitle>
                <p className="text-xs text-muted-foreground font-mono">
                  {new Date(selectedApp.created_at).toLocaleString("en-ZA", { dateStyle: "long", timeStyle: "short" })}
                </p>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="bg-muted/30 p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Company</span><span className="font-medium">{selectedApp.company_name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Email</span><a href={`mailto:${selectedApp.email}`} className="text-accent hover:underline">{selectedApp.email}</a></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Trucks</span><span className="font-mono">{selectedApp.trucks}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span>{selectedApp.country}</span></div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => window.location.href = `mailto:${selectedApp.email}`}>
                    <Mail className="w-4 h-4 mr-1" /> Email
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;

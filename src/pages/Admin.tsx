import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Target,
  LogOut,
  Search,
  Download,
  RefreshCw,
  Mail,
  MessageCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FoundingApplication } from "@/types/founding";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@supabase/supabase-js";

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [applications, setApplications] = useState<FoundingApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<FoundingApplication | null>(null);

  useEffect(() => {
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        checkAdminRole(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
        navigate("/admin-auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await checkAdminRole(session.user.id);
    } else {
      navigate("/admin-auth");
    }
    setIsLoading(false);
  };

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setIsAdmin(true);
        loadApplications();
      } else {
        toast.error("Access denied. Admin role required.");
        navigate("/admin-auth");
      }
    } catch (error) {
      toast.error("Failed to verify admin access");
      navigate("/admin-auth");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-auth");
  };

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('founding_applications')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const apps: FoundingApplication[] = (data || []).map(app => ({
        id: app.id,
        timestamp: app.timestamp,
        region: app.region,
        company: app.company,
        email: app.email,
        whatsapp: app.whatsapp,
        vehicles: app.vehicles
      }));

      setApplications(apps);
    } catch (error) {
      toast.error("Failed to load applications. Please try again.");
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${type}!`);
  };

  const exportCSV = () => {
    const headers = [
      "Timestamp",
      "Region",
      "Company",
      "Email",
      "WhatsApp",
      "Vehicles"
    ];

    const rows = applications.map(app => [
      app.timestamp,
      app.region,
      app.company,
      app.email,
      app.whatsapp,
      app.vehicles
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fleetlynk_founding_fleet_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("CSV exported!");
  };

  const getRegionFlag = (region: string) => {
    if (region.includes("South Africa")) return "🇿🇦";
    if (region.includes("Zimbabwe")) return "🇿🇼";
    if (region.includes("Mozambique")) return "🇲🇿";
    if (region.includes("Zambia")) return "🇿🇲";
    if (region.includes("Botswana")) return "🇧🇼";
    return "🌍";
  };

  const filteredApplications = applications.filter(app =>
    app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: applications.length,
    today: applications.filter(app => {
      const appDate = new Date(app.timestamp);
      const today = new Date();
      return appDate.toDateString() === today.toDateString();
    }).length,
    thisWeek: applications.filter(app => {
      const appDate = new Date(app.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return appDate >= weekAgo;
    }).length,
    zimbabwe: applications.filter(app => app.region.includes("Zimbabwe")).length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-primary">
                Founding Fleet Admin
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-subtle"></div>
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-accent" />
            </div>
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Applications</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md animate-fade-in-up delay-100">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-primary">{stats.today}</div>
            <div className="text-sm text-muted-foreground">Today</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md animate-fade-in-up delay-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-primary">{stats.thisWeek}</div>
            <div className="text-sm text-muted-foreground">This Week</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md animate-fade-in-up delay-300">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-primary">{stats.zimbabwe}</div>
            <div className="text-sm text-muted-foreground">Zimbabwe</div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-8 animate-fade-in-up delay-400">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const whatsapps = applications.map(a => a.whatsapp).join("\n");
                copyToClipboard(whatsapps, `${applications.length} WhatsApp numbers`);
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Copy All WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const emails = applications.map(a => a.email).join(", ");
                copyToClipboard(emails, `${applications.length} emails`);
              }}
            >
              <Mail className="w-4 h-4 mr-2" />
              Copy All Emails
            </Button>
            <Button variant="outline" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={loadApplications} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-8 animate-fade-in-up delay-500">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search name, email, company, region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in-up delay-600">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Date/Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Region</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">WhatsApp</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Vehicles</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      {applications.length === 0
                        ? "No applications yet. Time to share your page!"
                        : "No results found for your search."}
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app, index) => (
                    <tr
                      key={app.id}
                      className={`border-t hover:bg-muted/30 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-muted/10"
                      }`}
                    >
                      <td className="px-4 py-3 text-sm">
                        {new Date(app.timestamp).toLocaleDateString("en-ZA", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="text-lg">{getRegionFlag(app.region)}</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{app.company}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{app.email}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{app.whatsapp}</td>
                      <td className="px-4 py-3 text-sm">{app.vehicles}</td>
                      <td className="px-4 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApp(app)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  {selectedApp.company}
                  <span className="text-lg">{getRegionFlag(selectedApp.region)}</span>
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Applied on {new Date(selectedApp.timestamp).toLocaleString("en-ZA", {
                    dateStyle: "long",
                    timeStyle: "short"
                  })}
                </p>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Contact */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-primary mb-3">Contact</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <a href={`mailto:${selectedApp.email}`} className="text-accent hover:underline">
                        {selectedApp.email}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">WhatsApp:</span>
                      <a
                        href={`https://wa.me/${selectedApp.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        {selectedApp.whatsapp}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Company:</span>
                      <span className="font-medium">{selectedApp.company}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Vehicles:</span>
                      <span className="font-medium">{selectedApp.vehicles}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button
                    variant="cta"
                    onClick={() => {
                      window.open(`https://wa.me/${selectedApp.whatsapp.replace(/\D/g, "")}`, "_blank");
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp {selectedApp.company}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.location.href = `mailto:${selectedApp.email}`;
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email {selectedApp.company}
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

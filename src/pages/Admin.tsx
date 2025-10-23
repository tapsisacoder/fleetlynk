import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Target,
  LogOut,
  Search,
  Download,
  RefreshCw,
  Copy,
  Mail,
  MessageCircle,
  X
} from "lucide-react";
import { storage } from "@/lib/storage";
import { FoundingApplication } from "@/types/founding";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ADMIN_PASSWORD = "fleetlynk2026";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [applications, setApplications] = useState<FoundingApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<FoundingApplication | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem("fleetlynk_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      loadApplications();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("fleetlynk_admin_auth", "true");
      setIsAuthenticated(true);
      loadApplications();
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 500);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("fleetlynk_admin_auth");
    setIsAuthenticated(false);
    navigate("/");
  };

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const keys = await storage.list("founding:");
      const apps: FoundingApplication[] = [];

      for (const key of keys) {
        const data = await storage.get(key);
        if (data) {
          apps.push(JSON.parse(data));
        }
      }

      apps.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setApplications(apps);
    } catch (error) {
      console.error("Error loading applications:", error);
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
    const headers = [
      "Timestamp",
      "Region",
      "Name",
      "Email",
      "WhatsApp",
      "Company",
      "Trucks",
      "Biggest Pain",
      "Fuel Tracking",
      "Current Tracking",
      "Priority Factor",
      "Must-Have Feature"
    ];

    const rows = applications.map(app => [
      app.timestamp,
      app.region,
      app.name,
      app.email,
      app.whatsapp,
      app.company,
      app.trucks,
      `"${app.biggestPain.replace(/"/g, '""')}"`,
      app.fuelTracking,
      `"${app.trackingMethod.join(', ')}"`,
      app.priorityFactor,
      `"${app.mustHaveFeature.replace(/"/g, '""')}"`
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
    const flags: Record<string, string> = {
      "south-africa": "🇿🇦",
      "zimbabwe": "🇿🇼",
      "both": "🌍",
      "other-southern": "🌍",
      "outside": "🌐"
    };
    return flags[region] || "🌍";
  };

  const getPriorityBadgeColor = (priority: string) => {
    const colors: Record<string, string> = {
      "affordable": "bg-accent/10 text-accent",
      "reliable": "bg-blue-100 text-blue-700",
      "simple": "bg-green-100 text-green-700",
      "support": "bg-purple-100 text-purple-700",
      "integration": "bg-pink-100 text-pink-700"
    };
    return colors[priority] || "bg-gray-100 text-gray-700";
  };

  const filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    affordablePriority: Math.round(
      (applications.filter(app => app.priorityFactor === "affordable").length / 
       Math.max(applications.length, 1)) * 100
    )
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-[hsl(221,47%,12%)] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-scale-in">
          <Logo className="mb-8" />
          <h1 className="text-2xl font-bold text-primary text-center mb-6">
            FleetLynk Admin
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={passwordError ? "border-destructive animate-shake" : ""}
                placeholder="Enter admin password"
              />
              {passwordError && (
                <p className="text-sm text-destructive">Wrong password</p>
              )}
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">
              Access Dashboard
            </Button>
          </form>
        </div>
      </div>
    );
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
            <div className="text-3xl font-bold text-primary">{stats.affordablePriority}%</div>
            <div className="text-sm text-muted-foreground">Price-Conscious</div>
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
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">WhatsApp</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Trucks</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
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
                      <td className="px-4 py-3 text-sm font-medium">{app.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{app.email}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{app.whatsapp}</td>
                      <td className="px-4 py-3 text-sm">{app.trucks}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(app.priorityFactor)}`}>
                          {app.priorityFactor}
                        </span>
                      </td>
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
                  {selectedApp.name}
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
                  </div>
                </div>

                {/* Fleet Details */}
                <div>
                  <h3 className="font-semibold text-primary mb-3">Fleet Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Truck Count:</span>
                      <span className="font-medium">{selectedApp.trucks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Fuel Method:</span>
                      <span className="font-medium">{selectedApp.fuelTracking}</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-muted-foreground">Tracking:</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {selectedApp.trackingMethod.map((method) => (
                          <span
                            key={method}
                            className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                          >
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div>
                  <h3 className="font-semibold text-primary mb-3">Insights</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-accent pl-4">
                      <p className="text-sm text-muted-foreground mb-1">Biggest Pain:</p>
                      <p className="text-sm italic">{selectedApp.biggestPain}</p>
                    </div>
                    <div className="border-l-4 border-accent pl-4">
                      <p className="text-sm text-muted-foreground mb-1">Must-Have:</p>
                      <p className="text-sm italic">{selectedApp.mustHaveFeature}</p>
                    </div>
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <h3 className="font-semibold text-primary mb-3">Priority Factor</h3>
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${getPriorityBadgeColor(selectedApp.priorityFactor)}`}>
                    {selectedApp.priorityFactor}
                  </span>
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
                    WhatsApp {selectedApp.name.split(" ")[0]}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.location.href = `mailto:${selectedApp.email}`;
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email {selectedApp.name.split(" ")[0]}
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

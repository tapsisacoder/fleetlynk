import { useState } from "react";
import { AppLayout } from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Edit, 
  Trash2,
  Calendar,
  IdCard,
  Save
} from "lucide-react";
import { useDrivers, useCreateDriver, useUpdateDriver, useDeleteDriver, Driver } from "@/hooks/useDrivers";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface DriverFormData {
  full_name: string;
  phone: string;
  email: string;
  id_number: string;
  license_number: string;
  license_expiry: string;
  address: string;
  emergency_contact: string;
  emergency_phone: string;
}

const emptyForm: DriverFormData = {
  full_name: "",
  phone: "",
  email: "",
  id_number: "",
  license_number: "",
  license_expiry: "",
  address: "",
  emergency_contact: "",
  emergency_phone: "",
};

export default function Drivers() {
  const { toast } = useToast();
  const { data: drivers = [], isLoading } = useDrivers();
  const createDriver = useCreateDriver();
  const updateDriver = useUpdateDriver();
  const deleteDriver = useDeleteDriver();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<DriverFormData>(emptyForm);

  const filteredDrivers = drivers.filter(driver =>
    driver.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.license_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (driver?: Driver) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        full_name: driver.full_name,
        phone: driver.phone || "",
        email: driver.email || "",
        id_number: driver.id_number || "",
        license_number: driver.license_number || "",
        license_expiry: driver.license_expiry || "",
        address: driver.address || "",
        emergency_contact: driver.emergency_contact || "",
        emergency_phone: driver.emergency_phone || "",
      });
    } else {
      setEditingDriver(null);
      setFormData(emptyForm);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name) {
      toast({ title: "Driver name is required", variant: "destructive" });
      return;
    }

    try {
      if (editingDriver) {
        await updateDriver.mutateAsync({ id: editingDriver.id, ...formData });
        toast({ title: "Driver updated successfully" });
      } else {
        await createDriver.mutateAsync(formData);
        toast({ title: "Driver added successfully" });
      }
      setIsDialogOpen(false);
      setFormData(emptyForm);
    } catch (error) {
      toast({ title: "Failed to save driver", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!driverToDelete) return;
    try {
      await deleteDriver.mutateAsync(driverToDelete);
      toast({ title: "Driver deleted" });
      setDriverToDelete(null);
    } catch (error) {
      toast({ title: "Failed to delete driver", variant: "destructive" });
    }
  };

  const isLicenseExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry <= thirtyDaysFromNow;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Drivers</h1>
            <p className="text-muted-foreground">Manage your driver roster</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-secondary hover:bg-secondary/90">
            <Plus className="w-4 h-4 mr-2" /> Add Driver
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Driver List */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading drivers...</div>
        ) : filteredDrivers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No drivers found</p>
              <Button variant="outline" className="mt-4" onClick={() => handleOpenDialog()}>
                Add Your First Driver
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDrivers.map(driver => (
              <Card key={driver.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {driver.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{driver.full_name}</h3>
                        <Badge 
                          variant={driver.is_active ? "default" : "secondary"}
                          className={driver.is_active ? "bg-green-500/20 text-green-600 border-0" : ""}
                        >
                          {driver.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(driver)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setDriverToDelete(driver.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    {driver.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{driver.phone}</span>
                      </div>
                    )}
                    {driver.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{driver.email}</span>
                      </div>
                    )}
                    {driver.license_number && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <IdCard className="w-4 h-4" />
                        <span>{driver.license_number}</span>
                      </div>
                    )}
                    {driver.license_expiry && (
                      <div className={`flex items-center gap-2 ${isLicenseExpiringSoon(driver.license_expiry) ? 'text-destructive' : 'text-muted-foreground'}`}>
                        <Calendar className="w-4 h-4" />
                        <span>
                          License: {format(new Date(driver.license_expiry), 'dd MMM yyyy')}
                          {isLicenseExpiringSoon(driver.license_expiry) && " (Expiring!)"}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+27 123 456 7890"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="id_number">ID Number</Label>
                <Input
                  id="id_number"
                  value={formData.id_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, id_number: e.target.value }))}
                  placeholder="National ID"
                />
              </div>
              <div>
                <Label htmlFor="license_number">License Number</Label>
                <Input
                  id="license_number"
                  value={formData.license_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                  placeholder="License number"
                />
              </div>
              <div>
                <Label htmlFor="license_expiry">License Expiry</Label>
                <Input
                  id="license_expiry"
                  type="date"
                  value={formData.license_expiry}
                  onChange={(e) => setFormData(prev => ({ ...prev, license_expiry: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Full address"
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact: e.target.value }))}
                  placeholder="Contact name"
                />
              </div>
              <div>
                <Label htmlFor="emergency_phone">Emergency Phone</Label>
                <Input
                  id="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergency_phone: e.target.value }))}
                  placeholder="+27 123 456 7890"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                <Save className="w-4 h-4 mr-2" />
                {editingDriver ? 'Update' : 'Add'} Driver
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!driverToDelete} onOpenChange={() => setDriverToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Driver?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the driver record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}

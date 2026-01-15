import { useState } from 'react';
import { AppLayout } from '@/components/app/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, Search, Building2, Phone, Mail, MapPin, Star, MoreVertical,
  DollarSign, Clock, CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SUPPLIER_TYPES = [
  'Parts Distributor',
  'OEM Supplier',
  'Tyre Supplier',
  'Fluid/Lubricant Supplier',
  'General Workshop Supplies',
  'Fuel Supplier',
  'Service Provider',
];

const PAYMENT_TERMS = [
  { value: 'cash', label: 'Cash on Delivery' },
  { value: '7days', label: '7 Days' },
  { value: '14days', label: '14 Days' },
  { value: '30days', label: '30 Days' },
  { value: '60days', label: '60 Days' },
];

// Demo suppliers
const demoSuppliers = [
  { 
    id: '1', 
    code: 'SUP-001',
    name: 'TyrePro Distributors',
    type: 'Tyre Supplier',
    contactPerson: 'John Smith',
    phone: '+263 77 123 4567',
    email: 'orders@tyrepro.co.zw',
    address: '123 Industrial Ave, Harare',
    paymentTerms: '30days',
    rating: 5,
    isPreferred: true,
    balance: 2500,
    isActive: true,
  },
  { 
    id: '2', 
    code: 'SUP-002',
    name: 'AutoParts Direct',
    type: 'Parts Distributor',
    contactPerson: 'Sarah Moyo',
    phone: '+263 77 234 5678',
    email: 'sales@autoparts.co.zw',
    address: '45 Commerce St, Bulawayo',
    paymentTerms: '14days',
    rating: 4,
    isPreferred: false,
    balance: 850,
    isActive: true,
  },
  { 
    id: '3', 
    code: 'SUP-003',
    name: 'Mobil Oil Zimbabwe',
    type: 'Fluid/Lubricant Supplier',
    contactPerson: 'Peter Ncube',
    phone: '+263 78 345 6789',
    email: 'corporate@mobil.co.zw',
    address: '78 Depot Road, Harare',
    paymentTerms: '30days',
    rating: 5,
    isPreferred: true,
    balance: 0,
    isActive: true,
  },
];

interface Supplier {
  id: string;
  code: string;
  name: string;
  type: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  paymentTerms: string;
  rating: number;
  isPreferred: boolean;
  balance: number;
  isActive: boolean;
}

const Suppliers = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [suppliers, setSuppliers] = useState<Supplier[]>(demoSuppliers);
  const { toast } = useToast();

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    type: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    paymentTerms: '30days',
    isPreferred: false,
  });

  const filteredSuppliers = suppliers.filter(sup => {
    const matchesSearch = 
      sup.name.toLowerCase().includes(search.toLowerCase()) ||
      sup.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      sup.code.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || sup.type === typeFilter;
    return matchesSearch && matchesType && sup.isActive;
  });

  const totalOutstanding = suppliers.reduce((sum, sup) => sum + sup.balance, 0);
  const preferredCount = suppliers.filter(s => s.isPreferred).length;

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.type) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    const supplier: Supplier = {
      id: crypto.randomUUID(),
      code: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
      ...newSupplier,
      rating: 3,
      balance: 0,
      isActive: true,
    };

    setSuppliers([...suppliers, supplier]);
    setIsOpen(false);
    setNewSupplier({
      name: '',
      type: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      paymentTerms: '30days',
      isPreferred: false,
    });
    toast({ title: 'Supplier added successfully' });
  };

  const togglePreferred = (id: string) => {
    setSuppliers(suppliers.map(s => 
      s.id === id ? { ...s, isPreferred: !s.isPreferred } : s
    ));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Suppliers</h1>
            <p className="text-muted-foreground">Manage your parts and service suppliers</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label>Supplier Name *</Label>
                  <Input
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                    placeholder="e.g., TyrePro Distributors"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Supplier Type *</Label>
                  <Select value={newSupplier.type} onValueChange={(v) => setNewSupplier({ ...newSupplier, type: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPLIER_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Person</Label>
                    <Input
                      value={newSupplier.contactPerson}
                      onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                      placeholder="Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={newSupplier.phone}
                      onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                      placeholder="+263 77 xxx xxxx"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    placeholder="orders@supplier.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={newSupplier.address}
                    onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                    placeholder="Physical address"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payment Terms</Label>
                    <Select value={newSupplier.paymentTerms} onValueChange={(v) => setNewSupplier({ ...newSupplier, paymentTerms: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_TERMS.map((term) => (
                          <SelectItem key={term.value} value={term.value}>{term.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Supplier</Label>
                    <Select 
                      value={newSupplier.isPreferred ? 'yes' : 'no'} 
                      onValueChange={(v) => setNewSupplier({ ...newSupplier, isPreferred: v === 'yes' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddSupplier}>Add Supplier</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Suppliers</p>
              <p className="text-2xl font-bold">{suppliers.filter(s => s.isActive).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Preferred Suppliers</p>
              <p className="text-2xl font-bold text-amber-600">{preferredCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Outstanding Balance</p>
              <p className="text-2xl font-bold text-red-600">${totalOutstanding.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Paid Up</p>
              <p className="text-2xl font-bold text-green-600">
                {suppliers.filter(s => s.balance === 0).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search suppliers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Supplier Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {SUPPLIER_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Suppliers Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Payment Terms</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{supplier.name}</p>
                            {supplier.isPreferred && (
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{supplier.code}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{supplier.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{supplier.contactPerson}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {supplier.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {PAYMENT_TERMS.find(t => t.value === supplier.paymentTerms)?.label}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= supplier.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {supplier.balance > 0 ? (
                        <span className="text-red-600 font-semibold">${supplier.balance.toLocaleString()}</span>
                      ) : (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Paid
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePreferred(supplier.id)}
                        title={supplier.isPreferred ? 'Remove preferred' : 'Mark as preferred'}
                      >
                        <Star className={`w-4 h-4 ${supplier.isPreferred ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSuppliers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No suppliers found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Suppliers;

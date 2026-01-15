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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, Search, Package, AlertTriangle, ArrowDown, ArrowUp,
  Droplets, CircleDot, Wrench, Filter, MoreVertical
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES = [
  { value: 'engine_parts', label: 'Engine Parts', icon: Wrench },
  { value: 'brake_system', label: 'Brake System', icon: CircleDot },
  { value: 'electrical', label: 'Electrical Components', icon: Package },
  { value: 'suspension', label: 'Suspension & Steering', icon: Package },
  { value: 'tyres', label: 'Tyres', icon: CircleDot },
  { value: 'fluids', label: 'Fluids & Lubricants', icon: Droplets },
  { value: 'filters', label: 'Filters', icon: Filter },
  { value: 'body', label: 'Body & Accessories', icon: Package },
  { value: 'trailer', label: 'Trailer Parts', icon: Package },
];

// Demo inventory data
const demoInventory = [
  { id: '1', partNumber: 'OIL-15W40-20L', name: 'Engine Oil 15W-40 (20L)', category: 'fluids', quantity: 12, minStock: 5, unit: 'drums', unitCost: 85, location: 'Shelf A1' },
  { id: '2', partNumber: 'TYR-315-80R22', name: 'Drive Tyre 315/80R22.5', category: 'tyres', quantity: 8, minStock: 4, unit: 'pieces', unitCost: 450, location: 'Bay T1' },
  { id: '3', partNumber: 'FIL-OIL-SC', name: 'Oil Filter - Scania', category: 'filters', quantity: 15, minStock: 10, unit: 'pieces', unitCost: 25, location: 'Shelf B3' },
  { id: '4', partNumber: 'BRK-PAD-FRT', name: 'Brake Pads Front Set', category: 'brake_system', quantity: 6, minStock: 4, unit: 'sets', unitCost: 180, location: 'Shelf C2' },
  { id: '5', partNumber: 'COOL-10L', name: 'Coolant/Antifreeze (10L)', category: 'fluids', quantity: 8, minStock: 5, unit: 'containers', unitCost: 35, location: 'Shelf A2' },
  { id: '6', partNumber: 'FIL-AIR-UNV', name: 'Air Filter - Universal', category: 'filters', quantity: 3, minStock: 5, unit: 'pieces', unitCost: 45, location: 'Shelf B4' },
  { id: '7', partNumber: 'ADBLUE-20L', name: 'AdBlue/DEF (20L)', category: 'fluids', quantity: 20, minStock: 10, unit: 'containers', unitCost: 25, location: 'Bay F1' },
  { id: '8', partNumber: 'BLB-H7-LED', name: 'LED Headlight Bulb H7', category: 'electrical', quantity: 12, minStock: 6, unit: 'pieces', unitCost: 35, location: 'Shelf D1' },
];

interface InventoryItem {
  id: string;
  partNumber: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
  unitCost: number;
  location: string;
}

const Inventory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockAction, setStockAction] = useState<'in' | 'out'>('in');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [inventory, setInventory] = useState<InventoryItem[]>(demoInventory);
  const { toast } = useToast();

  // New item form state
  const [newItem, setNewItem] = useState({
    partNumber: '',
    name: '',
    category: '',
    quantity: 0,
    minStock: 5,
    unit: 'pieces',
    unitCost: 0,
    location: '',
  });

  const [stockQty, setStockQty] = useState(1);
  const [stockReason, setStockReason] = useState('');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  const handleAddItem = () => {
    if (!newItem.partNumber || !newItem.name || !newItem.category) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    const item: InventoryItem = {
      id: crypto.randomUUID(),
      ...newItem,
    };

    setInventory([...inventory, item]);
    setIsOpen(false);
    setNewItem({
      partNumber: '',
      name: '',
      category: '',
      quantity: 0,
      minStock: 5,
      unit: 'pieces',
      unitCost: 0,
      location: '',
    });
    toast({ title: 'Part added to inventory' });
  };

  const handleStockAction = () => {
    if (!selectedItem) return;

    setInventory(inventory.map(item => {
      if (item.id === selectedItem.id) {
        const newQty = stockAction === 'in' 
          ? item.quantity + stockQty 
          : Math.max(0, item.quantity - stockQty);
        return { ...item, quantity: newQty };
      }
      return item;
    }));

    setStockModalOpen(false);
    setStockQty(1);
    setStockReason('');
    toast({ 
      title: `Stock ${stockAction === 'in' ? 'added' : 'removed'}`,
      description: `${stockQty} ${selectedItem.unit} ${stockAction === 'in' ? 'added to' : 'removed from'} ${selectedItem.name}`
    });
  };

  const openStockModal = (item: InventoryItem, action: 'in' | 'out') => {
    setSelectedItem(item);
    setStockAction(action);
    setStockModalOpen(true);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (item.quantity <= item.minStock) return { label: 'Low Stock', color: 'bg-amber-100 text-amber-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
            <p className="text-muted-foreground">Manage parts, tyres, fluids, and workshop supplies</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Part
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Part</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Part Number *</Label>
                    <Input
                      value={newItem.partNumber}
                      onChange={(e) => setNewItem({ ...newItem, partNumber: e.target.value })}
                      placeholder="e.g., OIL-15W40-20L"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Part Name/Description *</Label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g., Engine Oil 15W-40 (20L)"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Initial Qty</Label>
                    <Input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Min Stock</Label>
                    <Input
                      type="number"
                      value={newItem.minStock}
                      onChange={(e) => setNewItem({ ...newItem, minStock: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select value={newItem.unit} onValueChange={(v) => setNewItem({ ...newItem, unit: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pieces">Pieces</SelectItem>
                        <SelectItem value="sets">Sets</SelectItem>
                        <SelectItem value="liters">Liters</SelectItem>
                        <SelectItem value="drums">Drums</SelectItem>
                        <SelectItem value="containers">Containers</SelectItem>
                        <SelectItem value="kg">Kilograms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unit Cost ($)</Label>
                    <Input
                      type="number"
                      value={newItem.unitCost}
                      onChange={(e) => setNewItem({ ...newItem, unitCost: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Storage Location</Label>
                    <Input
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                      placeholder="e.g., Shelf A1"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddItem}>Add Part</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Parts</p>
              <p className="text-2xl font-bold">{inventory.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Stock Value</p>
              <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className={lowStockItems.length > 0 ? 'border-amber-200 bg-amber-50' : ''}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-amber-600">{lowStockItems.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold">{new Set(inventory.map(i => i.category)).size}</p>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Low Stock Items - Reorder Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map(item => (
                  <Badge key={item.id} variant="outline" className="bg-white">
                    {item.name} ({item.quantity} left)
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search parts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.partNumber}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{item.quantity}</span>
                        <span className="text-muted-foreground text-sm"> {item.unit}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.location}</TableCell>
                      <TableCell>${(item.quantity * item.unitCost).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={status.color}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openStockModal(item, 'in')}
                            className="text-green-600"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openStockModal(item, 'out')}
                            className="text-red-600"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredInventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No parts found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Stock In/Out Modal */}
        <Dialog open={stockModalOpen} onOpenChange={setStockModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {stockAction === 'in' ? (
                  <>
                    <ArrowDown className="w-5 h-5 text-green-600" />
                    Stock In - Receive Stock
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-5 h-5 text-red-600" />
                    Stock Out - Issue Stock
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4 pt-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedItem.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Current Stock: {selectedItem.quantity} {selectedItem.unit}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={stockQty}
                    onChange={(e) => setStockQty(parseInt(e.target.value) || 0)}
                    min={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {stockAction === 'in' ? 'Supplier/Invoice Reference' : 'Reason/Job Reference'}
                  </Label>
                  <Input
                    value={stockReason}
                    onChange={(e) => setStockReason(e.target.value)}
                    placeholder={stockAction === 'in' ? 'e.g., INV-12345' : 'e.g., Service Job #123'}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setStockModalOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={handleStockAction}
                    className={stockAction === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                  >
                    {stockAction === 'in' ? 'Add Stock' : 'Remove Stock'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Inventory;

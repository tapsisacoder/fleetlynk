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
  Plus, Search, Package, AlertTriangle, ArrowDown, ArrowUp,
  Droplets, CircleDot, Wrench, Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  useInventoryItems, 
  useCreateInventoryItem, 
  useStockIn, 
  useStockOut,
  InventoryItem 
} from '@/hooks/useInventory';
import { Skeleton } from '@/components/ui/skeleton';

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

const Inventory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockAction, setStockAction] = useState<'in' | 'out'>('in');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { toast } = useToast();

  const { data: inventory = [], isLoading } = useInventoryItems();
  const createItem = useCreateInventoryItem();
  const stockIn = useStockIn();
  const stockOut = useStockOut();

  // New item form state
  const [newItem, setNewItem] = useState({
    part_number: '',
    name: '',
    category: '',
    quantity: 0,
    min_stock_level: 5,
    unit_cost: 0,
    location: '',
  });

  const [stockQty, setStockQty] = useState(1);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.part_number.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => item.quantity <= item.min_stock_level);
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.unit_cost), 0);

  const handleAddItem = async () => {
    if (!newItem.part_number || !newItem.name) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    try {
      await createItem.mutateAsync(newItem);
      setIsOpen(false);
      setNewItem({
        part_number: '',
        name: '',
        category: '',
        quantity: 0,
        min_stock_level: 5,
        unit_cost: 0,
        location: '',
      });
      toast({ title: 'Part added to inventory' });
    } catch (error: any) {
      toast({ title: 'Error adding part', description: error.message, variant: 'destructive' });
    }
  };

  const handleStockAction = async () => {
    if (!selectedItem) return;

    try {
      if (stockAction === 'in') {
        await stockIn.mutateAsync({ id: selectedItem.id, quantity: stockQty });
      } else {
        await stockOut.mutateAsync({ id: selectedItem.id, quantity: stockQty });
      }

      setStockModalOpen(false);
      setStockQty(1);
      toast({ 
        title: `Stock ${stockAction === 'in' ? 'added' : 'removed'}`,
        description: `${stockQty} units ${stockAction === 'in' ? 'added to' : 'removed from'} ${selectedItem.name}`
      });
    } catch (error: any) {
      toast({ title: 'Error updating stock', description: error.message, variant: 'destructive' });
    }
  };

  const openStockModal = (item: InventoryItem, action: 'in' | 'out') => {
    setSelectedItem(item);
    setStockAction(action);
    setStockModalOpen(true);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (item.quantity <= item.min_stock_level) return { label: 'Low Stock', color: 'bg-amber-100 text-amber-800' };
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
                      value={newItem.part_number}
                      onChange={(e) => setNewItem({ ...newItem, part_number: e.target.value })}
                      placeholder="e.g., OIL-15W40-20L"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
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
                      value={newItem.min_stock_level}
                      onChange={(e) => setNewItem({ ...newItem, min_stock_level: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Cost ($)</Label>
                    <Input
                      type="number"
                      value={newItem.unit_cost}
                      onChange={(e) => setNewItem({ ...newItem, unit_cost: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Storage Location</Label>
                  <Input
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    placeholder="e.g., Shelf A1"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddItem} disabled={createItem.isPending}>
                    {createItem.isPending ? 'Adding...' : 'Add Part'}
                  </Button>
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
              <p className="text-2xl font-bold">{new Set(inventory.map(i => i.category).filter(Boolean)).size}</p>
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
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
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
                        <TableCell className="font-mono text-sm">{item.part_number}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {CATEGORIES.find(c => c.value === item.category)?.label || item.category || 'Uncategorized'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{item.quantity}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.location || '-'}</TableCell>
                        <TableCell>${(item.quantity * item.unit_cost).toLocaleString()}</TableCell>
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
                        <p>{search || categoryFilter !== 'all' ? 'No parts match your filters' : 'No parts in inventory yet'}</p>
                        {!search && categoryFilter === 'all' && (
                          <Button className="mt-4" onClick={() => setIsOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Part
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Stock In/Out Modal */}
        <Dialog open={stockModalOpen} onOpenChange={setStockModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {stockAction === 'in' ? 'Stock In' : 'Stock Out'}: {selectedItem?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Current Stock: {selectedItem?.quantity || 0}</Label>
              </div>
              <div className="space-y-2">
                <Label>Quantity to {stockAction === 'in' ? 'Add' : 'Remove'}</Label>
                <Input
                  type="number"
                  min="1"
                  value={stockQty}
                  onChange={(e) => setStockQty(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStockModalOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleStockAction}
                  className={stockAction === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                  disabled={stockIn.isPending || stockOut.isPending}
                >
                  {stockIn.isPending || stockOut.isPending ? 'Processing...' : `${stockAction === 'in' ? 'Add' : 'Remove'} Stock`}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Inventory;

import { useState } from 'react';
import { AppLayout } from '@/components/app/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { useInvoices, useCreateInvoice, useUpdateInvoice, useDeleteInvoice } from '@/hooks/useAccounting';
import { useTrips } from '@/hooks/useTrips';
import { useClients } from '@/hooks/useClients';
import { Plus, Search, FileText, Trash2, Eye, Send, DollarSign, Edit } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Invoices = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTrip, setSelectedTrip] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('30');

  const { data: invoices, isLoading } = useInvoices();
  const { data: trips } = useTrips();
  const { data: clients } = useClients();
  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();
  const deleteInvoice = useDeleteInvoice();
  const { toast } = useToast();

  const completedTrips = trips?.filter(t => t.status === 'completed' || t.status === 'in_transit');

  const filteredInvoices = invoices?.filter(inv => {
    const matchesSearch = 
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      inv.client_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async () => {
    if (!selectedTrip || !amount) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    const trip = trips?.find(t => t.id === selectedTrip);
    const client = clients?.find(c => c.id === selectedClient);
    const today = new Date();
    const dueDate = addDays(today, parseInt(paymentTerms));
    const invoiceNum = `INV-${Date.now()}`;

    await createInvoice.mutateAsync({
      invoice_number: invoiceNum,
      trip_id: selectedTrip,
      client_id: selectedClient || undefined,
      client_name: client?.name || trip?.client?.name || 'Walk-in Client',
      client_email: client?.email || undefined,
      client_phone: client?.phone || undefined,
      invoice_date: format(today, 'yyyy-MM-dd'),
      due_date: format(dueDate, 'yyyy-MM-dd'),
      total_amount: parseFloat(amount),
      route: trip ? `${trip.origin} → ${trip.destination}` : undefined,
      distance_km: trip?.distance_km || undefined,
      notes: notes || undefined,
      payment_terms_days: parseInt(paymentTerms),
      status: 'draft',
    });

    setIsOpen(false);
    resetForm();
    toast({ title: 'Invoice created', description: 'Invoice has been created successfully' });
  };

  const resetForm = () => {
    setSelectedTrip('');
    setSelectedClient('');
    setAmount('');
    setNotes('');
    setPaymentTerms('30');
  };

  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    await updateInvoice.mutateAsync({ id: invoiceId, status: newStatus });
    toast({ title: 'Status updated' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      await deleteInvoice.mutateAsync(id);
      toast({ title: 'Invoice deleted' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: invoices?.length || 0,
    draft: invoices?.filter(i => i.status === 'draft').length || 0,
    sent: invoices?.filter(i => i.status === 'sent').length || 0,
    paid: invoices?.filter(i => i.status === 'paid').length || 0,
    totalValue: invoices?.reduce((sum, i) => sum + i.total_amount, 0) || 0,
    outstanding: invoices?.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.total_amount, 0) || 0,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <p className="text-muted-foreground">Create and manage customer invoices</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Invoice</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Trip *</Label>
                  <Select value={selectedTrip} onValueChange={setSelectedTrip}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a trip" />
                    </SelectTrigger>
                    <SelectContent>
                      {completedTrips?.map((trip) => (
                        <SelectItem key={trip.id} value={trip.id}>
                          {trip.trip_reference} - {trip.origin} → {trip.destination}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount *</Label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Terms (days)</Label>
                    <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreate} disabled={createInvoice.isPending}>
                    Create Invoice
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
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Outstanding</p>
              <p className="text-2xl font-bold text-amber-600">${stats.outstanding.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices?.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{invoice.client_name || 'N/A'}</TableCell>
                    <TableCell>{invoice.route || 'N/A'}</TableCell>
                    <TableCell className="font-semibold">${invoice.total_amount.toLocaleString()}</TableCell>
                    <TableCell>{format(new Date(invoice.due_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status || 'draft')}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {invoice.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusChange(invoice.id, 'sent')}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        )}
                        {invoice.status === 'sent' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusChange(invoice.id, 'paid')}
                          >
                            <DollarSign className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDelete(invoice.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!filteredInvoices || filteredInvoices.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No invoices found</p>
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

export default Invoices;

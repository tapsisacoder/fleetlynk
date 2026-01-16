import { useState } from "react";
import { AppLayout } from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Save, Trash2, Undo, ArrowUpCircle, ArrowDownCircle, 
  CreditCard, DollarSign, Calendar, Building2, Upload, Paperclip
} from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useTransactions, useChartOfAccounts, Transaction } from "@/hooks/useAccounting";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ReceiptUpload } from "@/components/app/ReceiptUpload";

interface DailyEntry {
  id: string;
  date: string;
  type: "income" | "expense" | "credit_purchase" | "partial_payment";
  description: string;
  amount: string;
  party: string;
  reference: string;
  notes: string;
  receiptPath: string;
}

const emptyEntry = (): DailyEntry => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString().split('T')[0],
  type: "income",
  description: "",
  amount: "",
  party: "",
  reference: "",
  notes: "",
  receiptPath: "",
});

export default function DailyTransactions() {
  const { toast } = useToast();
  const { company, user } = useAuth();
  const queryClient = useQueryClient();
  const { data: clients = [] } = useClients();
  const { data: transactions = [], isLoading } = useTransactions(100);
  const { data: accounts = [] } = useChartOfAccounts();

  const [entries, setEntries] = useState<DailyEntry[]>([emptyEntry()]);
  const [isSaving, setIsSaving] = useState(false);

  const addEntry = () => setEntries([...entries, emptyEntry()]);
  
  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const updateEntry = (id: string, field: keyof DailyEntry, value: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const undoAll = () => setEntries([emptyEntry()]);

  const saveTransactions = async () => {
    if (!company?.id) return;
    
    const validEntries = entries.filter(e => e.description && e.amount);
    if (validEntries.length === 0) {
      toast({ title: "Please fill in at least one transaction", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      for (const entry of validEntries) {
        const txnType = entry.type === 'income' ? 'INCOME' : 
                        entry.type === 'expense' ? 'EXPENSE' : 
                        entry.type === 'credit_purchase' ? 'CREDIT_PURCHASE' : 'PARTIAL_PAYMENT';
        
        const { error } = await supabase.from('transactions').insert({
          company_id: company.id,
          transaction_number: `TXN-${Date.now()}`,
          transaction_date: entry.date,
          transaction_type: txnType,
          description: entry.description,
          total_amount: parseFloat(entry.amount) || 0,
          reference: entry.reference || null,
          notes: entry.notes || null,
          status: 'POSTED',
          created_by: user?.id,
        });
        
        if (error) throw error;
      }
      
      toast({ title: `${validEntries.length} transaction(s) saved successfully` });
      setEntries([emptyEntry()]);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    } catch (error) {
      toast({ title: "Failed to save transactions", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const typeLabels = {
    income: { label: "Money In", icon: ArrowDownCircle, color: "text-green-600" },
    expense: { label: "Money Out", icon: ArrowUpCircle, color: "text-red-600" },
    credit_purchase: { label: "Credit Purchase", icon: CreditCard, color: "text-orange-600" },
    partial_payment: { label: "Partial Payment", icon: DollarSign, color: "text-blue-600" },
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Daily Transactions</h1>
            <p className="text-muted-foreground">Record your daily financial activities</p>
          </div>
        </div>

        <Tabs defaultValue="entry" className="space-y-4">
          <TabsList>
            <TabsTrigger value="entry">New Entries</TabsTrigger>
            <TabsTrigger value="history">Recent Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="entry" className="space-y-4">
            {entries.map((entry, index) => (
              <Card key={entry.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Entry #{index + 1}</CardTitle>
                    {entries.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeEntry(entry.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Date</Label>
                      <Input type="date" value={entry.date} 
                        onChange={(e) => updateEntry(entry.id, 'date', e.target.value)} />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select value={entry.type} onValueChange={(v) => updateEntry(entry.id, 'type', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">💰 Money In (Revenue)</SelectItem>
                          <SelectItem value="expense">💸 Money Out (Expense)</SelectItem>
                          <SelectItem value="credit_purchase">🏷️ Credit Purchase (Pay Later)</SelectItem>
                          <SelectItem value="partial_payment">📊 Partial Payment Received</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Amount</Label>
                      <Input type="number" placeholder="0.00" value={entry.amount}
                        onChange={(e) => updateEntry(entry.id, 'amount', e.target.value)} />
                    </div>
                    <div>
                      <Label>Customer/Supplier</Label>
                      <Input placeholder="Name" value={entry.party}
                        onChange={(e) => updateEntry(entry.id, 'party', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Description *</Label>
                      <Input placeholder="What was this for?" value={entry.description}
                        onChange={(e) => updateEntry(entry.id, 'description', e.target.value)} />
                    </div>
                    <div>
                      <Label>Reference</Label>
                      <Input placeholder="Invoice #, Receipt #" value={entry.reference}
                        onChange={(e) => updateEntry(entry.id, 'reference', e.target.value)} />
                    </div>
                  </div>
                  
                  {/* Receipt Upload */}
                  <div className="pt-2">
                    <ReceiptUpload 
                      onUpload={(path) => updateEntry(entry.id, 'receiptPath', path)}
                      existingUrl={entry.receiptPath}
                      label="Attach Receipt/Document (optional)"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex flex-wrap gap-4">
              <Button variant="outline" onClick={addEntry}>
                <Plus className="w-4 h-4 mr-2" /> Add Another Entry
              </Button>
              <Button variant="outline" onClick={undoAll}>
                <Undo className="w-4 h-4 mr-2" /> Clear All
              </Button>
              <Button onClick={saveTransactions} disabled={isSaving} className="bg-secondary hover:bg-secondary/90">
                <Save className="w-4 h-4 mr-2" /> Save All Transactions
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : transactions.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No transactions yet</div>
                ) : (
                  <div className="divide-y">
                    {transactions.slice(0, 20).map(txn => (
                      <div key={txn.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${txn.transaction_type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {txn.transaction_type === 'INCOME' ? 
                              <ArrowDownCircle className="w-4 h-4 text-green-600" /> : 
                              <ArrowUpCircle className="w-4 h-4 text-red-600" />}
                          </div>
                          <div>
                            <p className="font-medium">{txn.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(txn.transaction_date), 'dd MMM yyyy')} • {txn.transaction_number}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${txn.transaction_type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                            {txn.transaction_type === 'INCOME' ? '+' : '-'}${txn.total_amount.toLocaleString()}
                          </p>
                          <Badge variant="outline">{txn.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

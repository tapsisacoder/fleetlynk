import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Chart of Accounts
export interface ChartOfAccount {
  id: string;
  company_id: string;
  account_code: string;
  account_name: string;
  account_type: string;
  category: string | null;
  parent_code: string | null;
  is_active: boolean;
  is_system: boolean;
  description: string | null;
}

export const useChartOfAccounts = () => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['chart-of-accounts', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('chart_of_accounts')
        .select('*')
        .eq('company_id', company.id)
        .eq('is_active', true)
        .order('account_code');
      
      if (error) throw error;
      return data as ChartOfAccount[];
    },
    enabled: !!company?.id,
  });
};

// Transactions
export interface Transaction {
  id: string;
  company_id: string;
  transaction_number: string;
  transaction_date: string;
  transaction_type: string;
  description: string;
  reference: string | null;
  currency: string;
  exchange_rate: number;
  total_amount: number;
  status: string;
  posted_at: string | null;
  posted_by: string | null;
  trip_id: string | null;
  vehicle_id: string | null;
  driver_id: string | null;
  client_id: string | null;
  created_by: string | null;
  created_at: string;
  notes: string | null;
}

export const useTransactions = (limit = 50) => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['transactions', company?.id, limit],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('company_id', company.id)
        .order('transaction_date', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!company?.id,
  });
};

// Invoices
export interface Invoice {
  id: string;
  company_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  client_id: string | null;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  trip_id: string | null;
  route: string | null;
  distance_km: number | null;
  currency: string;
  total_amount: number;
  status: string;
  sent_at: string | null;
  paid_at: string | null;
  payment_method: string | null;
  payment_reference: string | null;
  payment_terms_days: number;
  notes: string | null;
  pdf_url: string | null;
  created_at: string;
}

export const useInvoices = (status?: string) => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['invoices', company?.id, status],
    queryFn: async () => {
      if (!company?.id) return [];
      
      let query = supabase
        .from('invoices')
        .select('*')
        .eq('company_id', company.id)
        .order('invoice_date', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Invoice[];
    },
    enabled: !!company?.id,
  });
};

export interface InvoiceInsert {
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  client_id?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  trip_id?: string;
  route?: string;
  distance_km?: number;
  total_amount: number;
  currency?: string;
  status?: string;
  payment_terms_days?: number;
  notes?: string;
}

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  const { company, user } = useAuth();

  return useMutation({
    mutationFn: async (invoice: InvoiceInsert) => {
      if (!company?.id) throw new Error('No company found');
      
      const { data, error } = await supabase
        .from('invoices')
        .insert({ 
          ...invoice, 
          company_id: company.id,
          created_by: user?.id 
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Invoice> & { id: string }) => {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

// Expense Records
export interface ExpenseRecord {
  id: string;
  company_id: string;
  trip_id: string | null;
  transaction_id: string | null;
  expense_type: string;
  expense_date: string;
  description: string;
  amount: number;
  currency: string;
  location: string | null;
  vendor: string | null;
  driver_id: string | null;
  vehicle_id: string | null;
  receipt_photo_url: string | null;
  status: string;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export const useExpenseRecords = (status?: string) => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['expense-records', company?.id, status],
    queryFn: async () => {
      if (!company?.id) return [];
      
      let query = supabase
        .from('expense_records')
        .select('*')
        .eq('company_id', company.id)
        .order('expense_date', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as ExpenseRecord[];
    },
    enabled: !!company?.id,
  });
};

export interface ExpenseInsert {
  trip_id?: string;
  expense_type: string;
  expense_date: string;
  description: string;
  amount: number;
  currency?: string;
  location?: string;
  vendor?: string;
  driver_id?: string;
  vehicle_id?: string;
  receipt_photo_url?: string;
  status?: string;
}

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  const { company } = useAuth();

  return useMutation({
    mutationFn: async (expense: ExpenseInsert) => {
      if (!company?.id) throw new Error('No company found');
      
      const { data, error } = await supabase
        .from('expense_records')
        .insert({ ...expense, company_id: company.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-records'] });
    },
  });
};

export const useExpenses = useExpenseRecords;

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ExpenseRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from('expense_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-records'] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expense_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-records'] });
    },
  });
};

export const useApproveExpense = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('expense_records')
        .update({ 
          status: 'APPROVED',
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-records'] });
    },
  });
};

export const useRejectExpense = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data, error } = await supabase
        .from('expense_records')
        .update({ 
          status: 'REJECTED',
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-records'] });
    },
  });
};

// Trip Bookouts
export interface TripBookout {
  id: string;
  company_id: string;
  trip_id: string;
  driver_id: string;
  vehicle_id: string | null;
  bookout_date: string;
  total_cash_given: number;
  currency: string;
  food_allowance: number;
  accommodation: number;
  toll_fees: number;
  border_fees: number;
  emergency_fund: number;
  airtime: number;
  other_expenses: number;
  status: string;
  amount_spent: number;
  amount_returned: number;
  variance: number;
  reconciled_at: string | null;
  reconciled_by: string | null;
  operator_name: string | null;
  notes: string | null;
  created_at: string;
}

export const useTripBookouts = () => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['trip-bookouts', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('trip_bookouts')
        .select('*')
        .eq('company_id', company.id)
        .order('bookout_date', { ascending: false });
      
      if (error) throw error;
      return data as TripBookout[];
    },
    enabled: !!company?.id,
  });
};

export interface BookoutInsert {
  trip_id: string;
  driver_id: string;
  vehicle_id?: string;
  bookout_date: string;
  total_cash_given: number;
  currency?: string;
  food_allowance?: number;
  accommodation?: number;
  toll_fees?: number;
  border_fees?: number;
  emergency_fund?: number;
  airtime?: number;
  other_expenses?: number;
  operator_name?: string;
  notes?: string;
}

export const useCreateBookout = () => {
  const queryClient = useQueryClient();
  const { company } = useAuth();

  return useMutation({
    mutationFn: async (bookout: BookoutInsert) => {
      if (!company?.id) throw new Error('No company found');
      
      const { data, error } = await supabase
        .from('trip_bookouts')
        .insert({ ...bookout, company_id: company.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip-bookouts'] });
    },
  });
};

// Dashboard Stats
export interface DashboardStats {
  cashBalance: number;
  receivables: number;
  monthlyRevenue: number;
  monthlyProfit: number;
  activeVehicles: number;
  activeTrips: number;
  pendingExpenses: number;
  overdueInvoices: number;
}

export const useDashboardStats = () => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', company?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!company?.id) {
        return {
          cashBalance: 0,
          receivables: 0,
          monthlyRevenue: 0,
          monthlyProfit: 0,
          activeVehicles: 0,
          activeTrips: 0,
          pendingExpenses: 0,
          overdueInvoices: 0,
        };
      }
      
      // Get active vehicles count
      const { count: vehicleCount } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id)
        .eq('is_active', true);
      
      // Get active trips count
      const { count: tripCount } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id)
        .eq('status', 'in_transit');
      
      // Get pending expenses count
      const { count: expenseCount } = await supabase
        .from('expense_records')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id)
        .eq('status', 'PENDING');
      
      // Get overdue invoices count
      const today = new Date().toISOString().split('T')[0];
      const { count: overdueCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id)
        .eq('status', 'SENT')
        .lt('due_date', today);

      // Get receivables (unpaid invoices)
      const { data: unpaidInvoices } = await supabase
        .from('invoices')
        .select('total_amount')
        .eq('company_id', company.id)
        .in('status', ['SENT', 'VIEWED', 'OVERDUE']);
      
      const receivables = unpaidInvoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;

      // Get monthly revenue (completed trips this month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { data: paidInvoices } = await supabase
        .from('invoices')
        .select('total_amount')
        .eq('company_id', company.id)
        .eq('status', 'PAID')
        .gte('paid_at', startOfMonth.toISOString());
      
      const monthlyRevenue = paidInvoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;

      // Get monthly expenses
      const { data: monthlyExpenses } = await supabase
        .from('expense_records')
        .select('amount')
        .eq('company_id', company.id)
        .eq('status', 'APPROVED')
        .gte('expense_date', startOfMonth.toISOString().split('T')[0]);
      
      const totalExpenses = monthlyExpenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;

      return {
        cashBalance: 0, // Would need proper journal entry calculation
        receivables,
        monthlyRevenue,
        monthlyProfit: monthlyRevenue - totalExpenses,
        activeVehicles: vehicleCount || 0,
        activeTrips: tripCount || 0,
        pendingExpenses: expenseCount || 0,
        overdueInvoices: overdueCount || 0,
      };
    },
    enabled: !!company?.id,
  });
};

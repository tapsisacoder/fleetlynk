import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Financial Event Types
export type FinancialEventType = 
  | 'INVOICE_ISSUED'
  | 'CUSTOMER_PAYMENT'
  | 'OPERATING_EXPENSE'
  | 'WORKSHOP_EXPENSE'
  | 'INVENTORY_ISSUE'
  | 'SUPPLIER_PAYMENT'
  | 'OPENING_BALANCE'
  | 'ADJUSTMENT'
  | 'REVERSAL'
  | 'CUSTOM'
  | 'FUEL_PURCHASE'
  | 'TRIP_BOOKOUT';

export type FinancialDirection = 'IN' | 'OUT';

export type FinancialCategory = 
  | 'REVENUE'
  | 'COST_OF_SALES'
  | 'OPERATING_EXPENSE'
  | 'FUEL'
  | 'MAINTENANCE'
  | 'INVENTORY'
  | 'PAYROLL'
  | 'ADMIN'
  | 'OTHER';

export type FinancialSourceModule = 
  | 'TRIPS'
  | 'PAYMENTS'
  | 'WORKSHOP'
  | 'STOREROOM'
  | 'ADMIN'
  | 'MIGRATION'
  | 'FUEL';

export interface FinancialEvent {
  event_id: string;
  company_id: string;
  event_date: string;
  event_type: FinancialEventType;
  amount: number;
  direction: FinancialDirection;
  category: FinancialCategory;
  source_module: FinancialSourceModule;
  reference_id: string | null;
  invoice_id: string | null;
  client_id: string | null;
  supplier_id: string | null;
  vehicle_id: string | null;
  driver_id: string | null;
  trip_id: string | null;
  notes: string | null;
  created_at: string;
  created_by_type: 'USER' | 'SYSTEM' | 'AI';
  created_by_user: string | null;
  reversal_of_event_id: string | null;
  metadata: Record<string, unknown>;
}

export interface FinancialEventInsert {
  event_date?: string;
  event_type: FinancialEventType;
  amount: number;
  direction: FinancialDirection;
  category: FinancialCategory;
  source_module: FinancialSourceModule;
  reference_id?: string;
  invoice_id?: string;
  client_id?: string;
  supplier_id?: string;
  vehicle_id?: string;
  driver_id?: string;
  trip_id?: string;
  notes?: string;
  created_by_type?: 'USER' | 'SYSTEM' | 'AI';
  reversal_of_event_id?: string;
  metadata?: Record<string, unknown>;
}

// Fetch all financial events
export const useFinancialEvents = (limit = 100) => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['financial-events', company?.id, limit],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('financial_events')
        .select('*')
        .eq('company_id', company.id)
        .order('event_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as FinancialEvent[];
    },
    enabled: !!company?.id,
  });
};

// Create a financial event
export const useCreateFinancialEvent = () => {
  const queryClient = useQueryClient();
  const { company, user } = useAuth();

  return useMutation({
    mutationFn: async (event: FinancialEventInsert) => {
      if (!company?.id) throw new Error('No company found');
      
      // Create the insert payload - using any to bypass strict typing until types are regenerated
      const insertPayload = {
        event_date: event.event_date || new Date().toISOString().split('T')[0],
        event_type: event.event_type,
        amount: event.amount,
        direction: event.direction,
        category: event.category,
        source_module: event.source_module,
        company_id: company.id,
        reference_id: event.reference_id || null,
        invoice_id: event.invoice_id || null,
        client_id: event.client_id || null,
        supplier_id: event.supplier_id || null,
        vehicle_id: event.vehicle_id || null,
        driver_id: event.driver_id || null,
        trip_id: event.trip_id || null,
        notes: event.notes || null,
        created_by_type: event.created_by_type || 'USER',
        created_by_user: user?.id || null,
        reversal_of_event_id: event.reversal_of_event_id || null,
        metadata: event.metadata || {},
      };
      
      const { data, error } = await supabase
        .from('financial_events')
        .insert(insertPayload as any)
        .select()
        .single();
      
      if (error) throw error;
      return data as FinancialEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-events'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
    },
  });
};

// Get financial summary for reports
export const useFinancialSummary = (startDate?: string, endDate?: string) => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['financial-summary', company?.id, startDate, endDate],
    queryFn: async () => {
      if (!company?.id) return null;
      
      // Build query with filters
      let queryBuilder = supabase
        .from('financial_events')
        .select('*');
      
      // Apply company filter
      queryBuilder = queryBuilder.eq('company_id', company.id);
      
      if (startDate) {
        queryBuilder = queryBuilder.gte('event_date', startDate);
      }
      if (endDate) {
        queryBuilder = queryBuilder.lte('event_date', endDate);
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      
      // Calculate summary from events
      const events = data as FinancialEvent[];
      
      const totalIncome = events
        .filter(e => e.direction === 'IN')
        .reduce((sum, e) => sum + Number(e.amount), 0);
      
      const totalExpenses = events
        .filter(e => e.direction === 'OUT')
        .reduce((sum, e) => sum + Number(e.amount), 0);
      
      const invoiced = events
        .filter(e => e.event_type === 'INVOICE_ISSUED')
        .reduce((sum, e) => sum + Number(e.amount), 0);
      
      const paymentsReceived = events
        .filter(e => e.event_type === 'CUSTOMER_PAYMENT')
        .reduce((sum, e) => sum + Number(e.amount), 0);
      
      const fuelExpenses = events
        .filter(e => e.category === 'FUEL' && e.direction === 'OUT')
        .reduce((sum, e) => sum + Number(e.amount), 0);
      
      const maintenanceExpenses = events
        .filter(e => e.category === 'MAINTENANCE' && e.direction === 'OUT')
        .reduce((sum, e) => sum + Number(e.amount), 0);
      
      return {
        totalIncome,
        totalExpenses,
        netCashflow: totalIncome - totalExpenses,
        invoiced,
        paymentsReceived,
        accountsReceivable: invoiced - paymentsReceived,
        fuelExpenses,
        maintenanceExpenses,
        profit: totalIncome - totalExpenses,
      };
    },
    enabled: !!company?.id,
  });
};

// Get client balances
export const useClientBalances = () => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['client-balances', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('client_balances')
        .select('*')
        .eq('company_id', company.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id,
  });
};

// Get invoice payment status
export const useInvoicePaymentStatus = (invoiceId?: string) => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['invoice-payment-status', company?.id, invoiceId],
    queryFn: async () => {
      if (!company?.id) return null;
      
      let query = supabase
        .from('invoice_payment_status')
        .select('*')
        .eq('company_id', company.id);
      
      if (invoiceId) {
        query = query.eq('invoice_id', invoiceId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return invoiceId ? data[0] : data;
    },
    enabled: !!company?.id,
  });
};

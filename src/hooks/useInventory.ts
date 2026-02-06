import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface InventoryItem {
  id: string;
  company_id: string;
  part_number: string;
  name: string;
  description: string | null;
  category: string | null;
  quantity: number;
  min_stock_level: number;
  unit_cost: number;
  location: string | null;
  supplier: string | null;
  is_active: boolean;
  last_restocked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryInsert {
  part_number: string;
  name: string;
  description?: string;
  category?: string;
  quantity?: number;
  min_stock_level?: number;
  unit_cost?: number;
  location?: string;
  supplier?: string;
}

export const useInventoryItems = () => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['inventory-items', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('company_id', company.id)
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as InventoryItem[];
    },
    enabled: !!company?.id,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  const { company } = useAuth();

  return useMutation({
    mutationFn: async (item: InventoryInsert) => {
      if (!company?.id) throw new Error('No company found');
      
      const { data, error } = await supabase
        .from('inventory_items')
        .insert({ ...item, company_id: company.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<InventoryItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inventory_items')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    },
  });
};

// Stock In operation
export const useStockIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      // Get current quantity
      const { data: current, error: fetchError } = await supabase
        .from('inventory_items')
        .select('quantity')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      const newQuantity = (current?.quantity || 0) + quantity;
      
      const { data, error } = await supabase
        .from('inventory_items')
        .update({ 
          quantity: newQuantity,
          last_restocked_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    },
  });
};

// Stock Out operation
export const useStockOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      // Get current quantity
      const { data: current, error: fetchError } = await supabase
        .from('inventory_items')
        .select('quantity')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      const newQuantity = Math.max(0, (current?.quantity || 0) - quantity);
      
      const { data, error } = await supabase
        .from('inventory_items')
        .update({ quantity: newQuantity })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    },
  });
};

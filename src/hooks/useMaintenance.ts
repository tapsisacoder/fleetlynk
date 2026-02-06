import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MaintenanceRecord {
  id: string;
  company_id: string;
  vehicle_id: string | null;
  driver_id: string | null;
  service_type: string;
  service_category: string | null;
  description: string;
  service_date: string;
  odometer_reading: number | null;
  labor_cost: number;
  parts_cost: number;
  total_cost: number;
  parts_used: any[];
  performed_by: string | null;
  status: string;
  priority: string;
  notes: string | null;
  next_service_date: string | null;
  next_service_odometer: number | null;
  attachments: any[];
  created_at: string;
  updated_at: string;
}

export interface MaintenanceInsert {
  vehicle_id?: string;
  driver_id?: string;
  service_type: string;
  service_category?: string;
  description: string;
  service_date: string;
  odometer_reading?: number;
  labor_cost?: number;
  parts_cost?: number;
  total_cost?: number;
  parts_used?: any[];
  performed_by?: string;
  status?: string;
  priority?: string;
  notes?: string;
  next_service_date?: string;
  next_service_odometer?: number;
}

export const useMaintenanceRecords = () => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['maintenance-records', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('maintenance_records')
        .select(`
          *,
          vehicle:vehicles(registration_number, make, model)
        `)
        .eq('company_id', company.id)
        .order('service_date', { ascending: false });
      
      if (error) throw error;
      return data as (MaintenanceRecord & { vehicle: { registration_number: string; make: string | null; model: string | null } | null })[];
    },
    enabled: !!company?.id,
  });
};

export const useCreateMaintenance = () => {
  const queryClient = useQueryClient();
  const { company } = useAuth();

  return useMutation({
    mutationFn: async (record: MaintenanceInsert) => {
      if (!company?.id) throw new Error('No company found');
      
      // Calculate total cost
      const totalCost = (record.labor_cost || 0) + (record.parts_cost || 0);
      
      const { data, error } = await supabase
        .from('maintenance_records')
        .insert({ 
          ...record, 
          company_id: company.id,
          total_cost: totalCost
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-records'] });
    },
  });
};

export const useUpdateMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MaintenanceRecord> & { id: string }) => {
      // Recalculate total cost if labor or parts cost changed
      if (updates.labor_cost !== undefined || updates.parts_cost !== undefined) {
        updates.total_cost = (updates.labor_cost || 0) + (updates.parts_cost || 0);
      }
      
      const { data, error } = await supabase
        .from('maintenance_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-records'] });
    },
  });
};

export const useDeleteMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('maintenance_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-records'] });
    },
  });
};

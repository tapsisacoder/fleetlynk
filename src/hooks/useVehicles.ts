import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Vehicle {
  id: string;
  company_id: string;
  registration_number: string;
  make: string | null;
  model: string | null;
  engine_type: string | null;
  tank_capacity_liters: number;
  year: number | null;
  current_odometer: number;
  status: string;
  fuel_consumption_empty: number;
  fuel_consumption_loaded: number;
  insurance_expiry: string | null;
  license_expiry: string | null;
  roadworthy_expiry: string | null;
  is_active: boolean;
  created_at: string;
}

export interface VehicleInsert {
  registration_number: string;
  make?: string;
  model?: string;
  engine_type?: string;
  tank_capacity_liters?: number;
  year?: number;
  current_odometer?: number;
  status?: string;
  fuel_consumption_empty?: number;
  fuel_consumption_loaded?: number;
  insurance_expiry?: string;
  license_expiry?: string;
  roadworthy_expiry?: string;
}

export const useVehicles = () => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['vehicles', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('company_id', company.id)
        .eq('is_active', true)
        .order('registration_number');
      
      if (error) throw error;
      return data as Vehicle[];
    },
    enabled: !!company?.id,
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Vehicle;
    },
    enabled: !!id,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  const { company } = useAuth();

  return useMutation({
    mutationFn: async (vehicle: VehicleInsert) => {
      if (!company?.id) throw new Error('No company found');
      
      const { data, error } = await supabase
        .from('vehicles')
        .insert({ ...vehicle, company_id: company.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Vehicle> & { id: string }) => {
      const { data, error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vehicles')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Trip {
  id: string;
  company_id: string;
  trip_reference: string;
  vehicle_id: string | null;
  driver_id: string | null;
  client_id: string | null;
  origin: string;
  destination: string;
  distance_km: number | null;
  departure_date: string | null;
  eta: string | null;
  completed_at: string | null;
  fuel_allocated_liters: number | null;
  fuel_used_liters: number | null;
  load_status: string;
  cargo_description: string | null;
  rate: number | null;
  tonnage: number | null;
  status: string;
  progress_percent: number;
  start_odometer: number | null;
  end_odometer: number | null;
  trip_costs: number;
  toll_fees: number;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  // Joined data
  vehicle?: {
    registration_number: string;
    make: string | null;
    model: string | null;
  };
  driver?: {
    full_name: string;
  };
  client?: {
    name: string;
  };
}

export interface TripInsert {
  trip_reference: string;
  vehicle_id?: string;
  driver_id?: string;
  client_id?: string;
  origin: string;
  destination: string;
  distance_km?: number;
  departure_date?: string;
  eta?: string;
  fuel_allocated_liters?: number;
  load_status?: string;
  cargo_description?: string;
  rate?: number;
  tonnage?: number;
  status?: string;
  start_odometer?: number;
  trip_costs?: number;
  toll_fees?: number;
  notes?: string;
}

export const useTrips = (status?: string) => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['trips', company?.id, status],
    queryFn: async () => {
      if (!company?.id) return [];
      
      let query = supabase
        .from('trips')
        .select(`
          *,
          vehicle:vehicles(registration_number, make, model),
          driver:drivers(full_name),
          client:clients(name)
        `)
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Trip[];
    },
    enabled: !!company?.id,
  });
};

export const useActiveTrips = () => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['active-trips', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          vehicle:vehicles(registration_number, make, model),
          driver:drivers(full_name),
          client:clients(name)
        `)
        .eq('company_id', company.id)
        .eq('status', 'in_transit')
        .order('departure_date', { ascending: false });
      
      if (error) throw error;
      return data as Trip[];
    },
    enabled: !!company?.id,
  });
};

export const useTripHistory = () => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['trip-history', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          vehicle:vehicles(registration_number, make, model),
          driver:drivers(full_name),
          client:clients(name)
        `)
        .eq('company_id', company.id)
        .in('status', ['completed', 'cancelled'])
        .order('completed_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as Trip[];
    },
    enabled: !!company?.id,
  });
};

export const useTrip = (id: string) => {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          vehicle:vehicles(registration_number, make, model),
          driver:drivers(full_name),
          client:clients(name)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Trip;
    },
    enabled: !!id,
  });
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  const { company, user } = useAuth();

  return useMutation({
    mutationFn: async (trip: TripInsert) => {
      if (!company?.id) throw new Error('No company found');
      
      const { data, error } = await supabase
        .from('trips')
        .insert({ 
          ...trip, 
          company_id: company.id,
          created_by: user?.id 
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['active-trips'] });
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Trip> & { id: string }) => {
      const { data, error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['active-trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip-history'] });
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['active-trips'] });
    },
  });
};

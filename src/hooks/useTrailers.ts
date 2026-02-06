import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Trailer {
  id: string;
  company_id: string;
  registration_number: string;
  trailer_type: string;
  make: string | null;
  model: string | null;
  year: number | null;
  capacity_tons: number;
  length_meters: number | null;
  axle_count: number;
  license_expiry: string | null;
  roadworthy_expiry: string | null;
  insurance_expiry: string | null;
  status: string;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrailerInsert {
  registration_number: string;
  trailer_type?: string;
  make?: string;
  model?: string;
  year?: number;
  capacity_tons?: number;
  length_meters?: number;
  axle_count?: number;
  license_expiry?: string;
  roadworthy_expiry?: string;
  insurance_expiry?: string;
  status?: string;
  notes?: string;
}

export interface VehicleTrailer {
  id: string;
  company_id: string;
  vehicle_id: string;
  trailer_id: string;
  position: number;
  attached_at: string;
  detached_at: string | null;
  attached_by: string | null;
}

export const useTrailers = () => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['trailers', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('trailers')
        .select('*')
        .eq('company_id', company.id)
        .eq('is_active', true)
        .order('registration_number');
      
      if (error) throw error;
      return data as Trailer[];
    },
    enabled: !!company?.id,
  });
};

export const useCreateTrailer = () => {
  const queryClient = useQueryClient();
  const { company } = useAuth();

  return useMutation({
    mutationFn: async (trailer: TrailerInsert) => {
      if (!company?.id) throw new Error('No company found');
      
      const { data, error } = await supabase
        .from('trailers')
        .insert({ ...trailer, company_id: company.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trailers'] });
    },
  });
};

export const useUpdateTrailer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Trailer> & { id: string }) => {
      const { data, error } = await supabase
        .from('trailers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trailers'] });
    },
  });
};

export const useDeleteTrailer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('trailers')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trailers'] });
    },
  });
};

// Get active trailer attachments for a vehicle
export const useVehicleTrailers = (vehicleId?: string) => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['vehicle-trailers', vehicleId],
    queryFn: async () => {
      if (!company?.id || !vehicleId) return [];
      
      const { data, error } = await supabase
        .from('vehicle_trailers')
        .select(`
          *,
          trailer:trailers(*)
        `)
        .eq('company_id', company.id)
        .eq('vehicle_id', vehicleId)
        .is('detached_at', null)
        .order('position');
      
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id && !!vehicleId,
  });
};

// Attach trailer to vehicle
export const useAttachTrailer = () => {
  const queryClient = useQueryClient();
  const { company, user } = useAuth();

  return useMutation({
    mutationFn: async ({ vehicleId, trailerId, position }: { vehicleId: string; trailerId: string; position: number }) => {
      if (!company?.id) throw new Error('No company found');
      
      // First check if vehicle already has 2 trailers
      const { data: existing, error: checkError } = await supabase
        .from('vehicle_trailers')
        .select('id')
        .eq('vehicle_id', vehicleId)
        .is('detached_at', null);
      
      if (checkError) throw checkError;
      if (existing && existing.length >= 2) {
        throw new Error('Vehicle already has 2 trailers attached');
      }
      
      // Check if trailer is already attached to another vehicle
      const { data: trailerInUse, error: trailerCheckError } = await supabase
        .from('vehicle_trailers')
        .select('id')
        .eq('trailer_id', trailerId)
        .is('detached_at', null);
      
      if (trailerCheckError) throw trailerCheckError;
      if (trailerInUse && trailerInUse.length > 0) {
        throw new Error('Trailer is already attached to another vehicle');
      }
      
      const { data, error } = await supabase
        .from('vehicle_trailers')
        .insert({
          company_id: company.id,
          vehicle_id: vehicleId,
          trailer_id: trailerId,
          position,
          attached_by: user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update trailer status
      await supabase
        .from('trailers')
        .update({ status: 'in_use' })
        .eq('id', trailerId);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-trailers'] });
      queryClient.invalidateQueries({ queryKey: ['trailers'] });
    },
  });
};

// Detach trailer from vehicle
export const useDetachTrailer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ attachmentId, trailerId }: { attachmentId: string; trailerId: string }) => {
      const { error } = await supabase
        .from('vehicle_trailers')
        .update({ detached_at: new Date().toISOString() })
        .eq('id', attachmentId);
      
      if (error) throw error;
      
      // Update trailer status back to available
      await supabase
        .from('trailers')
        .update({ status: 'available' })
        .eq('id', trailerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-trailers'] });
      queryClient.invalidateQueries({ queryKey: ['trailers'] });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DriverVehicleAssignment {
  id: string;
  company_id: string;
  driver_id: string;
  vehicle_id: string;
  assigned_at: string;
  unassigned_at: string | null;
  assigned_by: string | null;
  driver?: {
    id: string;
    full_name: string;
    phone: string | null;
    license_number: string | null;
  };
  vehicle?: {
    id: string;
    registration_number: string;
    make: string | null;
    model: string | null;
  };
}

// Get all active driver assignments for a vehicle
export const useVehicleDrivers = (vehicleId?: string) => {
  return useQuery({
    queryKey: ['vehicle-drivers', vehicleId],
    queryFn: async () => {
      if (!vehicleId) return [];
      
      const { data, error } = await supabase
        .from('driver_vehicle_assignments')
        .select(`
          *,
          driver:drivers(id, full_name, phone, license_number)
        `)
        .eq('vehicle_id', vehicleId)
        .is('unassigned_at', null);
      
      if (error) throw error;
      return data as DriverVehicleAssignment[];
    },
    enabled: !!vehicleId,
  });
};

// Get all driver assignments for a company
export const useDriverAssignments = () => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['driver-assignments', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('driver_vehicle_assignments')
        .select(`
          *,
          driver:drivers(id, full_name, phone, license_number),
          vehicle:vehicles(id, registration_number, make, model)
        `)
        .eq('company_id', company.id)
        .is('unassigned_at', null);
      
      if (error) throw error;
      return data as DriverVehicleAssignment[];
    },
    enabled: !!company?.id,
  });
};

// Assign driver to vehicle
export const useAssignDriver = () => {
  const queryClient = useQueryClient();
  const { company, user } = useAuth();

  return useMutation({
    mutationFn: async ({ driverId, vehicleId }: { driverId: string; vehicleId: string }) => {
      if (!company?.id) throw new Error('No company found');
      
      const { data, error } = await supabase
        .from('driver_vehicle_assignments')
        .insert({
          company_id: company.id,
          driver_id: driverId,
          vehicle_id: vehicleId,
          assigned_by: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['driver-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-drivers', variables.vehicleId] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });
};

// Unassign driver from vehicle
export const useUnassignDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assignmentId, vehicleId }: { assignmentId: string; vehicleId: string }) => {
      const { data, error } = await supabase
        .from('driver_vehicle_assignments')
        .update({ unassigned_at: new Date().toISOString() })
        .eq('id', assignmentId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['driver-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-drivers', variables.vehicleId] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });
};

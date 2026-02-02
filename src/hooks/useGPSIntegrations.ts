import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Json } from '@/integrations/supabase/types';

export interface GPSIntegration {
  id: string;
  company_id: string;
  provider_name: string;
  api_url: string;
  api_key: string;
  api_secret: string | null;
  additional_config: Json;
  is_active: boolean;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GPSIntegrationInsert {
  provider_name: string;
  api_url: string;
  api_key: string;
  api_secret?: string;
  additional_config?: Json;
  is_active?: boolean;
}

export const useGPSIntegrations = () => {
  const { company } = useAuth();

  return useQuery({
    queryKey: ['gps-integrations', company?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gps_integrations')
        .select('*')
        .order('provider_name');

      if (error) throw error;
      return data as GPSIntegration[];
    },
    enabled: !!company?.id,
  });
};

export const useCreateGPSIntegration = () => {
  const queryClient = useQueryClient();
  const { company } = useAuth();

  return useMutation({
    mutationFn: async (integration: GPSIntegrationInsert) => {
      if (!company?.id) throw new Error('No company found');
      
      const { data, error } = await supabase
        .from('gps_integrations')
        .insert({
          provider_name: integration.provider_name,
          api_url: integration.api_url,
          api_key: integration.api_key,
          api_secret: integration.api_secret,
          additional_config: integration.additional_config ?? {},
          is_active: integration.is_active ?? true,
          company_id: company.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gps-integrations'] });
    },
  });
};

export const useUpdateGPSIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; provider_name?: string; api_url?: string; api_key?: string; api_secret?: string; is_active?: boolean }) => {
      const { data, error } = await supabase
        .from('gps_integrations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gps-integrations'] });
    },
  });
};

export const useDeleteGPSIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gps_integrations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gps-integrations'] });
    },
  });
};

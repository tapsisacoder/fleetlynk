-- Fix: Drop the constraint first before dropping the index
ALTER TABLE vehicle_trailers DROP CONSTRAINT IF EXISTS unique_active_attachment;

-- Now create proper partial unique indexes for active attachments only
-- This allows reattaching previously detached trailers
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_vehicle_trailer 
ON vehicle_trailers (vehicle_id, trailer_id) 
WHERE detached_at IS NULL;

-- Ensure a trailer can only be attached to one vehicle at a time
CREATE UNIQUE INDEX IF NOT EXISTS unique_trailer_active 
ON vehicle_trailers (trailer_id) 
WHERE detached_at IS NULL;

-- Add current_fuel_level column to vehicles for fuel tank tracking
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS current_fuel_level numeric DEFAULT 0;

-- Add passport_number column to drivers
ALTER TABLE public.drivers 
ADD COLUMN IF NOT EXISTS passport_number character varying;
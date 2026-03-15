-- Add optional direct Google Maps URL for deterministic dealer map opening

ALTER TABLE public.dealers
ADD COLUMN IF NOT EXISTS google_maps_url text;

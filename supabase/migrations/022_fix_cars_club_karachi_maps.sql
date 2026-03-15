-- Ensure existing Karachi dealer record uses exact Google Maps place and coordinates

UPDATE public.dealers
SET
  name = 'Cars Club Karachi',
  address = 'Cars Club, Karachi, Sindh, Pakistan',
  google_maps_url = 'https://maps.app.goo.gl/nGS2d2VGz4XBSpXa9',
  lat = 24.880096,
  lng = 67.0494029
WHERE city = 'Karachi'
  AND (
    name ILIKE '%Car Club%'
    OR name ILIKE '%Cars Club%'
    OR phone = '0321-2993103'
  );

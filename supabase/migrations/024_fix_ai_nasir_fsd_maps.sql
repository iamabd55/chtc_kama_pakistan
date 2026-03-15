-- Set Al Nasir Motors FSD to road-level location until exact showroom pin is confirmed

UPDATE public.dealers
SET
  name = 'Al Nasir Motors FSD',
  address = 'W Canal Rd, Faisalabad, Punjab, Pakistan',
  google_maps_url = 'https://www.google.com/maps/place/W+Canal+Rd,+Faisalabad,+Pakistan/@31.4444952,73.1359687,17z/data=!3m1!4b1!4m6!3m5!1s0x39226859d8ed0a33:0x7c2149170243125f!8m2!3d31.4444906!4d73.1385436!16s%2Fg%2F1tdzjyy2?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D',
  lat = 31.4444906,
  lng = 73.1385436
WHERE city = 'Faisalabad'
  AND (
    name ILIKE '%Nasir%'
    OR phone = '0322-6038503'
  );

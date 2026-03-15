-- Ensure existing Rawalpindi record is corrected even if initial seed already ran

UPDATE public.dealers
SET
  name = 'JMC Rawalpindi Motors',
  address = 'plot 5, main Service Rd ( I 10), I-11/4 I 11/4 I-11, Islamabad, 44000, Pakistan',
  google_maps_url = 'https://www.google.com/maps/place/JMC+Rawalpindi+Motors/@33.633399,73.0247758,17z/data=!3m1!4b1!4m6!3m5!1s0x38dff19082fbf699:0x848ac16cb7f60601!8m2!3d33.6333946!4d73.0273507!16s%2Fg%2F11pd2ftycr?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D',
  lat = 33.6333946,
  lng = 73.0273507
WHERE city = 'Rawalpindi'
  AND (
    name ILIKE '%Rawalpindi Motors%'
    OR phone = '0333-5466292'
  );

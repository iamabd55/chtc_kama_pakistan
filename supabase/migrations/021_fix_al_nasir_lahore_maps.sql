-- Ensure existing Lahore dealer record uses exact Google Maps place and coordinates

UPDATE public.dealers
SET
  name = 'Al Nasir Motors Lahore',
  address = 'Hino Lahore Central Motors (Pvt) Ltd, Lahore, Punjab, Pakistan',
  google_maps_url = 'https://www.google.com/maps/place/Hino+Lahore+Central+Motors+(Pvt)+Ltd/@31.4363534,74.1855552,17z/data=!4m14!1m7!3m6!1s0x3918fe6befbeb3bb:0x5a3d24b4a4b4db06!2sHinopak+Motors+Ltd+Area+Company+Office!8m2!3d31.4363488!4d74.1881301!16s%2Fg%2F11xc_vd6j!3m5!1s0x3918fe6969279e8f:0x2e9b688a006bf867!8m2!3d31.4357089!4d74.187767!16s%2Fg%2F11hctg1z5y?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D',
  lat = 31.4357089,
  lng = 74.187767
WHERE city = 'Lahore'
  AND (
    name ILIKE '%Al Nasir%'
    OR phone = '0300-8665060'
  );

-- Ensure existing Multan dealer record uses exact Google Maps place and coordinates

UPDATE public.dealers
SET
  name = 'Abdullah Multan Motors',
  address = 'Abdullah Multan Motors, Khanewal Road, Multan, Punjab, Pakistan',
  google_maps_url = 'https://www.google.com/maps/place/Abdullah+Multan+Motors/@30.2151262,71.5247099,17.01z/data=!4m15!1m8!3m7!1s0x393b33ef15273a23:0x6882bc6f3928a7d4!2sKhanewal+Rd,+Multan,+Pakistan!3b1!8m2!3d30.210322!4d71.4864768!16s%2Fm%2F0w_21fv!3m5!1s0x393b3506b2c90189:0x8e87f5acc5fe32c1!8m2!3d30.2139784!4d71.5301415!16s%2Fg%2F11t0731lv9?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D',
  lat = 30.2139784,
  lng = 71.5301415
WHERE city = 'Multan'
  AND (
    name ILIKE '%Abdullah%'
    OR phone = '0302-7436275'
  );

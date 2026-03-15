-- Seed initial dealer records from provided dealership banner list
-- City-level coordinates are included to enable map links and can be refined later

INSERT INTO public.dealers (
  name,
  city,
  province,
  address,
  phone,
  whatsapp,
  email,
  lat,
  lng,
  dealer_type,
  brands,
  working_hours,
  is_active
)
SELECT
  v.name,
  v.city,
  v.province,
  v.address,
  v.phone,
  v.whatsapp,
  v.email,
  v.lat,
  v.lng,
  v.dealer_type,
  v.brands,
  v.working_hours,
  true
FROM (
  VALUES
    (
      'AI Nasir Motors FSD',
      'Faisalabad',
      'Punjab',
      'W Canal Rd, Faisalabad, Punjab, Pakistan',
      '0322-6038503',
      '0322-6038503',
      NULL,
      31.4444906,
      73.1385436,
      'both',
      ARRAY['kama', 'kinwin', 'chtc']::text[],
      NULL
    ),
    (
      'JMC Rawalpindi Motors',
      'Rawalpindi',
      'Punjab',
      'JMC Rawalpindi Motors, Rawalpindi, Punjab, Pakistan',
      '0333-5466292',
      '0333-5466292',
      NULL,
      33.6333946,
      73.0273507,
      'both',
      ARRAY['kama', 'kinwin', 'chtc']::text[],
      NULL
    ),
    (
      'Cars Club Karachi',
      'Karachi',
      'Sindh',
      'Cars Club, Karachi, Sindh, Pakistan',
      '0321-2993103',
      '0321-2993103',
      NULL,
      24.880096,
      67.0494029,
      'both',
      ARRAY['kama', 'kinwin', 'chtc']::text[],
      NULL
    ),
    (
      'Abdullah Multan Motors',
      'Multan',
      'Punjab',
      'Abdullah Multan Motors, Khanewal Road, Multan, Punjab, Pakistan',
      '0302-7436275',
      '0302-7436275',
      NULL,
      30.2139784,
      71.5301415,
      'both',
      ARRAY['kama', 'kinwin', 'chtc']::text[],
      NULL
    ),
    (
      'Al Nasir Motors Lahore',
      'Lahore',
      'Punjab',
      'Hino Lahore Central Motors (Pvt) Ltd, Lahore, Punjab, Pakistan',
      '0300-8665060',
      '0300-8665060',
      NULL,
      31.4357089,
      74.187767,
      'both',
      ARRAY['kama', 'kinwin', 'chtc']::text[],
      NULL
    )
) AS v(
  name,
  city,
  province,
  address,
  phone,
  whatsapp,
  email,
  lat,
  lng,
  dealer_type,
  brands,
  working_hours
)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.dealers d
  WHERE d.name = v.name
    AND d.city = v.city
);

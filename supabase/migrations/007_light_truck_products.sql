-- ══════════════════════════════════════════════════════
-- Light Truck Products — M1, M3, M6, K Series
-- Run AFTER 006_mini_truck_products.sql
-- NOTE: Upload product images to Supabase Storage:
--   images/products/m1-series/m1-series-main.png
--   images/products/m3-series/m3-series-main.png
--   images/products/m6-series/m6-series-main.png
--   images/products/k-series/k-series-main.png
-- ══════════════════════════════════════════════════════

-- ──────────────────────────────────────
-- M1 SERIES
-- ──────────────────────────────────────
INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'M1 Series',
  'm1-series',
  'kama',
  id,
  'M1 series — 1760mm width cabin light trucks. Loading capacity from 2 to 3.5 tons. Powered by ISUZU engine with classic, safety-stable cab design.',
  2024,
  'products/m1-series/m1-series-main.png',
  ARRAY[
    'products/m1-series/m1-series-1.png',
    'products/m1-series/m1-series-2.png'
  ],
  '{
    "Cabin Width": "1760mm",
    "Fuel Type": "Gasoline / Diesel",
    "Emission Standard": "Euro IV / Euro V",
    "Suggested Payload": "2.5T – 3.5T",
    "Wheelbase Options (mm)": "2550 / 2800 / 2860 / 3100",
    "Engine Models": "JM4P0-ME(JM), JE4932L034(ISUZU), JE4932L034(ISUZU), WP2.3Q1DE50W(WEICHAI)",
    "Engine Displacement (cc)": "2257 / 2771 / 2240",
    "Engine Power (kW/rpm)": "76/4200 – 90/3200",
    "Max Torque (N.m/rpm)": "195/2600 – 350/1600-2400",
    "Max Speed (km/h)": "95 – 100",
    "GVW (kg)": "4280 – 5850",
    "Curb Weight (kg)": "2020 – 2560",
    "Cargo Box Size (mm)": "3720×1760×400 – 4000×1800×400",
    "Brake System": "Hydraulic / Air brake",
    "Parking Brake": "Central drum / Spring energy air cut",
    "Gearshift": "5+1 / 6+1 speed, manual",
    "Tyre Model": "6.50R16LT / 7.00R16LT",
    "Battery Volt": "12V / 24V",
    "ABS": "Standard",
    "Power Steering": "Standard",
    "Media": "MP5",
    "A/C": "Standard",
    "Power Window": "Standard",
    "Central Lock": "Standard",
    "Variants": "M11D, M15C, M16C, M16D, M18E, M19E"
  }'::jsonb,
  ARRAY[
    'Loading capacity from 2 tons to 3.5 tons',
    'Classic cab exterior and interior design with safety-stable structure',
    'Excellent chassis layout design with ISUZU engine power',
    'Available in gasoline and diesel fuel types',
    'RHD (Right-Hand Drive) option available'
  ],
  'Contact for Price',
  true,
  true
FROM categories WHERE slug = 'light-truck';

-- ──────────────────────────────────────
-- M3 SERIES
-- ──────────────────────────────────────
INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'M3 Series',
  'm3-series',
  'kama',
  id,
  'M3 series — 1900mm width cabin light trucks. Loading capacity from 2 to 4.5 tons. ISUZU, WEICHAI and YUCHAI engine options with heavy load stability.',
  2024,
  'products/m3-series/m3-series-main.png',
  ARRAY[
    'products/m3-series/m3-series-1.png',
    'products/m3-series/m3-series-2.png'
  ],
  '{
    "Cabin Width": "1900mm",
    "Fuel Type": "Gasoline / CNG / Diesel",
    "Emission Standard": "Euro IV / Euro V / Euro VI",
    "Suggested Payload": "3T – 5.5T",
    "Wheelbase Options (mm)": "3300 / 3360",
    "Engine Models": "JM4P10-MEIJM), N25C, JE4932L034(ISUZU), YC4FA20-130(YUCHAI)",
    "Engine Displacement (cc)": "2457 / 2476 / 2771 / 2982",
    "Engine Power (kW/rpm)": "68/5400 – 101/3200",
    "Max Torque (N.m/rpm)": "193/2800-5200 – 345/1800-2200",
    "Max Speed (km/h)": "100",
    "GVW (kg)": "5280 – 7110",
    "Curb Weight (kg)": "2280 – 3130",
    "Cargo Box Size (mm)": "4160×1770×400 – 4160×1770×400",
    "Brake System": "Hydraulic / Air brake",
    "Parking Brake": "Central drum / Spring energy air cut",
    "Gearshift": "5+1 / 6+1 speed, manual",
    "Tyre Model": "7.00R16LT / 7.50R16LT",
    "Battery Volt": "12V / 24V",
    "ABS": "Standard",
    "Power Steering": "Standard",
    "Media": "MP5",
    "A/C": "Standard",
    "Power Window": "Standard",
    "Central Lock": "Standard",
    "Variants": "M3I, M35CNG, M36C, M36F, M37E, M39B"
  }'::jsonb,
  ARRAY[
    'Loading capacity from 2 tons to 4.5 tons',
    'Upgraded new interior with shock-absorbing seat option',
    'Strong load-bearing capacity with stability chassis design',
    'ISUZU, WEICHAI, YUCHAI engine options',
    'RHD (Right-Hand Drive) option available'
  ],
  'Contact for Price',
  true,
  true
FROM categories WHERE slug = 'light-truck';

-- ──────────────────────────────────────
-- M6 SERIES
-- ──────────────────────────────────────
INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'M6 Series',
  'm6-series',
  'kama',
  id,
  'M6 series — 2030mm width heavy light trucks. Payload from 5.5T to 10T. Features YUCHAI and ISUZU engines with ECE certification and ESC, ABS, LDWS safety.',
  2024,
  'products/m6-series/m6-series-main.png',
  ARRAY[
    'products/m6-series/m6-series-1.png',
    'products/m6-series/m6-series-2.png'
  ],
  '{
    "Cabin Width": "2030mm",
    "Fuel Type": "Gasoline / Diesel",
    "Emission Standard": "Euro IV / Euro II",
    "Suggested Payload": "5.5T – 10T",
    "Wheelbase Options (mm)": "3815 / 4200 / 4500 / 4800",
    "Engine Models": "G4BA(XE), YC4FA20-33(YUCHAI), YC4F30-50(YUCHAI), YC4S60-50(YUCHAI), 4HK1-TC6(ISUZU)",
    "Engine Displacement (cc)": "2693 / 2982 / 4190 / 5767 / 5193",
    "Engine Power (kW/rpm)": "88/5200 – 150/2600",
    "Max Torque (N.m/rpm)": "253/1000-2200 – 650/1500-1800",
    "Max Speed (km/h)": "95 – 105",
    "GVW (kg)": "6320 – 14870",
    "Curb Weight (kg)": "4200 – 7170",
    "Cargo Box Size (mm)": "5060×2100×450 – 5660×2300×550",
    "Brake System": "Hydraulic / Air brake",
    "Parking Brake": "Central drum / Spring energy air cut",
    "Gearshift": "5+1 / 8+2 speed, manual",
    "Tyre Model": "7.50R16LT / 8.25R16LT / 9.00R20 / 10.00R20",
    "Battery Volt": "12V / 24V",
    "ABS": "Standard",
    "ESC": "Standard on select models",
    "LDWS": "Standard on select models",
    "Power Steering": "Standard",
    "Media": "MP5",
    "A/C": "Standard",
    "Power Window": "Standard",
    "Central Lock": "Standard",
    "Variants": "M60, M66B, M67B, M68E, M69E"
  }'::jsonb,
  ARRAY[
    'Spacious and comfortable driving space with active and passive safety design',
    'Reliable chassis tuning ensures heavy load stability',
    'ECE certified with ESC, ABS and LDWS safety systems',
    'YUCHAI and ISUZU engine options — 5.5T to 10T payload capacity',
    'RHD (Right-Hand Drive) option available'
  ],
  'Contact for Price',
  false,
  true
FROM categories WHERE slug = 'light-truck';

-- ──────────────────────────────────────
-- K SERIES
-- ──────────────────────────────────────
INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'K Series',
  'k-series',
  'kama',
  id,
  'K series — 1580mm–1680mm cabin width light trucks. Upgraded classic 100P cab design with significant cost advantage. Same chassis design as M1 series.',
  2024,
  'products/k-series/k-series-main.png',
  ARRAY[
    'products/k-series/k-series-1.png',
    'products/k-series/k-series-2.png'
  ],
  '{
    "Cabin Width": "1580mm (K5) / 1680mm (K6)",
    "Fuel Type": "Diesel / Gasoline",
    "Emission Standard": "Euro I / Euro II / Euro III / Euro V",
    "Suggested Payload": "2T – 3T",
    "Wheelbase Options (mm)": "2600 / 2800",
    "Engine Models": "D1YTCE1(YUNNEI), JE4932L034(ISUZU), JE4932L034(ISUZU), YN4100QT(YUNNEI), YC4FA20-33(YUCHAI)",
    "Engine Displacement (cc)": "1900 / 2271 / 2982",
    "Engine Power (kW/rpm)": "57/5600 – 88/5200",
    "Max Torque (N.m/rpm)": "250/600-2600 – 545/800-2200",
    "Max Speed (km/h)": "90",
    "GVW (kg)": "4280 – 4760",
    "Curb Weight (kg)": "2260 – 2520",
    "Cargo Box Size (mm)": "3980×1800×350 – 5420×1800×520",
    "Brake System": "Hydraulic brake",
    "Parking Brake": "Central drum / Spring energy air cut",
    "Gearshift": "5+1 speed, manual",
    "Tyre Model": "6.00R16LT / 6.50R16LT / 7.50R16LT",
    "Battery Volt": "12V / 24V",
    "Power Steering": "Standard",
    "Media": "MP5",
    "A/C": "Standard",
    "Power Window": "Standard",
    "Central Lock": "Standard",
    "Variants": "GK5E8, K66A, K67B, K68B, K98"
  }'::jsonb,
  ARRAY[
    'Upgraded and improved on the classic 100P cab design',
    'Significant cost advantage with stable quality',
    'Same robust chassis design as M1 series',
    'Diesel and gasoline fuel type options',
    'RHD (Right-Hand Drive) option available'
  ],
  'Contact for Price',
  false,
  true
FROM categories WHERE slug = 'light-truck';

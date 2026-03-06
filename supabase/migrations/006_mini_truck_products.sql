-- ══════════════════════════════════════════════════════
-- Mini Truck Products — W, X, V, S Series
-- Run AFTER 001_initial_schema.sql and 002_real_categories.sql
-- NOTE: Upload product images to Supabase Storage:
--   images/products/w-series/w-series-main.png
--   images/products/x-series/x-series-main.png
--   images/products/v-series/v-series-main.png
--   images/products/s-series/s-series-main.png
-- Then update the thumbnail column to reflect real paths.
-- ══════════════════════════════════════════════════════

INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)

-- ──────────────────────────────────────
-- W SERIES
-- ──────────────────────────────────────
SELECT
  'W Series',
  'w-series',
  'kama',
  id,
  'W series — 1600mm width cabin mini trucks. Available in gasoline and CNG. Volume sales model with the most cost-efficient performance.',
  2024,
  'products/w-series/w-series-main.png',
  ARRAY[
    'products/w-series/w-series-1.png',
    'products/w-series/w-series-2.png'
  ],
  '{
    "Cabin Width": "1600mm",
    "Fuel Type": "Gasoline / CNG",
    "Emission Standard": "Euro V / Euro VI",
    "Suggested Payload": "1T – 1.5T",
    "Wheelbase Options (mm)": "2500 / 2700 / 3300 / 3600",
    "Engine Displacement (cc)": "1249 / 1590",
    "Engine Power (kW/rpm)": "61/6000 — 91/6000",
    "Max Torque (N.m/rpm)": "113/3500-4400 — 161/3750-4250",
    "Max Speed (km/h)": "100",
    "GVW (kg)": "2260 – 3040",
    "Curb Weight (kg)": "1260 – 1540",
    "Brake System": "Hydraulic brake",
    "Gearshift": "5+1 speed, manual",
    "Tyre Model": "175R14LT / 185R14LT",
    "Battery Volt": "12V",
    "ABS": "Standard",
    "Power Steering": "Standard",
    "A/C": "Standard",
    "Power Window": "Standard",
    "Central Lock": "Standard",
    "Variants": "W11, W12, W13S, W21, W23S"
  }'::jsonb,
  ARRAY[
    'New upgraded interior decoration',
    'Non-independent suspension with strong loading capacity',
    'ESC and dual airbags available as option',
    'Volume sales model — most cost-efficient in class',
    'RHD (Right-Hand Drive) option available'
  ],
  'Contact for Price',
  true,
  true
FROM categories WHERE slug = 'mini-truck';

-- ──────────────────────────────────────
-- X SERIES
-- ──────────────────────────────────────
INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'X Series',
  'x-series',
  'kama',
  id,
  'X series — 1750mm width cabin mini trucks. Available in gasoline, CNG and diesel. Designed with 2.5T light truck rear axle for high loading capacity.',
  2024,
  'products/x-series/x-series-main.png',
  ARRAY[
    'products/x-series/x-series-1.png',
    'products/x-series/x-series-2.png'
  ],
  '{
    "Cabin Width": "1750mm",
    "Fuel Type": "Gasoline / CNG / Diesel",
    "Emission Standard": "Euro VI",
    "Suggested Payload": "2T – 2.5T",
    "Wheelbase Options (mm)": "2900 / 3180 / 2650 / 2850",
    "Engine Displacement (cc)": "1962 / 2771",
    "Engine Power (kW/rpm)": "90/5400 — 81/3400",
    "Max Torque (N.m/rpm)": "172/1600-4400 — 280/1600-2400",
    "Max Speed (km/h)": "100",
    "GVW (kg)": "3980 – 4600",
    "Curb Weight (kg)": "2040 – 2120",
    "Brake System": "Hydraulic brake",
    "Gearshift": "5+1 speed, manual",
    "Tyre Model": "185R14LT / 195R14LT",
    "Battery Volt": "12V / 24V",
    "ABS": "Standard / ESC optional",
    "Power Steering": "Standard",
    "A/C": "Standard",
    "Power Window": "Standard",
    "Central Lock": "Standard",
    "Variants": "X11, X12CNG, X31C, X32D, X33E"
  }'::jsonb,
  ARRAY[
    'Comfortable driving experience with 2 exquisite interior design options',
    'Safety stable structure with multiple appearance designs',
    'High loading capacity — 2.5T light truck rear axle design',
    'Gasoline, CNG and Diesel engine options',
    'RHD (Right-Hand Drive) option available'
  ],
  'Contact for Price',
  true,
  true
FROM categories WHERE slug = 'mini-truck';

-- ──────────────────────────────────────
-- V SERIES
-- ──────────────────────────────────────
INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'V Series',
  'v-series',
  'kama',
  id,
  'V series — 1715mm cabin width mini trucks. Stylish city truck with powerful 1.6L and 2.0L engine options, available in gasoline and CNG.',
  2024,
  'products/v-series/v-series-main.png',
  ARRAY[
    'products/v-series/v-series-1.png',
    'products/v-series/v-series-2.png'
  ],
  '{
    "Cabin Width": "1715mm",
    "Fuel Type": "Gasoline / CNG",
    "Emission Standard": "Euro VI",
    "Suggested Payload": "1T – 1.5T",
    "Wheelbase Options (mm)": "3100 / 3400 / 3600",
    "Engine Displacement (cc)": "1597 / 1998",
    "Engine Power (kW/rpm)": "91/6000 — 103/6200",
    "Max Torque (N.m/rpm)": "150/4400 — 184/4800",
    "Max Speed (km/h)": "100",
    "GVW (kg)": "2445 – 3250",
    "Curb Weight (kg)": "1465 – 1750",
    "Brake System": "Hydraulic brake",
    "Gearshift": "5+1 speed, manual",
    "Tyre Model": "185R14LT / 195R14LT",
    "Battery Volt": "12V",
    "ABS": "Standard",
    "Power Steering": "Standard",
    "A/C": "Standard",
    "Media": "MP5",
    "Power Window": "Standard",
    "Central Lock": "Standard",
    "Variants": "V11, V12, V15CNG, V155CNG, V15"
  }'::jsonb,
  ARRAY[
    'Fashion city style with comfortable car space',
    'Separate frame construction with 3 layers of anti-collision design',
    '1.6L and 2.0L powerful engine options — strong acceleration and climbing',
    'Available in gasoline and CNG fuel types',
    'RHD (Right-Hand Drive) option available'
  ],
  'Contact for Price',
  false,
  true
FROM categories WHERE slug = 'mini-truck';

-- ──────────────────────────────────────
-- S SERIES (Mini Van)
-- ──────────────────────────────────────
INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'S Series',
  's-series',
  'kama',
  id,
  'S series — 1715mm width cabin mini van. Available as cargo van (6m³–7m³) and passenger van (11 or 14 seats). Multiple fuel and configuration options.',
  2024,
  'products/s-series/s-series-main.png',
  ARRAY[
    'products/s-series/s-series-1.png',
    'products/s-series/s-series-2.png'
  ],
  '{
    "Cabin Width": "1715mm",
    "Fuel Type": "Gasoline",
    "Emission Standard": "Euro VI",
    "Suggested Payload": "1T – 1.5T",
    "Wheelbase Options (mm)": "3050 / 3450",
    "Body Type": "Cargo Van / Passenger Van",
    "Cargo Space": "6m³ – 7m³",
    "Passenger Capacity": "11 or 14 seats",
    "Engine Displacement (cc)": "1997",
    "Engine Power (kW/rpm)": "90/6000 — 103/6000",
    "Max Torque (N.m/rpm)": "168/4800 — 204/4400",
    "Max Speed (km/h)": "120",
    "GVW (kg)": "2900 – 3700",
    "Curb Weight (kg)": "1465 – 1800",
    "Brake System": "Hydraulic brake",
    "Gearshift": "5+1 speed, manual",
    "Tyre Model": "185R14LT / 195R14LT",
    "Battery Volt": "12V",
    "ABS": "Standard",
    "Power Steering": "Standard",
    "A/C": "Standard",
    "Media": "MP5",
    "Power Window": "Standard",
    "Central Lock": "Standard",
    "ESC": "Optional",
    "Dual Airbags": "Optional",
    "Roof A/C": "Optional",
    "Variants": "S6, S7CNG, S7G, S67, S6P7, S116"
  }'::jsonb,
  ARRAY[
    'Cargo VAN: single and double low cabs, 6m³ and 7m³ cargo space available',
    'Passenger VAN: 11 and 14 seat configurations with unitized body',
    'Multiple function options — ESC, dual airbags, roof air conditioning',
    'Independent suspension on passenger variant for smoother ride',
    'RHD (Right-Hand Drive) option available'
  ],
  'Contact for Price',
  false,
  true
FROM categories WHERE slug = 'mini-truck';

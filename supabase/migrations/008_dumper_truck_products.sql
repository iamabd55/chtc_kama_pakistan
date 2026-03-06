-- ══════════════════════════════════════════════════════
-- Dumper Truck Products — GM3, GM6 Series
-- Run AFTER 007_light_truck_products.sql
-- NOTE: Upload product images to Supabase Storage:
--   images/products/gm3-series/gm3-series-main.png
--   images/products/gm6-series/gm6-series-main.png
-- ══════════════════════════════════════════════════════

-- ──────────────────────────────────────
-- GM3 SERIES (1900mm cabin)
-- ──────────────────────────────────────
INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'GM3 Series',
  'gm3-series',
  'kama',
  id,
  'GM3 series — 1900mm cabin width dump truck with payload capacity of 6.5T. Electronically controlled hydraulic dumping system with heavy-load suspension design.',
  2024,
  'products/gm3-series/gm3-series-main.png',
  ARRAY[
    'products/gm3-series/gm3-series-1.png',
    'products/gm3-series/gm3-series-2.png'
  ],
  '{
    "Cabin Width": "1900mm (one and half cabin)",
    "Fuel Type": "Diesel",
    "Emission Standard": "Euro II / Euro IV",
    "Suggested Payload": "6.5T",
    "Wheelbase (mm)": "3260",
    "Overall Dimensions (mm)": "5880–5890 × 2230 × 2600",
    "Cargo Box Size (mm)": "3650–3680 × 2100 × 600",
    "Curb Weight (kg)": "4700",
    "GVW (kg)": "11700",
    "Max Speed (km/h)": "100",
    "Brake System": "Air brake",
    "Parking Brake": "Spring energy air cut brake",
    "Gearshift": "8+2 speed, manual",
    "Tyre Model": "8.25R16",
    "Battery Volt": "24V",
    "Final Ratio": "5.286",
    "QTY of Wheels": "6+1",
    "Engine Models": "YC4FA20-55(YUCHAI), YC4FA20-40(YUCHAI)",
    "Engine Displacement (cc)": "2982",
    "Engine Power (kW/rpm)": "88/5200 — 88/3800",
    "Max Torque (N.m/rpm)": "345/1600-2200 — 380/1400",
    "ABS": "Standard",
    "Power Steering": "Standard",
    "Media": "MP5",
    "A/C": "Standard",
    "Power Window": "Standard",
    "Central Lock": "Standard",
    "Variants": "GM368, GM370"
  }'::jsonb,
  ARRAY[
    '6.5T payload capacity for heavy-duty dumping applications',
    'Good driving visibility with high performance stability',
    'High-strength riveted double-beam frame with heavy-load suspension',
    'Fully electronically controlled hydraulic dumping system',
    'Air brake system with 8+2 speed manual gearbox'
  ],
  'Contact for Price',
  true,
  true
FROM categories WHERE slug = 'dumper-truck';

-- ──────────────────────────────────────
-- GM6 SERIES (2030mm cabin)
-- ──────────────────────────────────────
INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'GM6 Series',
  'gm6-series',
  'kama',
  id,
  'GM6 series — 2030mm cabin width heavy dump truck. Payload up to 10T with YUCHAI and YUNNEI diesel engines. High-strength frame with electronically controlled hydraulics.',
  2024,
  'products/gm6-series/gm6-series-main.png',
  ARRAY[
    'products/gm6-series/gm6-series-1.png',
    'products/gm6-series/gm6-series-2.png'
  ],
  '{
    "Cabin Width": "2030mm (one and half / single cabin)",
    "Fuel Type": "Diesel",
    "Emission Standard": "Euro II / Euro V",
    "Suggested Payload": "10T",
    "Wheelbase Options (mm)": "3400 / 3600",
    "Overall Dimensions (mm)": "6150–6540 × 2440 × 2640–2940",
    "Cargo Box Size (mm)": "4000–4200 × 2300 × 800",
    "Curb Weight (kg)": "6500 – 6610",
    "GVW (kg)": "16420 – 18500",
    "Max Speed (km/h)": "90",
    "Brake System": "Air brake",
    "Parking Brake": "Spring energy air cut brake",
    "Gearshift": "8+2 speed, manual",
    "Tyre Model": "10R17.5 / 11R17.5",
    "Battery Volt": "24V",
    "Final Ratio": "5.855 / 6.333",
    "QTY of Wheels": "6+1",
    "Engine Models": "YC4D85-55(YUCHAI), YNF6T20(YUNNEI)",
    "Engine Displacement (cc)": "4210 / 5920",
    "Engine Power (kW/rpm)": "94/3800 — 125/2600",
    "Max Torque (N.m/rpm)": "380/1700 — 600/1500-1700",
    "ABS": "Standard (select models)",
    "Power Steering": "Standard",
    "Media": "MP5",
    "A/C": "Standard",
    "Power Window": "Standard",
    "Central Lock": "Standard",
    "Variants": "GM648, GM671"
  }'::jsonb,
  ARRAY[
    '10T payload capacity for the heaviest dumping operations',
    'Good driving visibility with high performance stability',
    'High-strength riveted double-beam frame with heavy-load suspension design',
    'Fully electronically controlled hydraulic dumping system',
    'YUCHAI and YUNNEI diesel engine options with air brake system'
  ],
  'Contact for Price',
  true,
  true
FROM categories WHERE slug = 'dumper-truck';

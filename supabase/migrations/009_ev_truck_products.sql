-- ══════════════════════════════════════════════════════
-- EV Truck Products — EW, EV, ES, EX, EM Series
-- Run AFTER 008_dumper_truck_products.sql
-- NOTE: Upload product images to Supabase Storage:
--   images/products/ew-series/ew-series-main.png
--   images/products/ev-series/ev-series-main.png
--   images/products/es-series/es-series-main.png
--   images/products/ex-series/ex-series-main.png
--   images/products/em-series/em-series-main.png
-- ══════════════════════════════════════════════════════

-- ──────────────────────────────────────
-- EW SERIES (BEV Mini Truck — 1600mm)
-- ──────────────────────────────────────
INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'EW Series',
  'ew-series',
  'kama',
  id,
  'EW series — pure electric mini truck with 1600mm cabin width. CATL/EVE/GOTION battery with 70kW motor. Fast and slow charging compatible with international standards.',
  2024,
  'products/ew-series/ew-series-main.png',
  ARRAY[
    'products/ew-series/ew-series-1.png',
    'products/ew-series/ew-series-2.png'
  ],
  '{
    "Power Type": "BEV (Battery Electric Vehicle)",
    "Cabin Width": "1600mm",
    "Suggested Payload": "1T – 1.5T",
    "Wheelbase Options (mm)": "2500 / 3050",
    "Overall Dimensions (mm)": "4160×1690×2030 / 4960×1780×2030",
    "Cargo Box Size (mm)": "3050×1600×360",
    "Max Speed (km/h)": "80",
    "Battery Type": "Lithium Iron Phosphate",
    "Battery Brand": "CATL / EVE / GOTION",
    "Battery Pack (kWh)": "24.81",
    "Charger Type": "Fast / Slow",
    "Motor Brand": "GOTION / EVE",
    "Rated Motor Power (kW)": "55",
    "Peak Motor Power (kW)": "70",
    "Brake System": "Hydraulic brake",
    "Parking Brake": "Front disc/rear drum",
    "Tyre Model": "175R15L1 / 195R14LT",
    "ABS": "Standard",
    "Power Steering": "Standard",
    "Media": "MP5",
    "A/C": "Standard",
    "Power Window": "Standard",
    "Central Lock": "Standard",
    "Variants": "EW1, EW2"
  }'::jsonb,
  ARRAY[
    'Zero emissions — pure battery electric vehicle (BEV)',
    'Famous CATL/EVE/GOTION brand battery for option',
    'Fast/slow charging compatible with a variety of international standards',
    '70kW high-power motor with excellent acceleration and climbing ability',
    'RHD (Right-Hand Drive) option available on EW2'
  ],
  'Contact for Price',
  true,
  true
FROM categories WHERE slug = 'ev-truck';

-- ──────────────────────────────────────
-- EV SERIES (BEV Mini Truck — 1715mm)
-- ──────────────────────────────────────
INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'EV Series',
  'ev-series',
  'kama',
  id,
  'EV series — pure electric mini truck with 1715mm cabin width. GOTION/CATL battery with 70kW motor. Payload 1T–1.5T with fast and slow charging support.',
  2024,
  'products/ev-series/ev-series-main.png',
  ARRAY[
    'products/ev-series/ev-series-1.png',
    'products/ev-series/ev-series-2.png'
  ],
  '{
    "Power Type": "BEV (Battery Electric Vehicle)",
    "Cabin Width": "1715mm",
    "Suggested Payload": "1T – 1.5T",
    "Wheelbase Options (mm)": "3450 / 3600",
    "Overall Dimensions (mm)": "5330×1715×2070 — 5595×1720×2120",
    "Cargo Box Size (mm)": "3330×1680×560 – 3700×1680×560",
    "Max Speed (km/h)": "90",
    "Battery Type": "Lithium Iron Phosphate",
    "Battery Brand": "GOTION / CATL",
    "Battery Pack (kWh)": "41.932",
    "Charger Type": "Fast / Slow",
    "Motor Brand": "GOTION",
    "Rated Motor Power (kW)": "55",
    "Peak Motor Power (kW)": "70",
    "Brake System": "Hydraulic brake",
    "Parking Brake": "Front disc/rear drum",
    "Tyre Model": "185R14LT / 195R14LT",
    "ABS": "Standard",
    "Power Steering": "Standard",
    "Media": "MP5",
    "A/C": "Standard",
    "Power Window": "Standard",
    "Central Lock": "Standard",
    "Variants": "EV1, EV2, EV3"
  }'::jsonb,
  ARRAY[
    'Zero emissions — pure battery electric vehicle (BEV)',
    'Wider 1715mm cabin for extra comfort on longer routes',
    'GOTION/CATL Lithium Iron Phosphate battery options',
    'Fast/slow charging with 70kW peak motor power',
    '90 km/h top speed with excellent payload-to-weight ratio'
  ],
  'Contact for Price',
  true,
  true
FROM categories WHERE slug = 'ev-truck';

-- ──────────────────────────────────────
-- ES SERIES (BEV Cargo & Passenger VAN)
-- ──────────────────────────────────────
INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'ES Series',
  'es-series',
  'kama',
  id,
  'ES/ESP series — pure electric cargo van and passenger van. 1715mm–1873mm cabin, 6m³ cargo space. ECE certified with ESC, dual airbags, AEB. Suits both LHD and RHD.',
  2024,
  'products/es-series/es-series-main.png',
  ARRAY[
    'products/es-series/es-series-1.png',
    'products/es-series/es-series-2.png'
  ],
  '{
    "Power Type": "BEV (Battery Electric Vehicle)",
    "Body Type": "Unitized body — Cargo VAN / Passenger VAN",
    "Cabin Width": "1715mm – 1873mm",
    "Suggested Payload": "1T – 1.5T",
    "Wheelbase Options (mm)": "3050 / 3450",
    "Overall Dimensions (mm)": "4865×1715×2065 — 5265×1870×2065",
    "Cargo Space": "6m³",
    "Max Speed (km/h)": "90",
    "Curb Weight (kg)": "1600 – 1800",
    "GVW (kg)": "3100 – 3300",
    "Battery Type": "Lithium Iron Phosphate",
    "Battery Brand": "GOTION / CATL",
    "Battery Pack (kWh)": "41.86 – 41.952",
    "Charger Type": "Fast / Slow",
    "Motor Brand": "Wuhan Incontrol",
    "Rated Motor Power (kW)": "55",
    "Peak Motor Power (kW)": "70 – 76",
    "Brake System": "Hydraulic brake",
    "Parking Brake": "Front disc/rear drum",
    "Tyre Model": "185R14LT / 195/70R15LT",
    "ABS": "Standard",
    "ESC": "Standard",
    "Dual Airbags": "Standard",
    "AEB": "Standard",
    "Power Steering": "Standard",
    "Media": "MP5 / M15",
    "A/C": "Standard",
    "Power Window": "Standard",
    "Central Lock": "Standard",
    "Variants": "ES6, ES6A, ES7, ESP7, ES8, ESP8"
  }'::jsonb,
  ARRAY[
    'Available as cargo van (6m³) and passenger van configurations',
    '1715mm/1873mm wide cabin with brand new interior design for LHD and RHD',
    'Both side sliding doors, rear doors open at 270°',
    'ECE certified with ESC, dual airbags and AEB safety systems',
    'GOTION/CATL Lithium Iron Phosphate batteries with fast/slow charging'
  ],
  'Contact for Price',
  false,
  true
FROM categories WHERE slug = 'ev-truck';

-- ──────────────────────────────────────
-- EX SERIES (BEV Light Truck — 1750mm)
-- ──────────────────────────────────────
INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'EX Series',
  'ex-series',
  'kama',
  id,
  'EX series — pure electric light truck with 1750mm cabin. Payload 1.5T–2T. CATL/EVE batteries with INOVANCE/DANA motor. Features EHB brake system and reverse power supply.',
  2024,
  'products/ex-series/ex-series-main.png',
  ARRAY[
    'products/ex-series/ex-series-1.png',
    'products/ex-series/ex-series-2.png'
  ],
  '{
    "Power Type": "BEV (Battery Electric Vehicle)",
    "Cabin Width": "1750mm",
    "Suggested Payload": "1.5T – 2T",
    "Wheelbase (mm)": "3180",
    "Overall Dimensions (mm)": "5995×1950×2180",
    "Cargo Box Size (mm)": "3980×1860×400 – 3980×1860×400",
    "Curb Weight (kg)": "2200",
    "GVW (kg)": "3510 – 4200",
    "Max Speed (km/h)": "80",
    "Battery Type": "Lithium Iron Phosphate",
    "Battery Brand": "CATL / EVE",
    "Battery Pack (kWh)": "55.17 – 64.54",
    "Rated Input Voltage (V)": "528 – 396",
    "Charger Type": "Fast / Slow",
    "Motor Brand": "INOVANCE / DANA",
    "Rated Motor Power (kW)": "36 – 50",
    "Peak Motor Power (kW)": "70 – 100",
    "Brake System": "EHB (Electronic Hydraulic Brake)",
    "Parking Brake": "Central drum type",
    "Tyre Model": "185R15LT / 185R15 BPR",
    "QTY of Wheels": "6+1",
    "ABS": "Standard",
    "Power Steering": "Standard",
    "Media": "MP5",
    "A/C": "Standard",
    "Power Window": "Standard",
    "Central Lock": "Standard",
    "Variants": "EX1, EX2"
  }'::jsonb,
  ARRAY[
    'Zero emissions — pure battery electric light truck with 1750mm wide cabin',
    'CATL or EVE brand battery with INOVANCE or DANA motor and controller',
    'Liquid Cooling System available for option',
    'Intelligent Control with EHB Brake System and Reverse Power Supply',
    'Payload 1.5T – 2T with up to 100kW peak motor power'
  ],
  'Contact for Price',
  false,
  true
FROM categories WHERE slug = 'ev-truck';

-- ──────────────────────────────────────
-- EM SERIES (BEV Light Truck — 1900mm)
-- ──────────────────────────────────────
INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'EM Series',
  'em-series',
  'kama',
  id,
  'EM series — pure electric heavy light truck with 1900mm–2030mm cabin. Payload 2.5T–4T. CATL/GOTION batteries with DANA/GOTION motors. Up to 141.5kWh battery pack.',
  2024,
  'products/em-series/em-series-main.png',
  ARRAY[
    'products/em-series/em-series-1.png',
    'products/em-series/em-series-2.png'
  ],
  '{
    "Power Type": "BEV (Battery Electric Vehicle)",
    "Cabin Width": "1900mm / 2030mm",
    "Suggested Payload": "2.5T – 4T",
    "Wheelbase Options (mm)": "3360 / 3600",
    "Overall Dimensions (mm)": "5995×2200×2390 — 6545×2470×2500",
    "Cargo Box Size (mm)": "4360×2000×400 — 4640×2000×450",
    "Curb Weight (kg)": "2750 – 3870",
    "GVW (kg)": "5250 – 8000",
    "Max Speed (km/h)": "80 – 90",
    "Battery Type": "Lithium Iron Phosphate",
    "Battery Brand": "EVE / CATL / GOTION",
    "Battery Pack (kWh)": "81.14 – 141.512",
    "Rated Input Voltage (V)": "322 – 614",
    "Charger Type": "Fast / Slow",
    "Motor Brand": "DANA / CATL / GOTION",
    "Rated Motor Power (kW)": "60 – 70",
    "Peak Motor Power (kW)": "110 – 140",
    "Brake System": "Hydraulic / EHB / Air brake",
    "Parking Brake": "Central drum / Spring energy air cut",
    "Tyre Model": "7.00R16LT / 9.00 / 11R17.5",
    "QTY of Wheels": "6+1",
    "ABS": "Standard",
    "Power Steering": "Standard",
    "Media": "MP5",
    "A/C": "Standard",
    "Power Window": "Standard",
    "Central Lock": "Standard",
    "Variants": "EM51, EM12, EM61"
  }'::jsonb,
  ARRAY[
    'Zero emissions — pure electric with up to 141.5kWh battery capacity',
    'CATL/EVE/GOTION brand batteries with DANA/CATL/GOTION motors',
    'Payload from 2.5T to 4T covering heavy light truck segment',
    'Liquid Cooling System, EHB Brake System and Reverse Power Supply',
    'Intelligent vehicle control — suitable for urban freight applications'
  ],
  'Contact for Price',
  false,
  true
FROM categories WHERE slug = 'ev-truck';

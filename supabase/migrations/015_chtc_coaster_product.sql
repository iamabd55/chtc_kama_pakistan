-- ══════════════════════════════════════════════════════
-- CHTC Coaster C7 Product
-- Run AFTER 014_chtc_coaster_category.sql
-- Upload image: images/products/chtc/coaster-c7/coaster-c7-main.png
-- ══════════════════════════════════════════════════════

INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'Coaster C7',
  'coaster-c7',
  'chtc',
  id,
  'CHTC Coaster C7 — 7.2-metre premium coaster bus with 28+1 seats. Powered by YUCHAI Euro III diesel engine with 108kW power. Air-controlled dual-circuit brakes and integral power steering.',
  2024,
  'products/chtc/coaster-c7/coaster-c7-main.png',
  '{}',
  '{
    "Model": "Coaster C7",
    "Drive Mode": "LHD",
    "Overall Dimensions (mm)": "7234 × 2240 × 2860/2960",
    "Wheelbase (mm)": "3935",
    "Front/Rear Track (mm)": "1830 / 1550",
    "Approach/Departure Angle (°)": "10 / 11",
    "Curb Weight (kg)": "7090",
    "Capacity": "28+1 seats",
    "Max Speed (km/h)": "100",
    "Engine Model": "YCY30160-30 (YUCHAI)",
    "Engine Type": "In-line 4-cylinder, front-mounted diesel",
    "Power Rating (kW/rpm)": "108 / 2800",
    "Max Torque (N.m/rpm)": "380 / 1400–2400",
    "Displacement (cc)": "2970",
    "Emission Standard": "Euro III",
    "Transmission": "Manual gear box",
    "Clutch": "Diaphragm type",
    "Front Axle": "Disc brake",
    "Rear Axle": "Drum brake",
    "Suspension": "Leaf spring",
    "Steering": "Integral power steering",
    "Braking System": "Air-controlled dual-circuit brakes, energy storage spring parking brakes",
    "Fuel Tank": "85L",
    "Tyre": "215/75R17.5",
    "Body Structure": "Rectangular hollow section welded",
    "Interior Trimming": "Molding interior trim",
    "Door": "Pneumatic out-swing door",
    "Windows": "Sliding windows (green tint)",
    "Rearview": "Shaped rear-view mirror + inside mirror",
    "A/C": "16000 KCAL with ventilation skylight",
    "Entertainment": "MP5, reverse camera + inner camera",
    "Seats": "28+1 no-adjustable PU black seats",
    "Paint": "Standard white",
    "Safety": "Sun visor, luxury leather left side luggage rack, right side handrail, 4 safety hammers, digital clock, fire extinguish 4kg, ventilating skylight ×2, heater, telescopic step"
  }'::jsonb,
  ARRAY[
    'Premium 28+1 seat coaster for group transport and tourism',
    'YUCHAI Euro III diesel engine — 108kW, fuel-efficient and reliable',
    'Air-controlled dual-circuit brakes with energy storage parking brake',
    '16000 KCAL A/C system with ventilation skylight',
    'MP5 entertainment with reverse camera and interior camera',
    'Pneumatic out-swing door, integral power steering'
  ],
  'Contact for Price',
  true,
  true
FROM categories WHERE slug = 'coaster';

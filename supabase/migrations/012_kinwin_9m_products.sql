-- ══════════════════════════════════════════════════════
-- Kinwin 9m Bus Products — Labor Bus (HTK6900Y)
-- Run AFTER 010_kinwin_categories.sql
-- NOTE: Upload product images to Supabase Storage:
--   images/products/kinwin/labor-bus-9m/labor-bus-9m-main.png
-- ══════════════════════════════════════════════════════

INSERT INTO products (
  name, slug, brand, category_id,
  short_description, model_year,
  thumbnail, images,
  specs, features,
  price_range, is_featured, is_active
)
SELECT
  'Labor Bus 9m',
  'labor-bus-9m',
  'kinwin',
  id,
  'Kinwin HTK6900Y — 9-metre monocoque labor/passenger bus. 37 seats with air suspension, Wabco ABS, pneumatic doors and diesel engine delivering 245hp.',
  2024,
  'products/kinwin/labor-bus-9m/labor-bus-9m-main.png',
  '{}',
  '{
    "Model": "HTK6900Y",
    "Drive Mode": "LHD",
    "Body Structure": "Monocoque",
    "Overall Dimensions (mm)": "8995 × 2480 × 3420",
    "Wheelbase (mm)": "4500",
    "Front/Rear Overhang (mm)": "1805 / 2690",
    "Wheel Track Front/Rear (mm)": "2068 / 1860",
    "Approach/Departure Angle (°)": "10 / 8",
    "Curb Weight (kg)": "9650",
    "Max Total Mass (kg)": "13000",
    "Axle Load (kg)": "Front 4200 / Rear 9600",
    "Standard Seats": "35+1+1 (37 with three-point belt)",
    "Max Speed (km/h)": "120",
    "Max Gradeability": "25%",
    "Min Ground Clearance (mm)": "290",
    "Min Turning Radius (m)": "≤16",
    "Engine": "YC6J245 — 245hp/2500rpm",
    "Engine Power (kW)": "180",
    "Max Torque (N.m/rpm)": "890 / 1200–1700",
    "Clutch": "φ395",
    "Transmission": "5-speed forward, manual",
    "Retarder": "Electric retarder",
    "Front Axle": "4.2T, disc brake",
    "Rear Axle": "9.5T, drum brake",
    "Suspension": "Air suspension",
    "Tyre": "10R22.5",
    "Steel Rim": "22.5 × 7.5",
    "Steering": "Hydraulic power steering",
    "Braking System": "Dual air circuit brake",
    "ABS": "Wabco ABS",
    "Battery": "24V / 200Ah",
    "A/C": "Cooling 24000 Kcal",
    "Defroster": "Water heating",
    "Alternator": "2 × 120A",
    "Audiovisual System": "MP4",
    "Monitoring System": "5 cameras (reverse, driver, front, middle, passenger)",
    "Tachograph": "Standard",
    "Passenger Doors": "Front and middle, pneumatic outer-swing door",
    "Front Windshield": "Laminated glass",
    "Side Windows": "Fully closed hardened glass",
    "Roof Hatch": "1 hatch with ventilation fan",
    "Floor": "15mm bamboo plywood",
    "Floor Cover": "Flame retardant and anti-slip",
    "Side/Roof Panels": "PVC",
    "Luggage Compartment": "Aluminum top-hinged hatch door",
    "Instruments": "Luxury type / CAN",
    "Rearview Mirror": "Electric control with defroster",
    "Inside Rearview Mirror": "Electric clock",
    "Extinguisher": "2 × 4kg",
    "Safety Hammer": "Yes",
    "Cruise Mileage (km)": "2500"
  }'::jsonb,
  ARRAY[
    'Monocoque body structure for lightweight strength and durability',
    '37 passenger seats with three-point seat belts',
    'Full air suspension for superior ride comfort',
    'Wabco ABS with dual air circuit braking system',
    'Pneumatic outer-swing passenger doors (front and middle)',
    '245hp YUCHAI diesel engine with electric retarder'
  ],
  'Contact for Price',
  true,
  true
FROM categories WHERE slug = 'bus-9m';

-- ══════════════════════════════════════════════════════
-- Replace dummy categories with actual KAMA product lineup
-- ══════════════════════════════════════════════════════

-- Remove existing dummy categories
DELETE FROM categories;

-- Insert real KAMA Auto categories
-- image column stores the path within the 'images' bucket: categories/<filename>
INSERT INTO categories (name, slug, description, image, display_order) VALUES
  ('Mini Truck',   'mini-truck',   'Compact and agile mini trucks — W, X, V and S Series — built for urban logistics and last-mile delivery.', 'categories/mini-truck.png',   1),
  ('Light Truck',  'light-truck',  'Reliable light-duty trucks — K Series and M Series (M1, M3, M6) — for versatile commercial hauling.',      'categories/light-truck.png',  2),
  ('Dumper Truck', 'dumper-truck', 'Heavy-duty dumper trucks — GM3 and GM6 Series — engineered for construction and mining operations.',         'categories/dumper-truck.png', 3),
  ('EV Truck',     'ev-truck',     'Next-generation electric trucks — EW, EV, ES, EX and EM Series — zero-emission commercial vehicles.',       'categories/ev-truck.png',     4);

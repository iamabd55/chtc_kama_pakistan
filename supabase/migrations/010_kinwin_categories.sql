-- ══════════════════════════════════════════════════════
-- Kinwin Bus Categories
-- Adds 2 new Kinwin bus categories to the existing lineup
-- NOTE: Upload category images to Supabase Storage:
--   images/categories/bus-9m.png
--   images/categories/bus-12m.png
-- ══════════════════════════════════════════════════════

INSERT INTO categories (name, slug, description, image, display_order) VALUES
  ('9m Bus',    'bus-9m',    'Kinwin 9-metre passenger buses — reliable, comfortable and fuel-efficient coaches for urban and intercity transport.',       'categories/bus-9m.png',    5),
  ('12.5m Bus', 'bus-12m',   'Kinwin 12.5-metre long-distance coaches — premium large capacity buses for intercity and highway passenger transport.',     'categories/bus-12m.png',   6);

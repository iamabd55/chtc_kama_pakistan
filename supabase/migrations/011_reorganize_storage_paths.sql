-- ══════════════════════════════════════════════════════
-- Reorganize storage paths by brand
-- categories → categories/kama/ or categories/kinwin/
-- products  → products/kama/<series>/
-- ══════════════════════════════════════════════════════

-- ── CATEGORY IMAGES ──────────────────────────────────

-- Kama categories
UPDATE categories SET image = 'categories/kama/mini-truck.png' WHERE slug = 'mini-truck';
UPDATE categories SET image = 'categories/kama/light-truck.png' WHERE slug = 'light-truck';
UPDATE categories SET image = 'categories/kama/dumper-truck.png' WHERE slug = 'dumper-truck';
UPDATE categories SET image = 'categories/kama/ev-truck.png' WHERE slug = 'ev-truck';

-- Kama hover images
UPDATE categories SET hover_image = 'categories/kama/mini-truck-hover.png' WHERE slug = 'mini-truck';
UPDATE categories SET hover_image = 'categories/kama/light-truck-hover.png' WHERE slug = 'light-truck';
UPDATE categories SET hover_image = 'categories/kama/dumper-truck-hover.png' WHERE slug = 'dumper-truck';
UPDATE categories SET hover_image = 'categories/kama/ev-truck-hover.png' WHERE slug = 'ev-truck';

-- Kinwin categories
UPDATE categories SET image = 'categories/kinwin/bus-9m.png' WHERE slug = 'bus-9m';
UPDATE categories SET image = 'categories/kinwin/bus-12m.png' WHERE slug = 'bus-12m';

-- ── PRODUCT THUMBNAILS (KAMA) ────────────────────────
-- Only updating thumbnail — images array cleared to empty (no gallery yet)

UPDATE products SET thumbnail = 'products/kama/w-series/w-series-main.png', images = '{}' WHERE slug = 'w-series';
UPDATE products SET thumbnail = 'products/kama/x-series/x-series-main.png', images = '{}' WHERE slug = 'x-series';
UPDATE products SET thumbnail = 'products/kama/v-series/v-series-main.png', images = '{}' WHERE slug = 'v-series';
UPDATE products SET thumbnail = 'products/kama/s-series/s-series-main.png', images = '{}' WHERE slug = 's-series';
UPDATE products SET thumbnail = 'products/kama/m1-series/m1-series-main.png', images = '{}' WHERE slug = 'm1-series';
UPDATE products SET thumbnail = 'products/kama/m3-series/m3-series-main.png', images = '{}' WHERE slug = 'm3-series';
UPDATE products SET thumbnail = 'products/kama/m6-series/m6-series-main.png', images = '{}' WHERE slug = 'm6-series';
UPDATE products SET thumbnail = 'products/kama/k-series/k-series-main.png', images = '{}' WHERE slug = 'k-series';
UPDATE products SET thumbnail = 'products/kama/gm3-series/gm3-series-main.png', images = '{}' WHERE slug = 'gm3-series';
UPDATE products SET thumbnail = 'products/kama/gm6-series/gm6-series-main.png', images = '{}' WHERE slug = 'gm6-series';
UPDATE products SET thumbnail = 'products/kama/ew-series/ew-series-main.png', images = '{}' WHERE slug = 'ew-series';
UPDATE products SET thumbnail = 'products/kama/ev-series/ev-series-main.png', images = '{}' WHERE slug = 'ev-series';
UPDATE products SET thumbnail = 'products/kama/es-series/es-series-main.png', images = '{}' WHERE slug = 'es-series';
UPDATE products SET thumbnail = 'products/kama/ex-series/ex-series-main.png', images = '{}' WHERE slug = 'ex-series';
UPDATE products SET thumbnail = 'products/kama/em-series/em-series-main.png', images = '{}' WHERE slug = 'em-series';

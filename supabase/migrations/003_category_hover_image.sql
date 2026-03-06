-- ══════════════════════════════════════════════════════
-- Add hover_image column to categories
-- ══════════════════════════════════════════════════════

ALTER TABLE categories ADD COLUMN hover_image text;

-- Update hover images (user will upload these to Supabase Storage)
UPDATE categories SET hover_image = 'categories/mini-truck-hover.png'   WHERE slug = 'mini-truck';
UPDATE categories SET hover_image = 'categories/light-truck-hover.png'  WHERE slug = 'light-truck';
UPDATE categories SET hover_image = 'categories/dumper-truck-hover.png' WHERE slug = 'dumper-truck';
UPDATE categories SET hover_image = 'categories/ev-truck-hover.png'     WHERE slug = 'ev-truck';

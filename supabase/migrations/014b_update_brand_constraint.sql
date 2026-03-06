-- ══════════════════════════════════════════════════════
-- Update Brand Check Constraint
-- Run BEFORE 015_chtc_coaster_product.sql
-- ══════════════════════════════════════════════════════

-- Drop the existing constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_brand_check;

-- Add the new constraint including 'chtc'
ALTER TABLE products ADD CONSTRAINT products_brand_check 
  CHECK (brand IN ('kama', 'kinwin', 'joylong', 'chtc'));

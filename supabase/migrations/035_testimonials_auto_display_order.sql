-- Auto-assign display_order on insert when not explicitly set (> 0)

CREATE OR REPLACE FUNCTION testimonials_assign_display_order()
RETURNS TRIGGER AS $$
DECLARE
  next_order int;
BEGIN
  IF NEW.display_order IS NULL OR NEW.display_order <= 0 THEN
    SELECT COALESCE(MAX(display_order), 0) + 1 INTO next_order FROM testimonials;
    NEW.display_order := next_order;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS testimonials_assign_display_order ON testimonials;
CREATE TRIGGER testimonials_assign_display_order
  BEFORE INSERT ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION testimonials_assign_display_order();

-- Normalize existing rows that share display_order 0
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS rn
  FROM testimonials
  WHERE display_order IS NULL OR display_order <= 0
)
UPDATE testimonials t
SET display_order = r.rn
FROM ranked r
WHERE t.id = r.id;

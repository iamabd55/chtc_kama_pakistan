-- Testimonials: display order for curated homepage ordering

ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS display_order int NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_testimonials_status_active
  ON testimonials (status, is_active, display_order);

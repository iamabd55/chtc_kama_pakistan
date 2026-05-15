-- Add public-facing inquiry references for customer tracking.

ALTER TABLE inquiries
ADD COLUMN IF NOT EXISTS public_ref text;

UPDATE inquiries
SET public_ref = 'INQ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
WHERE public_ref IS NULL OR public_ref = '';

ALTER TABLE inquiries
ALTER COLUMN public_ref SET DEFAULT ('INQ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)));

ALTER TABLE inquiries
ALTER COLUMN public_ref SET NOT NULL;

DO $$
BEGIN
  ALTER TABLE inquiries
    ADD CONSTRAINT inquiries_public_ref_key UNIQUE (public_ref);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

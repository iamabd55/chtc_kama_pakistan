-- Add a global announcement banner to the single-row site settings table.

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS announcement_banner_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS announcement_banner_message text;

UPDATE site_settings
SET announcement_banner_enabled = COALESCE(announcement_banner_enabled, false)
WHERE announcement_banner_enabled IS NULL;
-- ══════════════════════════════════════════════════════
-- Allow public listing of storage objects in the images bucket
-- Supabase public buckets allow file access via URL, but
-- storage.list() still requires an explicit RLS policy.
-- ══════════════════════════════════════════════════════

CREATE POLICY "Public can list images bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

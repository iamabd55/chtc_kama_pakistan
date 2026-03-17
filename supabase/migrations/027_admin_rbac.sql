-- Admin RBAC and user profile mapping

CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin','editor','sales','hr')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own admin profile" ON admin_profiles;
CREATE POLICY "Users can read own admin profile"
  ON admin_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Super admins can manage admin profiles" ON admin_profiles;
CREATE POLICY "Super admins can manage admin profiles"
  ON admin_profiles FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.user_id = auth.uid()
        AND ap.is_active = true
        AND ap.role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.user_id = auth.uid()
        AND ap.is_active = true
        AND ap.role = 'super_admin'
    )
  );

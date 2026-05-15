-- Inquiries RLS used subqueries on admin_profiles while admin_profiles policies
-- also subquery admin_profiles, which can trigger "infinite recursion detected in
-- policy" and surface as PostgREST 500. Use a SECURITY DEFINER helper so the
-- admin check does not re-enter admin_profiles RLS.

CREATE OR REPLACE FUNCTION public.auth_is_active_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles ap
    WHERE ap.user_id = auth.uid()
      AND ap.is_active = true
  );
$$;

REVOKE ALL ON FUNCTION public.auth_is_active_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.auth_is_active_admin() TO authenticated;

DROP POLICY IF EXISTS "Enable read access for active admins" ON public.inquiries;
CREATE POLICY "Enable read access for active admins"
  ON public.inquiries
  FOR SELECT
  TO authenticated
  USING (public.auth_is_active_admin());

DROP POLICY IF EXISTS "Enable update for active admins" ON public.inquiries;
CREATE POLICY "Enable update for active admins"
  ON public.inquiries
  FOR UPDATE
  TO authenticated
  USING (public.auth_is_active_admin())
  WITH CHECK (public.auth_is_active_admin());

DROP POLICY IF EXISTS "Enable delete for active admins" ON public.inquiries;
CREATE POLICY "Enable delete for active admins"
  ON public.inquiries
  FOR DELETE
  TO authenticated
  USING (public.auth_is_active_admin());

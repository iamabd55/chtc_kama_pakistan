-- Admin CRUD policies for authenticated users
-- Fixes RLS write failures in admin panel (e.g. site_settings updates).

-- categories
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;
CREATE POLICY "Authenticated users can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- products
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;
CREATE POLICY "Authenticated users can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- dealers
DROP POLICY IF EXISTS "Authenticated users can manage dealers" ON dealers;
CREATE POLICY "Authenticated users can manage dealers"
  ON dealers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- news_posts
DROP POLICY IF EXISTS "Authenticated users can manage news posts" ON news_posts;
CREATE POLICY "Authenticated users can manage news posts"
  ON news_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- career_posts
DROP POLICY IF EXISTS "Authenticated users can manage career posts" ON career_posts;
CREATE POLICY "Authenticated users can manage career posts"
  ON career_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- job_applications
DROP POLICY IF EXISTS "Authenticated users can manage job applications" ON job_applications;
CREATE POLICY "Authenticated users can manage job applications"
  ON job_applications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- inquiries
DROP POLICY IF EXISTS "Authenticated users can manage inquiries" ON inquiries;
CREATE POLICY "Authenticated users can manage inquiries"
  ON inquiries
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- site_settings
DROP POLICY IF EXISTS "Authenticated users can manage site settings" ON site_settings;
CREATE POLICY "Authenticated users can manage site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

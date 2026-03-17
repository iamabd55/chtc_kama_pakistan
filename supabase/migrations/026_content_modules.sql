-- Content modules for roadmap completion

CREATE TABLE IF NOT EXISTS team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  photo_url text,
  bio text,
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS client_logos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  logo_url text NOT NULL,
  website_url text,
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL CHECK (category IN ('product','event','facility','delivery')),
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  thumbnail_url text,
  document_url text,
  description text,
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  customer_title text,
  company text,
  content text NOT NULL,
  rating int CHECK (rating BETWEEN 1 AND 5),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active team members" ON team_members;
CREATE POLICY "Public can read active team members"
  ON team_members FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can read active client logos" ON client_logos;
CREATE POLICY "Public can read active client logos"
  ON client_logos FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can read active gallery items" ON gallery_items;
CREATE POLICY "Public can read active gallery items"
  ON gallery_items FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can read active certifications" ON certifications;
CREATE POLICY "Public can read active certifications"
  ON certifications FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can read approved testimonials" ON testimonials;
CREATE POLICY "Public can read approved testimonials"
  ON testimonials FOR SELECT USING (status = 'approved' AND is_active = true);

DROP POLICY IF EXISTS "Authenticated users can manage team members" ON team_members;
CREATE POLICY "Authenticated users can manage team members"
  ON team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage client logos" ON client_logos;
CREATE POLICY "Authenticated users can manage client logos"
  ON client_logos FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage gallery items" ON gallery_items;
CREATE POLICY "Authenticated users can manage gallery items"
  ON gallery_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage certifications" ON certifications;
CREATE POLICY "Authenticated users can manage certifications"
  ON certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON testimonials;
CREATE POLICY "Authenticated users can manage testimonials"
  ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

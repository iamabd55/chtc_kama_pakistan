-- ══════════════════════════════════════════════════════
-- CHTC Kama Pakistan — Database Schema
-- Run this in Supabase SQL Editor (all at once)
-- ══════════════════════════════════════════════════════

-- ──────────────────────────────────
-- 1. CATEGORIES (vehicle types)
-- ──────────────────────────────────
CREATE TABLE categories (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  slug          text NOT NULL UNIQUE,
  description   text,
  image         text,
  hover_image   text,
  display_order int DEFAULT 0,
  is_active     boolean DEFAULT true
);

-- ──────────────────────────────────
-- 2. PRODUCTS
-- ──────────────────────────────────
CREATE TABLE products (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name              text NOT NULL,
  slug              text NOT NULL UNIQUE,
  brand             text NOT NULL CHECK (brand IN ('kama','joylong','kinwin')),
  category_id       uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  short_description text,
  model_year        int,
  thumbnail         text NOT NULL,
  images            text[] DEFAULT '{}',
  specs             jsonb DEFAULT '{}',
  features          text[] DEFAULT '{}',
  brochure_url      text,
  price_range       text,
  is_featured       boolean DEFAULT false,
  is_active         boolean DEFAULT true,
  meta_title        text,
  meta_desc         text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- ──────────────────────────────────
-- 3. INQUIRIES
-- ──────────────────────────────────
CREATE TABLE inquiries (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name      text NOT NULL,
  phone          text NOT NULL,
  email          text,
  city           text NOT NULL,
  product_id     uuid REFERENCES products(id) ON DELETE SET NULL,
  inquiry_type   text NOT NULL CHECK (inquiry_type IN
                   ('purchase','quote','brochure','parts','service','general')),
  message        text,
  status         text DEFAULT 'new' CHECK (status IN
                   ('new','contacted','in-progress','converted','closed')),
  assigned_to    uuid,
  notes          text,
  follow_up_date date,
  source         text DEFAULT 'web-form' CHECK (source IN
                   ('web-form','whatsapp','phone','walk-in')),
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

-- ──────────────────────────────────
-- 4. DEALERS
-- ──────────────────────────────────
CREATE TABLE dealers (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  city          text NOT NULL,
  province      text NOT NULL CHECK (province IN
                  ('Punjab','Sindh','KPK','Balochistan','AJK','GB','ICT')),
  address       text NOT NULL,
  phone         text NOT NULL,
  whatsapp      text,
  email         text,
  lat           numeric,
  lng           numeric,
  dealer_type   text NOT NULL CHECK (dealer_type IN ('sales','service','both')),
  brands        text[] DEFAULT '{}',
  working_hours text,
  is_active     boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

-- ──────────────────────────────────
-- 5. NEWS POSTS
-- ──────────────────────────────────
CREATE TABLE news_posts (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title        text NOT NULL,
  slug         text NOT NULL UNIQUE,
  content      text NOT NULL,
  excerpt      text,
  category     text NOT NULL CHECK (category IN
                 ('news','event','product-launch','press-release')),
  thumbnail    text NOT NULL,
  author       text DEFAULT 'CHTC Kama Pakistan',
  tags         text[] DEFAULT '{}',
  status       text DEFAULT 'draft' CHECK (status IN ('draft','published')),
  meta_title   text,
  meta_desc    text,
  published_at timestamptz,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- ──────────────────────────────────
-- 6. CAREER POSTS
-- ──────────────────────────────────
CREATE TABLE career_posts (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title            text NOT NULL,
  department       text NOT NULL,
  location         text DEFAULT 'Lahore, Pakistan',
  job_type         text NOT NULL CHECK (job_type IN
                     ('full-time','part-time','contract','internship')),
  description      text NOT NULL,
  requirements     text[] DEFAULT '{}',
  responsibilities text[] DEFAULT '{}',
  salary_range     text,
  deadline         date NOT NULL,
  is_active        boolean DEFAULT true,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- ──────────────────────────────────
-- 7. JOB APPLICATIONS
-- ──────────────────────────────────
CREATE TABLE job_applications (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  career_post_id uuid NOT NULL REFERENCES career_posts(id) ON DELETE CASCADE,
  applicant_name text NOT NULL,
  email          text NOT NULL,
  phone          text NOT NULL,
  cv_url         text NOT NULL,
  cover_letter   text,
  status         text DEFAULT 'received' CHECK (status IN
                   ('received','reviewed','shortlisted','rejected','hired')),
  applied_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

-- ──────────────────────────────────
-- 8. SITE SETTINGS (singleton)
-- ──────────────────────────────────
CREATE TABLE site_settings (
  id                int PRIMARY KEY DEFAULT 1,
  whatsapp_number   text NOT NULL,
  sales_email       text NOT NULL,
  support_email     text,
  office_phone      text,
  office_address    text,
  google_maps_embed text,
  social_links      jsonb DEFAULT '{}',
  hero_slides       jsonb DEFAULT '[]',
  company_tagline   text,
  footer_text       text,
  updated_at        timestamptz DEFAULT now()
);

ALTER TABLE site_settings ADD CONSTRAINT single_row CHECK (id = 1);

-- ══════════════════════════════════════════════════════
-- SEED: Categories (KAMA Auto real lineup)
-- ══════════════════════════════════════════════════════
INSERT INTO categories (name, slug, description, image, display_order) VALUES
  ('Mini Truck',   'mini-truck',   'Compact and agile mini trucks — W, X, V and S Series — built for urban logistics and last-mile delivery.', 'categories/mini-truck.png',   1),
  ('Light Truck',  'light-truck',  'Reliable light-duty trucks — K Series and M Series (M1, M3, M6) — for versatile commercial hauling.',      'categories/light-truck.png',  2),
  ('Dumper Truck', 'dumper-truck', 'Heavy-duty dumper trucks — GM3 and GM6 Series — engineered for construction and mining operations.',         'categories/dumper-truck.png', 3),
  ('EV Truck',     'ev-truck',     'Next-generation electric trucks — EW, EV, ES, EX and EM Series — zero-emission commercial vehicles.',       'categories/ev-truck.png',     4);

-- ══════════════════════════════════════════════════════
-- SEED: Site Settings (initial row)
-- ══════════════════════════════════════════════════════
INSERT INTO site_settings (whatsapp_number, sales_email, support_email, office_phone, office_address, company_tagline, footer_text)
VALUES (
  '+923008665060',
  'sales@chtckama.com.pk',
  'info@chtckama.com.pk',
  '+92 300 8665 060',
  'CHTC Kama Pakistan, Lahore, Punjab, Pakistan',
  'Your Trusted Partner for Commercial Vehicles',
  '© 2026 CHTC Kama Pakistan. All rights reserved.'
);

-- ══════════════════════════════════════════════════════
-- RLS POLICIES (public read for categories, products, etc.)
-- ══════════════════════════════════════════════════════

-- Categories: anyone can read active categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active categories"
  ON categories FOR SELECT
  USING (is_active = true);

-- Products: anyone can read active products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Dealers: anyone can read active dealers
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active dealers"
  ON dealers FOR SELECT
  USING (is_active = true);

-- News: anyone can read published news
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published news"
  ON news_posts FOR SELECT
  USING (status = 'published');

-- Career posts: anyone can read active listings
ALTER TABLE career_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active careers"
  ON career_posts FOR SELECT
  USING (is_active = true);

-- Job applications: insert only (applicants submit, can't read others')
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit application"
  ON job_applications FOR INSERT
  WITH CHECK (true);

-- Inquiries: insert only (customers submit via forms)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit inquiry"
  ON inquiries FOR INSERT
  WITH CHECK (true);

-- Site settings: public read
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  USING (true);

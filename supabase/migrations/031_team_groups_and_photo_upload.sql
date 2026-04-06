-- Team grouping model for admin team management
-- Introduces teams table and links each team member to a team.

CREATE TABLE IF NOT EXISTS teams (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES teams(id) ON DELETE RESTRICT;

-- Ensure core teams always exist.
INSERT INTO teams (id, name, slug, display_order, is_active)
VALUES
  ('b1111111-1111-4111-8111-111111111111', 'Sales', 'sales', 1, true),
  ('b2222222-2222-4222-8222-222222222222', 'Service', 'service', 2, true),
  ('b3333333-3333-4333-8333-333333333333', 'Spare Parts', 'spare-parts', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Backfill existing members to Sales when no team is set.
UPDATE team_members
SET team_id = 'b1111111-1111-4111-8111-111111111111'
WHERE team_id IS NULL;

ALTER TABLE team_members
  ALTER COLUMN team_id SET NOT NULL;

-- Demo members to reflect multiple employees per team.
INSERT INTO team_members (
  id,
  team_id,
  name,
  role,
  photo_url,
  bio,
  display_order,
  is_active,
  created_at,
  updated_at
)
VALUES
  (
    'd1111111-1111-4111-8111-111111111111',
    'b1111111-1111-4111-8111-111111111111',
    'Ahsan Raza',
    'Regional Sales Executive',
    null,
    'Handles fleet sales relationships in Punjab and supports lead conversion from digital channels.',
    1,
    true,
    now(),
    now()
  ),
  (
    'd2222222-2222-4222-8222-222222222222',
    'b1111111-1111-4111-8111-111111111111',
    'Maham Tariq',
    'Sales Coordinator',
    null,
    'Coordinates quotations, dealer communication, and sales documentation for commercial vehicle deals.',
    2,
    true,
    now(),
    now()
  ),
  (
    'd3333333-3333-4333-8333-333333333333',
    'b2222222-2222-4222-8222-222222222222',
    'Bilal Ahmed',
    'Workshop Supervisor',
    null,
    'Oversees daily workshop operations and preventive maintenance quality checks.',
    3,
    true,
    now(),
    now()
  ),
  (
    'd4444444-4444-4444-8444-444444444444',
    'b2222222-2222-4222-8222-222222222222',
    'Usman Ali',
    'Service Advisor',
    null,
    'Manages customer service bookings and provides maintenance timelines to fleet clients.',
    4,
    true,
    now(),
    now()
  ),
  (
    'd5555555-5555-4555-8555-555555555555',
    'b3333333-3333-4333-8333-333333333333',
    'Naveed Khan',
    'Parts Counter Specialist',
    null,
    'Supports parts availability checks, dispatch planning, and dealer parts coordination.',
    5,
    true,
    now(),
    now()
  ),
  (
    'd6666666-6666-4666-8666-666666666666',
    'b3333333-3333-4333-8333-333333333333',
    'Hassan Shehzad',
    'Inventory Controller',
    null,
    'Monitors spare parts stock and ensures reorder thresholds are maintained.',
    6,
    true,
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active teams" ON teams;
CREATE POLICY "Public can read active teams"
  ON teams FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can manage teams" ON teams;
CREATE POLICY "Authenticated users can manage teams"
  ON teams FOR ALL TO authenticated USING (true) WITH CHECK (true);

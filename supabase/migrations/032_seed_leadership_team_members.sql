-- Add a dedicated Leadership team and seed leadership members with photos
-- so /about/leadership can be sourced from DB consistently.

insert into teams (id, name, slug, display_order)
values
  ('11111111-1111-1111-1111-111111111111', 'Leadership', 'leadership', 1)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  display_order = excluded.display_order,
  updated_at = now();

insert into team_members (
  id,
  team_id,
  name,
  role,
  photo_url,
  bio,
  is_active,
  display_order
)
values
  (
    '11111111-1111-1111-1111-111111111201',
    '11111111-1111-1111-1111-111111111111',
    'Mr. Bashir Uddin Malik',
    'Founder',
    '/images/al-bcf/core-team/founder.png',
    'Pioneer automotive leader whose vision established the group and laid the foundation for nationwide dealership growth.',
    true,
    1
  ),
  (
    '11111111-1111-1111-1111-111111111202',
    '11111111-1111-1111-1111-111111111111',
    'Zaheer Ud Din Malik',
    'Chairman',
    '/images/al-bcf/core-team/chairman.png',
    'Leads strategic direction and long-term growth of Al Nasir Motors Pakistan operations.',
    true,
    2
  ),
  (
    '11111111-1111-1111-1111-111111111203',
    '11111111-1111-1111-1111-111111111111',
    'Muneeb Ibrahim',
    'CEO',
    '/images/al-bcf/core-team/ceo.png',
    'Oversees execution, operational performance, and business transformation across departments.',
    true,
    3
  ),
  (
    '11111111-1111-1111-1111-111111111204',
    '11111111-1111-1111-1111-111111111111',
    'Shaukat Hayat',
    'Director',
    '/images/al-bcf/core-team/director-1-Shaukat-hayat.png',
    'Supports governance and enterprise management across core business units.',
    true,
    4
  ),
  (
    '11111111-1111-1111-1111-111111111205',
    '11111111-1111-1111-1111-111111111111',
    'M. Izhar Ul Haq',
    'Director Sales & Marketing',
    '/images/al-bcf/core-team/director-2-M-Izhar-ul-haq.png',
    'Leads sales and marketing strategy, dealer engagement, and market expansion activities.',
    true,
    5
  )
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  role = excluded.role,
  photo_url = excluded.photo_url,
  bio = excluded.bio,
  is_active = excluded.is_active,
  display_order = excluded.display_order,
  updated_at = now();

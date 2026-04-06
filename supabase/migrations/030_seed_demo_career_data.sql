-- Demo careers seed data for project submission
-- Adds a few realistic active positions and sample applications.

INSERT INTO career_posts (
  id,
  title,
  department,
  location,
  job_type,
  description,
  requirements,
  responsibilities,
  salary_range,
  deadline,
  is_active,
  created_at,
  updated_at
) VALUES
(
  'c1111111-1111-4111-8111-111111111111',
  'Regional Sales Executive',
  'Sales',
  'Lahore, Pakistan',
  'full-time',
  'Drive commercial vehicle sales across Punjab with a focus on fleet customers, dealer support, and lead follow-up.',
  ARRAY[
    '2+ years of sales experience, preferably in automotive or commercial vehicles.',
    'Strong communication and relationship-building skills.',
    'Ability to travel locally and manage multiple leads at once.'
  ],
  ARRAY[
    'Follow up new leads from the website and dealer network.',
    'Visit corporate and fleet customers to understand requirements.',
    'Coordinate with the admin and after-sales teams for smooth delivery.'
  ],
  'PKR 90,000 - 130,000',
  (CURRENT_DATE + INTERVAL '60 days')::date,
  true,
  NOW(),
  NOW()
),
(
  'c2222222-2222-4222-8222-222222222222',
  'Fleet Service Coordinator',
  'After Sales',
  'Multan, Pakistan',
  'full-time',
  'Coordinate service schedules, workshop follow-up, and fleet maintenance reporting for key commercial vehicle customers.',
  ARRAY[
    'Diploma or degree in Mechanical, Automotive, or related field.',
    'Minimum 1-2 years in service coordination, workshop operations, or fleet support.',
    'Comfortable with service records, reporting, and customer calls.'
  ],
  ARRAY[
    'Track fleet maintenance requests and status updates.',
    'Coordinate between customers, workshop staff, and spare parts teams.',
    'Prepare service follow-up summaries for management.'
  ],
  'PKR 70,000 - 100,000',
  (CURRENT_DATE + INTERVAL '45 days')::date,
  true,
  NOW(),
  NOW()
),
(
  'c3333333-3333-4333-8333-333333333333',
  'Commercial Vehicle Workshop Technician',
  'Workshop',
  'Karachi, Pakistan',
  'contract',
  'Hands-on technical role for diagnosing, repairing, and supporting commercial vehicle service operations.',
  ARRAY[
    'Technical training or diploma in automotive/electrical/mechanical work.',
    'Experience with truck or bus maintenance is preferred.',
    'Ability to follow safety procedures and technical checklists.'
  ],
  ARRAY[
    'Inspect vehicles and support preventive maintenance tasks.',
    'Assist senior technicians with diagnostics and repairs.',
    'Maintain clean documentation of work completed.'
  ],
  'PKR 55,000 - 85,000',
  (CURRENT_DATE + INTERVAL '30 days')::date,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO job_applications (
  id,
  career_post_id,
  applicant_name,
  email,
  phone,
  cv_url,
  cover_letter,
  status,
  applied_at,
  updated_at
) VALUES
(
  'a1111111-1111-4111-8111-111111111111',
  'c1111111-1111-4111-8111-111111111111',
  'Ahmed Raza',
  'ahmed.raza@example.com',
  '+92 300 1111001',
  'https://example.com/cv/ahmed-raza-sales.pdf',
  'Experienced in vehicle sales, dealer visits, and lead management. Looking to grow in commercial transport sales.',
  'reviewed',
  NOW() - INTERVAL '4 days',
  NOW() - INTERVAL '3 days'
),
(
  'a2222222-2222-4222-8222-222222222222',
  'c1111111-1111-4111-8111-111111111111',
  'Sana Tariq',
  'sana.tariq@example.com',
  '+92 300 1111002',
  'https://example.com/cv/sana-tariq-sales.pdf',
  'I have worked in B2B sales coordination and customer relationship roles. I can support fleet and dealer operations.',
  'received',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),
(
  'a3333333-3333-4333-8333-333333333333',
  'c2222222-2222-4222-8222-222222222222',
  'Usman Khalid',
  'usman.khalid@example.com',
  '+92 300 1111003',
  'https://example.com/cv/usman-khalid-service.pdf',
  'I have hands-on workshop coordination experience and can manage service follow-up and fleet maintenance tasks.',
  'shortlisted',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
),
(
  'a4444444-4444-4444-8444-444444444444',
  'c3333333-3333-4333-8333-333333333333',
  'Bilal Hussain',
  'bilal.hussain@example.com',
  '+92 300 1111004',
  'https://example.com/cv/bilal-hussain-technician.pdf',
  'Skilled in diagnostics, preventive maintenance, and workshop support for commercial vehicles.',
  'received',
  NOW() - INTERVAL '12 hours',
  NOW() - INTERVAL '12 hours'
)
ON CONFLICT (id) DO NOTHING;

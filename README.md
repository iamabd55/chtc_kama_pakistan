# Al Nasir Motors Pakistan Web Platform

Production-grade website and admin panel for Al Nasir Motors Pakistan, built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase.

This repository contains:
- A public-facing marketing and catalog website
- A secured admin control panel for content and operations
- Inquiry and careers submission APIs
- Notification workflows (email and optional webhook)

## Tech Stack

- Next.js 16 (App Router)
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui + Radix UI
- Supabase (Postgres, Auth, Storage)
- Framer Motion (UI transitions)
- Resend (transactional email notifications)

## Core Features

### Public Website
- Homepage with dynamic hero slides and dealer highlights
- Product catalog by category and brand
- Product detail pages with gallery, specs, features, brochure links, and inquiry form
- Product comparison page
- Dealer finder and dealer detail pages
- Careers listing and application submission
- News listing and detail pages
- Quote, contact, after-sales, and news inquiry forms
- SEO metadata, dynamic sitemap, robots policy, Open Graph and Twitter metadata

### Admin Panel
- Secure login via Supabase Auth
- Dashboard with operational metrics
- CRUD modules for:
  - Products
  - Categories
  - Dealers
  - News
  - Career posts
  - Job applications
  - Inquiries
  - Team members
  - Client logos
  - Gallery
  - Certifications
  - Testimonials
  - Site settings
- Admin user provisioning endpoint with role checks (super admin only)
- Inquiry status lifecycle updates with optional customer status email

### Notifications and Integrations
- Admin notification email for new inquiries
- Customer confirmation email after inquiry submission
- Optional webhook dispatch for inquiry events
- Optional Google Analytics integration

## Project Structure

- app/: Next.js App Router pages, layouts, metadata routes, and API route handlers
- src/components/: Reusable UI and feature components
- src/components/admin/: Admin shell and shared admin UI
- src/lib/supabase/: Supabase clients, storage URL helpers, domain types
- src/lib/notifications/: Resend and inquiry/customer notification logic
- src/lib/validation/: Form and inquiry validation helpers
- supabase/migrations/: SQL migrations for schema and incremental changes
- public/images/: Static and branded image assets

## API Endpoints

### Inquiry APIs
- POST /api/inquiries/contact
- POST /api/inquiries/quote
- POST /api/inquiries/product
- POST /api/inquiries/after-sales
- POST /api/inquiries/news

Behavior summary:
- Validates required form inputs and phone/email format
- Creates records in inquiries table
- Sends admin notification and customer confirmation (when email is provided)
- Returns redirect responses for form posts
- Some endpoints also support JSON response mode for fetch-based submissions

### Careers API
- POST /api/careers/apply

Behavior summary:
- Accepts either cv_url or uploaded cv_file
- Uploads CV file to Supabase Storage when provided
- Creates record in job_applications table

### Admin APIs
- POST /api/admin/users
  - Creates Supabase auth users and admin_profiles records
  - Requires authenticated super_admin
- PATCH /api/admin/inquiries/[id]
  - Updates inquiry status, assignee, notes, and follow-up date
- DELETE /api/admin/inquiries/[id]
  - Deletes an inquiry

## Environment Variables

Copy .env.example to .env.local and fill in values.

Required:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

Email and notification:
- RESEND_API_KEY
- NOTIFICATION_FROM_EMAIL
- SALES_NOTIFICATION_EMAIL

Optional:
- INQUIRY_WEBHOOK_URL
- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
- NEXT_PUBLIC_GA_MEASUREMENT_ID
- NEXT_PUBLIC_SITE_URL

Notes:
- If RESEND_API_KEY is missing, email notifications are skipped gracefully.
- If SALES_NOTIFICATION_EMAIL is missing, admin inquiry emails are skipped.
- SUPABASE_SERVICE_ROLE_KEY is required for career CV file upload and admin user creation.

## Local Development

### 1. Install dependencies
npm install

### 2. Configure environment
- Duplicate .env.example as .env.local
- Set all required variables

### 3. Apply database migrations
Use your preferred Supabase workflow:
- Supabase CLI migration apply, or
- Run SQL files from supabase/migrations in Supabase SQL editor

### 4. Run the app
npm run dev

Default local URL:
- http://localhost:3000

## NPM Scripts

- npm run dev: Start development server
- npm run build: Build production bundle
- npm run start: Start production server
- npm run lint: Run ESLint

## Data Model Overview

Main domain entities used in the application:
- categories
- products
- inquiries
- dealers
- news_posts
- career_posts
- job_applications
- site_settings
- team_members
- client_logos
- gallery_items
- certifications
- testimonials
- admin_profiles

The TypeScript interfaces for these entities are maintained in src/lib/supabase/types.ts.

## Storage Conventions

Supabase Storage uses a public bucket named images.

Typical object paths used by the app include:
- hero/*
- categories/*
- products/*
- careers/cv/*

Storage URL generation is normalized by src/lib/supabase/storage.ts to support both full URLs and bucket-relative paths.

## Auth and Access Control

- Supabase session checks are enforced in proxy.ts
- /admin routes require authenticated users
- Additional profile checks use admin_profiles
- /admin/users is restricted to super_admin
- /admin/login redirects authenticated users to dashboard

## SEO and Metadata

Implemented SEO capabilities:
- Per-page metadata helpers
- Open Graph and Twitter cards
- Dynamic sitemap generation from static routes + database content
- robots policy disallowing admin paths
- Structured organization data in root layout

## Deployment Notes

Recommended target:
- Vercel for Next.js hosting
- Supabase for database, auth, and storage

Before deploying:
- Configure all environment variables in deployment environment
- Ensure migrations are fully applied
- Confirm storage bucket and public access policies are configured
- Verify Resend sender domain and from address

## Troubleshooting

### Admin login succeeds but access fails
- Check admin_profiles table entry for user_id
- Ensure is_active is true
- Verify role when accessing super-admin-only routes

### Inquiry submitted but no email received
- Verify RESEND_API_KEY
- Verify NOTIFICATION_FROM_EMAIL is a verified sender
- Verify SALES_NOTIFICATION_EMAIL is set

### CV upload failing on careers form
- Ensure SUPABASE_SERVICE_ROLE_KEY is present
- Confirm images bucket exists and allows upload with service role

### Product images not displaying
- Verify NEXT_PUBLIC_SUPABASE_URL
- Check object paths in database fields
- Ensure files exist in images bucket

## Suggested Next Improvements

- Add automated tests for API routes and validation
- Add role-based guards in admin UI components for action-level permissions
- Add CI pipeline for lint/build checks
- Add seed script for demo data

## License

No license file is currently included in this repository.
Add a LICENSE file if you intend to make usage terms explicit.

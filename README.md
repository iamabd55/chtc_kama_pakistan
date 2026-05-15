# Al Nasir Motors Pakistan — Web Platform

Official marketing website and operations admin panel for **Al Nasir Motors Pakistan** (CHTC Kama, Kinwin, and related commercial vehicle brands). Built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

**Production site:** [https://www.alnasirmotors.com](https://www.alnasirmotors.com)

---

## Table of contents

1. [Overview](#overview)
2. [Tech stack](#tech-stack)
3. [Public website](#public-website)
4. [Admin panel](#admin-panel)
5. [API reference](#api-reference)
6. [Database & migrations](#database--migrations)
7. [Environment variables](#environment-variables)
8. [Local setup](#local-setup)
9. [Project structure](#project-structure)
10. [Storage](#storage)
11. [Authentication & roles](#authentication--roles)
12. [Email notifications](#email-notifications)
13. [SEO & metadata](#seo--metadata)
14. [Deployment](#deployment)
15. [Scripts](#scripts)
16. [Troubleshooting](#troubleshooting)

---

## Overview

This repository contains:

| Area | Description |
|------|-------------|
| **Public website** | Product catalog, brands, dealers, inquiries, careers, news, gallery, testimonials, legal pages |
| **Admin panel** | Secured `/admin` workspace for products, dealers, inquiries, content, team, analytics, and settings |
| **API routes** | Server-side handlers for form submissions, inquiry tracking, testimonials, and admin operations |
| **Supabase backend** | PostgreSQL database, Auth, Storage, and Row Level Security (RLS) |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| UI | React 18, Tailwind CSS, shadcn/ui, Radix UI |
| Animation | Framer Motion |
| Charts (admin) | Recharts |
| Maps (dealers) | Leaflet / react-leaflet |
| Backend | [Supabase](https://supabase.com/) (Postgres, Auth, Storage) |
| Email | [Resend](https://resend.com/) |
| Fonts | Poppins, Rajdhani, DM Sans (Google Fonts) |

---

## Public website

### Homepage (`/`)

- Dynamic **hero slideshow** (from `site_settings.hero_slides` or `images/hero/` in Storage)
- **Vehicle categories** section
- **Stats**, **Why Al Nasir Motors**, **Brands**, **Fabrication** sections
- **CTA** (quote + find dealer)
- **Customer testimonials** — up to 3 approved reviews with link to full testimonials page
- Scrolling **announcement banner** (toggle + message from Site Settings)

### Products

| Route | Description |
|-------|-------------|
| `/products` | Full catalog explorer with category and brand filters |
| `/products/[category]` | Products in one category (e.g. mini-truck, ev-truck, bus-9m) |
| `/products/[category]/[slug]` | Product detail: gallery, specs, features, brochure download, product inquiry form |
| `/products/compare` | Side-by-side comparison of 2–3 vehicles (query: `?ids=`) |

**Brands supported:** Kama, Kinwin, CHTC Coaster (and Joylong brand page where applicable).

### Brands

| Route | Description |
|-------|-------------|
| `/brands` | Brand overview |
| `/brands/[brand]` | Individual brand page (kama, kinwin, joylong) |

### Dealers

| Route | Description |
|-------|-------------|
| `/find-dealer` | Dealer directory with map (Leaflet) and filters by city/province |
| `/find-dealer/[id]` | Single dealer detail with contact and map link |

### Customer inquiries & support

| Route | Description |
|-------|-------------|
| `/get-quote` | Quote / brochure request form |
| `/contact` | General contact form |
| `/after-sales` | Parts, service, and support requests |
| `/track-inquiry` | Public status lookup by reference number (no login) |

Inquiry submissions receive a **reference ID** and optional **confirmation email**.

### Testimonials

| Route | Description |
|-------|-------------|
| `/testimonials` | All approved customer reviews + **Share your experience** form |
| Homepage section | First 3 approved testimonials (by `display_order`) |

Public submissions are stored as **pending** until approved in admin.

### About & company

| Route | Description |
|-------|-------------|
| `/about` | Company overview |
| `/about/leadership` | Leadership & team (DB + static core team) |
| `/about/certifications` | Quality & certifications (from `certifications` table) |
| `/about/clients` | Valued clients logos (from `client_logos` table) |

### Content & media

| Route | Description |
|-------|-------------|
| `/news` | News listing with category filters |
| `/news/[slug]` | News article + optional related product |
| `/gallery` | Photo gallery (product, event, facility, delivery) |
| `/fabrication` | Fabrication services showcase |

### Careers

| Route | Description |
|-------|-------------|
| `/careers` | Open positions |
| `/careers/[id]` | Job detail + application form (CV upload or URL) |

### Legal

| Route | Description |
|-------|-------------|
| `/privacy` | Privacy policy |
| `/terms` | Terms of use |

### Global UI

- Sticky header with mega-menu (products by brand/category)
- Footer with quick links, company links, contact, social icons
- WhatsApp floating button
- Scroll progress indicator
- Site-wide settings from `site_settings` (phone, email, tagline, social links)

---

## Admin panel

**URL prefix:** `/admin` (not indexed by search engines)

**Login:** `/admin/login` — Supabase email/password auth

### Modules

| Route | Purpose |
|-------|---------|
| `/admin/dashboard` | KPIs, recent inquiries, quick actions, **announcement banner** toggle |
| `/admin/analytics` | Inquiry charts: volume, types, status funnel, cities, trends |
| `/admin/products` | Create/edit/delete products, images, specs, brochures |
| `/admin/categories` | Vehicle categories and ordering |
| `/admin/dealers` | Dealer network CRUD |
| `/admin/inquiries` | Lead pipeline: search, filter, status, notes, follow-up, email updates |
| `/admin/news` | News posts (draft/published), thumbnails, related product |
| `/admin/careers` | Job postings |
| `/admin/applications` | Job applications and status |
| `/admin/team` | Leadership team members and groups |
| `/admin/testimonials` | Approve/reject reviews, display order, manual add |
| `/admin/users` | Admin user management (**super_admin** only) |
| `/admin/settings` | Global site settings, hero slides JSON, contact info |

### Admin roles (`admin_profiles`)

| Role | Typical access |
|------|----------------|
| `super_admin` | Full access including user management |
| `editor` | Content and catalog |
| `sales` | Inquiries and dealers |
| `hr` | Careers and applications |

Session is enforced client-side in `AdminLayout` (redirects to login if unauthenticated).

### Content managed via database (public pages)

These tables power public pages; edit via **Supabase Table Editor** or SQL if no admin UI module exists:

- `gallery_items` → `/gallery`
- `certifications` → `/about/certifications`
- `client_logos` → `/about/clients`

---

## API reference

### Public — inquiries

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/inquiries/contact` | Contact form |
| `POST` | `/api/inquiries/quote` | Get a quote / brochure |
| `POST` | `/api/inquiries/product` | Product page inquiry |
| `POST` | `/api/inquiries/after-sales` | After-sales / service |
| `POST` | `/api/inquiries/news` | News-related inquiry |
| `GET` / `POST` | `/api/inquiries/track` | Lookup inquiry by public reference |

All inquiry routes validate Pakistani phone format (`03XXXXXXXXX`) and optional email. They create rows in `inquiries`, send admin + customer emails when configured, and redirect or return JSON.

### Public — careers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/careers/apply` | Job application with CV file upload or `cv_url` |

### Public — testimonials

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/testimonials/submit` | Submit review (JSON or form); status = `pending` |

### Admin (authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/inquiries` | List inquiries for dashboard/analytics |
| `PATCH` | `/api/admin/inquiries/[id]` | Update status, notes, assignee, follow-up |
| `DELETE` | `/api/admin/inquiries/[id]` | Delete inquiry |
| `POST` | `/api/admin/inquiries/bulk-delete` | Bulk delete |
| `GET` / `POST` / `PATCH` / `DELETE` | `/api/admin/users` | Admin user CRUD (super_admin) |

---

## Database & migrations

Apply SQL files in **`supabase/migrations/`** in numeric order (Supabase CLI or SQL Editor).

### Core tables

| Table | Purpose |
|-------|---------|
| `categories` | Vehicle categories |
| `products` | Vehicles (specs JSON, images array, brochure) |
| `dealers` | Sales/service locations |
| `inquiries` | Customer leads (`public_ref` for tracking) |
| `news_posts` | News and events |
| `career_posts` | Job listings |
| `job_applications` | Applications |
| `site_settings` | Singleton global config + announcement banner |
| `team_members` / `teams` | Leadership |
| `testimonials` | Customer reviews (`pending` / `approved` / `rejected`) |
| `gallery_items` | Gallery images |
| `certifications` | Compliance documents |
| `client_logos` | Client logos |
| `admin_profiles` | RBAC linked to `auth.users` |

TypeScript types: `src/lib/supabase/types.ts`

### Key migrations (selection)

| File | Notes |
|------|-------|
| `001_initial_schema.sql` | Base schema + seed categories/settings |
| `009_inquiry_public_refs.sql` | Public inquiry reference numbers |
| `026_announcement_banner.sql` | Top banner fields on `site_settings` |
| `026_content_modules.sql` | Team, gallery, certifications, testimonials |
| `027_admin_rbac.sql` | `admin_profiles` |
| `034_testimonials_display_order.sql` | `display_order` on testimonials |
| `035_testimonials_auto_display_order.sql` | Auto-increment display order trigger |

---

## Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### Required

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only; never expose to browser) |

### Email (recommended for production)

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key |
| `NOTIFICATION_FROM_EMAIL` | Verified sender address |
| `NOTIFICATION_FROM_NAME` | Sender display name |
| `SALES_NOTIFICATION_EMAIL` | Admin inbox for new inquiries/testimonials |

### Optional

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (SEO, sitemap, emails) |
| `INQUIRY_WEBHOOK_URL` | Webhook POST on new inquiries |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps (if used) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics |

**Graceful degradation:** Missing Resend or sales email skips notifications without breaking form submissions.

---

## Local setup

### Prerequisites

- Node.js 18+
- npm
- Supabase project (free tier is fine for development)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase and Resend values

# 3. Run all migrations in supabase/migrations/ (in order) via Supabase SQL Editor

# 4. Create Storage bucket "images" (public read) and apply storage RLS migrations

# 5. Create first admin user in Supabase Auth, then insert admin_profiles row:
#    role = 'super_admin', is_active = true

# 6. Start dev server
npm run dev
```

---

## Project structure

```
chtc_kama_pakistan/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout, fonts, SEO
│   ├── sitemap.ts                # Dynamic sitemap
│   ├── robots.ts                 # Robots policy
│   ├── products/                 # Catalog routes
│   ├── brands/                   # Brand pages
│   ├── find-dealer/              # Dealer finder
│   ├── testimonials/             # Reviews page
│   ├── news/                     # News
│   ├── careers/                  # Careers
│   ├── about/                    # About + dynamic sections
│   ├── admin/                    # Admin UI (15 modules)
│   └── api/                      # Route handlers
├── src/
│   ├── components/               # UI + feature components
│   │   ├── admin/                # Admin shell, tables, badges
│   │   ├── home/                 # Homepage sections
│   │   ├── products/             # Catalog UI
│   │   └── testimonials/         # Testimonial cards & forms
│   ├── lib/
│   │   ├── supabase/             # Clients, types, storage helpers
│   │   ├── notifications/        # Resend email templates
│   │   ├── validation/           # Form validation
│   │   ├── testimonials.ts       # Fetch + display order helpers
│   │   └── seo.ts                # Site URL, metadata helpers
│   └── hooks/                    # Shared React hooks
├── supabase/migrations/          # SQL schema (38 files)
├── public/images/                # Static brand assets
├── .env.example
├── package.json
└── README.md
```

---

## Storage

**Bucket:** `images` (public read)

| Path pattern | Usage |
|--------------|--------|
| `hero/*` | Homepage hero fallback images |
| `categories/*` | Category thumbnails |
| `products/*` | Product images |
| `careers/cv/*` | Uploaded CVs |
| `news/*` | News thumbnails |

URLs are normalized in `src/lib/supabase/storage.ts` (supports full URLs or bucket-relative paths).

---

## Authentication & roles

- **Public site:** No user accounts required for browsing or forms.
- **Admin:** Supabase Auth (`adminDb` client) with email/password.
- **Profiles:** `admin_profiles` links `auth.users` to roles.
- **API routes:** Admin APIs use `adminAuthorizedClient` (session + service role where needed).
- **Inquiry tracking:** Reference number only — no customer login.

---

## Email notifications

| Event | Recipient |
|-------|-----------|
| New inquiry (any form) | `SALES_NOTIFICATION_EMAIL` |
| Inquiry submitted (if email provided) | Customer confirmation |
| Inquiry status updated | Customer status email |
| New testimonial (pending) | `SALES_NOTIFICATION_EMAIL` |

Powered by Resend (`src/lib/notifications/`).

---

## SEO & metadata

- Per-route `metadata` and Open Graph images
- Dynamic **`/sitemap.xml`** (static routes + categories, products, dealers)
- **`robots.txt`** disallows `/admin`
- Organization JSON-LD in root layout
- Default canonical URL: `NEXT_PUBLIC_SITE_URL` or `https://www.alnasirmotors.com`

---

## Deployment

**Recommended:**

| Service | Role |
|---------|------|
| [Vercel](https://vercel.com/) | Next.js hosting |
| [Supabase](https://supabase.com/) | Database, Auth, Storage |

**Pre-deploy checklist:**

- [ ] All migrations applied on production Supabase
- [ ] Environment variables set in Vercel (or host)
- [ ] `images` bucket + RLS policies configured
- [ ] Resend domain verified; `NOTIFICATION_FROM_EMAIL` matches
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] At least one `super_admin` in `admin_profiles`
- [ ] Test inquiry + testimonial flows end-to-end

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production server locally |
| `npm run lint` | ESLint |
| `npm run build:turbopack` | Build with Turbopack |
| `npm run build:webpack` | Build with Webpack |

---

## Troubleshooting

### Admin login works but pages are empty or redirect loops

- Confirm a row exists in `admin_profiles` for your `user_id`
- Set `is_active = true`

### Inquiries save but no email

- Check `RESEND_API_KEY`, `NOTIFICATION_FROM_EMAIL`, `SALES_NOTIFICATION_EMAIL`
- Verify sender domain in Resend dashboard

### Testimonials not on homepage

- Status must be **`approved`**
- `is_active` must be **`true`**
- Run migrations `034` and `035` for `display_order`

### CV upload fails on careers

- `SUPABASE_SERVICE_ROLE_KEY` required
- Storage bucket `images` must allow service-role uploads

### Product images broken

- Check paths in DB match files in `images` bucket
- Confirm `NEXT_PUBLIC_SUPABASE_URL` is correct

### Announcement banner not scrolling

- Enable banner in **Admin → Dashboard** or **Site Settings**
- Set a non-empty `announcement_banner_message`

---

## License

No license file is included. Add a `LICENSE` file if you need explicit usage terms.

---

## Contact

For business inquiries, use the website contact form or details in **Site Settings** (phone, email, WhatsApp).

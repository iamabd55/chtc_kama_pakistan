# Al Nasir Motors Pakistan — Web Platform

Official marketing website and operations admin panel for **Al Nasir Motors Pakistan** (CHTC Kama, Kinwin, and related commercial vehicle brands). Built with **Next.js App Router**, **TypeScript**, **Tailwind CSS v4**, and **Supabase**.

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
| **Admin panel** | Secured `/admin` workspace for products, dealers, inquiries, content, team, analytics, and settings (includes Light/Dark theme support, mobile optimizations, and automated session expiry) |
| **API routes** | Server-side handlers for form submissions, inquiry tracking, testimonials, admin operations, and cache revalidation |
| **Supabase backend** | PostgreSQL database, Auth, Storage, and Row Level Security (RLS) policies |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16 (App Router)](https://nextjs.org/) |
| Language | TypeScript |
| UI & Styles | **React 19**, **Tailwind CSS v4** (CSS-native theme config), [shadcn/ui](https://ui.shadcn.com/), Radix UI |
| Animation | [Framer Motion v12](https://www.framer.com/motion/) |
| Animation CSS | `tw-animate-css` (replaces `tailwindcss-animate`) |
| Charts (admin) | [Recharts](https://recharts.org/) |
| Maps (dealers) | [Leaflet](https://leafletjs.com/) / `react-leaflet` |
| Backend | [Supabase](https://supabase.com/) (Postgres, Auth, Storage) |
| Email | [Resend](https://resend.com/) |
| Fonts | Poppins, Rajdhani, DM Sans (Google Fonts) |

### Note on Tailwind CSS v4 Migration
The codebase utilizes **Tailwind CSS v4** with a PostCSS compiler (`@tailwindcss/postcss`). 
- **CSS-Native Configuration**: All design tokens, custom fonts, keyframes, custom animations, and layout utilities are now defined directly in the `@theme` block inside [app/globals.css](file:///g:/Semester5/Web/New%20folder/chtc_kama_pakistan/app/globals.css).
- **Source Paths**: Scanned source directories are defined via the `@source` directive in [app/globals.css](file:///g:/Semester5/Web/New%20folder/chtc_kama_pakistan/app/globals.css):
  ```css
  @source "../app/**/*.{ts,tsx}";
  @source "../src/**/*.{ts,tsx}";
  ```
- **Tooling Compatibility**: The [tailwind.config.ts](file:///g:/Semester5/Web/New%20folder/chtc_kama_pakistan/tailwind.config.ts) file is retained **only** for editor IntelliSense, tooling integration, and the shadcn CLI. It is **not** consumed at build time.

---

## Public website

### Homepage (`/`)

- Dynamic **hero slideshow** (fetched from `site_settings.hero_slides` or fallback images in Supabase Storage `images/hero/`)
- **Vehicle categories** section
- **Stats**, **Why Al Nasir Motors**, **Brands**, and **Fabrication** sections
- **CTA** elements (inquiry submission + find dealer)
- **Customer testimonials** — displays up to 3 approved testimonials sorted by `display_order`
- Scrolling **announcement banner** at the top (controlled via Site Settings toggles)

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
| `/find-dealer/[id]` | Single dealer detail with contact and interactive map link |

### Customer inquiries & support

| Route | Description |
|-------|-------------|
| `/get-quote` | Quote / brochure request form |
| `/contact` | General contact form |
| `/after-sales` | Parts, service, and support requests |
| `/track-inquiry` | Public status lookup by reference number (no login) |

Inquiry submissions receive a unique **reference ID** and optional **confirmation email**.

### Testimonials

| Route | Description |
|-------|-------------|
| `/testimonials` | All approved customer reviews + **Share your experience** submission form |
| Homepage section | Displays the top 3 approved testimonials (sorted by `display_order`) |

Public submissions are stored as **pending** until manually approved in the admin panel.

### About & company

| Route | Description |
|-------|-------------|
| `/about` | Company overview |
| `/about/leadership` | Leadership & team (database driven + static core team) |
| `/about/certifications` | Quality & certifications (fetched from `certifications` table) |
| `/about/clients` | Valued clients logos (fetched from `client_logos` table) |

### Content & media

| Route | Description |
|-------|-------------|
| `/news` | News listing with category filters |
| `/news/[slug]` | News article + optional related product reference |
| `/gallery` | Photo gallery (product, event, facility, delivery) |
| `/fabrication` | Fabrication services showcase with visual layout updates |

### Careers

| Route | Description |
|-------|-------------|
| `/careers` | Open positions list |
| `/careers/[id]` | Job details + application form (with CV file upload or URL) |

### Legal

| Route | Description |
|-------|-------------|
| `/privacy` | Privacy policy |
| `/terms` | Terms of use |

### Global UI

- Sticky header with mega-menu (products sorted by brand/category)
- Footer with quick links, company links, contact info, and social icons
- Floating WhatsApp chat button
- Scroll progress indicator
- Site-wide settings from `site_settings` (phone, email, tagline, social links)

---

## Admin panel

**URL prefix:** `/admin` (not indexed by search engines)

**Login:** `/admin/login` — Supabase email/password auth

### Key Admin Overhaul Features
1. **Dual-Theme Support**: Persistent Light and Dark mode styles. Themes can be toggled in the sidebar and are synced to local storage and the `data-admin-theme` document attribute via the [useAdminTheme](file:///g:/Semester5/Web/New%20folder/chtc_kama_pakistan/src/hooks/useAdminTheme.tsx) hook.
2. **Mobile Optimization**: Complete responsiveness overhaul for admin pages, introducing an adaptive sidebar, collapsible menus, and a dedicated mobile bottom navigation bar (`admin-bottom-nav`) for smaller screens.
3. **Session Security (1-Hour Expiry)**: Monitors logged-in state via the [useAdminSession](file:///g:/Semester5/Web/New%20folder/chtc_kama_pakistan/src/hooks/useAdminSession.ts) hook. Shows a warning toast at the 55-minute mark (5 minutes remaining) and performs a hard sign-out at the 1-hour mark to safeguard admin access.
4. **Cache Revalidation**: When dealers are created, updated, or deleted, the system executes an automated static page revalidation call via the [revalidateDealerPages](file:///g:/Semester5/Web/New%20folder/chtc_kama_pakistan/src/lib/revalidate-dealers.ts) helper, immediately updating the customer-facing `/find-dealer` static pages.

### Modules

| Route | Purpose |
|-------|---------|
| `/admin/dashboard` | KPIs, recent inquiries, quick actions, **announcement banner** toggle |
| `/admin/analytics` | Inquiry charts: volume, types, status funnel, cities, trends |
| `/admin/products` | Create/edit/delete products, images, specs, brochures (triggers storage cleanup) |
| `/admin/categories` | Vehicle categories management and sorting (triggers storage cleanup) |
| `/admin/dealers` | Dealer network CRUD (triggers cache revalidation) |
| `/admin/inquiries` | Lead pipeline: search, filter, status, notes, assignee, follow-ups, email updates |
| `/admin/news` | News posts (draft/published), thumbnails, related product |
| `/admin/careers` | Job postings CRUD |
| `/admin/applications` | Job applications and CV review status |
| `/admin/team` | Leadership team members, roles, and groups |
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

---

## API reference

### Public — inquiries

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/inquiries/contact` | Contact form submission |
| `POST` | `/api/inquiries/quote` | Get a quote / brochure |
| `POST` | `/api/inquiries/product` | Product page inquiry |
| `POST` | `/api/inquiries/after-sales` | After-sales / service |
| `POST` | `/api/inquiries/news` | News-related inquiry |
| `GET` / `POST` | `/api/inquiries/track` | Lookup inquiry by public reference |

All inquiry routes validate Pakistani phone format (`03XXXXXXXXX`) and optional email. They create rows in `inquiries`, send admin + customer emails when configured, and return JSON responses.

### Public — careers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/careers/apply` | Job application with CV file upload or `cv_url` |

### Public — testimonials

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/testimonials/submit` | Submit review; default status = `pending` |

### Admin (authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/inquiries` | List inquiries for dashboard/analytics |
| `PATCH` | `/api/admin/inquiries/[id]` | Update status, notes, assignee, follow-up |
| `DELETE` | `/api/admin/inquiries/[id]` | Delete inquiry |
| `POST` | `/api/admin/inquiries/bulk-delete` | Bulk delete inquiries |
| `GET` / `POST` / `PATCH` / `DELETE` | `/api/admin/users` | Admin user CRUD (super_admin) |
| `POST` | `/api/admin/revalidate/dealers` | Purges static `/find-dealer` page caches |

---

## Database & migrations

Database migrations are stored in [supabase/migrations/](file:///g:/Semester5/Web/New%20folder/chtc_kama_pakistan/supabase/migrations). Run all SQL migration files in numeric order via the Supabase CLI or SQL Editor.

### Core tables

| Table | Purpose |
|-------|---------|
| `categories` | Vehicle categories |
| `products` | Vehicles (specs JSON, images array, brochure link) |
| `dealers` | Sales/service locations |
| `inquiries` | Customer leads (`public_ref` for tracking) |
| `news_posts` | News and events |
| `career_posts` | Job listings |
| `job_applications` | Applications |
| `site_settings` | Singleton global config + announcement banner |
| `team_members` / `teams` | Leadership team members and leadership groups |
| `testimonials` | Customer reviews (`pending` / `approved` / `rejected`) |
| `gallery_items` | Gallery images |
| `certifications` | Compliance documents |
| `client_logos` | Client logos |
| `admin_profiles` | RBAC linked to `auth.users` |

TypeScript types: [src/lib/supabase/types.ts](file:///g:/Semester5/Web/New%20folder/chtc_kama_pakistan/src/lib/supabase/types.ts)

### Key migrations (selection)

| File | Notes |
|------|-------|
| `001_initial_schema.sql` | Base schema + seed categories/settings |
| `009_inquiry_public_refs.sql` | Public inquiry reference numbers |
| `026_announcement_banner.sql` | Top banner fields on `site_settings` |
| `026_content_modules.sql` | Team, gallery, certifications, testimonials |
| `027_admin_rbac.sql` | `admin_profiles` setup |
| `034_testimonials_display_order.sql` | `display_order` column on testimonials |
| `035_testimonials_auto_display_order.sql` | Auto-increment display order trigger |

---

## Environment variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### Required Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only; **never** expose to browser) |

### Email Variables (recommended for production)

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key |
| `NOTIFICATION_FROM_EMAIL` | Verified sender address (e.g., noreply@alnasirmotors.com) |
| `NOTIFICATION_FROM_NAME` | Sender display name (e.g., Al Nasir Motors Pakistan) |
| `SALES_NOTIFICATION_EMAIL` | Admin inbox for new inquiries/testimonials |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (SEO, sitemap, emails) |
| `INQUIRY_WEBHOOK_URL` | Webhook POST target on new inquiries |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key (if used) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics measurement ID |

---

## Local setup

### Prerequisites
- **Node.js** 18+ (tested and compatible with React 19 / Next 16)
- **npm** (v9 or newer)
- **Supabase Account & Project** (free tier is fine)
- **Resend Account** (optional, for email testing)

### Step-by-Step Installation

#### 1. Clone the repository & Install Dependencies
Navigate to the root directory and install dependencies:
```bash
npm install
```

#### 2. Configure Environment Variables
Create a local environment file and fill in your Supabase credentials, service role keys, and optional Resend values:
```bash
cp .env.example .env.local
```

#### 3. Run Database Migrations
You need to apply the schemas to your Supabase PostgreSQL database. 
- **Option A (Supabase Dashboard)**: Go to your Supabase project's SQL Editor. Open and run the migration files located in [supabase/migrations/](file:///g:/Semester5/Web/New%20folder/chtc_kama_pakistan/supabase/migrations) in sequential order:
  1. `001_initial_schema.sql`
  2. `002_real_categories.sql`
  3. ... through `035_testimonials_auto_display_order.sql`.
- **Option B (Supabase CLI)**: If you have Supabase CLI installed, link your project and apply the migrations:
  ```bash
  supabase login
  supabase link --project-ref your-project-ref
  supabase db push
  ```

#### 4. Configure Supabase Storage
- Open the Supabase Dashboard, navigate to **Storage**, and create a new bucket named **`images`**.
- Set the bucket privacy to **Public** (public read access).
- Apply the storage security policies by running the storage migrations: `005_storage_rls.sql` and `028_storage_admin_write.sql`.

#### 5. Initialize the Super Admin User
Since the admin panel redirects unauthenticated users and restricts access by role:
1. Go to your Supabase project's **Authentication** tab and create a new user (with the email and password you'd like to use for admin access).
2. Copy the user's UUID (**User ID**).
3. Open the Supabase SQL Editor and execute an insert statement to register them as a `super_admin`:
   ```sql
   INSERT INTO admin_profiles (id, email, role, is_active)
   VALUES ('YOUR_USER_UUID', 'your-admin-email@example.com', 'super_admin', true);
   ```

#### 6. Start the Development Server
Run the local dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the site, and [http://localhost:3000/admin](http://localhost:3000/admin) to log into the admin dashboard.

---

## Project structure

```
chtc_kama_pakistan/
├── app/                          # Next.js App Router (Next 16)
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout, fonts, SEO setup
│   ├── sitemap.ts                # Dynamic sitemap generator
│   ├── robots.ts                 # Robots policy
│   ├── globals.css               # Tailwind CSS v4 import, @theme, custom styles
│   ├── products/                 # Vehicle catalog routes
│   ├── brands/                   # Brand description pages
│   ├── find-dealer/              # Dealer finder directory (static page)
│   ├── testimonials/             # Customer reviews submission & display
│   ├── news/                     # News listing & article details
│   ├── careers/                  # Job details & applications
│   ├── about/                    # About and leadership pages
│   ├── admin/                    # Overhauled Admin UI (15 modules)
│   └── api/                      # Backend route handlers & cache revalidators
├── src/
│   ├── components/               # UI components
│   │   ├── admin/                # Overhauled sidebar, theme toggle, tables, badges
│   │   ├── home/                 # Hero slides, stats, why choose us
│   │   ├── products/             # Product grid, specs comparisons
│   │   └── testimonials/         # Reviews carousel
│   ├── lib/
│   │   ├── supabase/             # Clients, types, storage cleanup helper
│   │   ├── notifications/        # Resend email templates
│   │   ├── validation/           # Form zod validation definitions
│   │   ├── testimonials.ts       # Testimonial display order helpers
│   │   └── seo.ts                # Metadata utilities
│   └── hooks/                    # Custom hooks
│       ├── useAdminSession.ts    # Enforces 1-hour session security
│       ├── useAdminTheme.tsx     # Provides Dark/Light mode context
│       └── useOptimization.ts    # Debounce / optimization utilities
├── supabase/migrations/          # Database schema migrations (38 files)
├── public/images/                # Static assets
├── .env.example
├── package.json
└── README.md
```

---

## Storage

**Bucket:** `images` (must be public-read)

| Path pattern | Usage |
|--------------|--------|
| `hero/*` | Homepage hero slideshow images |
| `categories/*` | Category hover and main thumbnails |
| `products/*` | Product specification files & image galleries |
| `careers/cv/*` | Uploaded applicant resumes (PDF/docs) |
| `news/*` | Article thumbnails |

### Automated Orphan Cleanup
To avoid storage bloat, deleting a product or category from the admin panel triggers the [deleteProductStorage](file:///g:/Semester5/Web/New%20folder/chtc_kama_pakistan/src/lib/supabase/storage-cleanup.ts) or [deleteCategoryStorage](file:///g:/Semester5/Web/New%20folder/chtc_kama_pakistan/src/lib/supabase/storage-cleanup.ts) handlers. They list all bucket assets under the target folder prefix and remove them from Supabase Storage automatically.

---

## Authentication & roles

- **Public site**: No user accounts required for browsing, inquiry submission, or testimonial sharing.
- **Admin Workspace**: Restricts access via Supabase Auth.
- **Role-Based Access Control (RBAC)**: Enforced via the `admin_profiles` table matching auth user IDs to defined roles (`super_admin`, `editor`, `sales`, `hr`).
- **Session Security**: Admin sessions expire after 1 hour of runtime. Warnings appear 5 minutes before automatic logout.

---

## Email notifications

| Event | Recipient |
|-------|-----------|
| New inquiry (any public form) | `SALES_NOTIFICATION_EMAIL` |
| Inquiry submitted (if email provided) | Customer confirmation receipt |
| Inquiry status updated | Customer status update notification |
| New testimonial submitted | `SALES_NOTIFICATION_EMAIL` (notifying admin to approve) |

Powered by Resend integration inside [src/lib/notifications/](file:///g:/Semester5/Web/New%20folder/chtc_kama_pakistan/src/lib/notifications).

---

## SEO & metadata

- Per-route dynamic metadata & Open Graph images
- Dynamic **`/sitemap.xml`** maps categories, products, and dealers
- **`robots.txt`** config disallows indexing `/admin`
- Organization JSON-LD microdata in root layout
- Default canonical URL: `NEXT_PUBLIC_SITE_URL` or `https://www.alnasirmotors.com`

---

## Deployment

### Recommended Services
- **Next.js Frontend**: [Vercel](https://vercel.com/) (fully compatible with App Router cached builds)
- **Database & Auth**: [Supabase](https://supabase.com/)

### Pre-deployment Checklist
- [ ] Run all migrations in production Supabase database.
- [ ] Create the public `images` bucket in production and apply RLS policies.
- [ ] Configure all Vercel environment variables, including `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY`.
- [ ] Ensure `NEXT_PUBLIC_SITE_URL` matches the production domain.
- [ ] Seed the initial `super_admin` in `admin_profiles` using their production auth UID.
- [ ] Verify the Resend domain and update `NOTIFICATION_FROM_EMAIL` to match your verified sender.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Runs Next.js development server locally |
| `npm run build` | Builds the production bundle |
| `npm run build:turbopack` | Builds the production bundle using Turbopack compiler |
| `npm run build:webpack` | Builds the production bundle using Webpack compiler |
| `npm run start` | Runs the built production server locally |
| `npm run lint` | Runs ESLint utility for code quality checks |

---

## Troubleshooting

### Admin login works but dashboard is empty or redirects in a loop
- Verify that a record corresponding to the auth User ID exists in the `admin_profiles` table.
- Verify that `is_active` is set to `true` for that profile row.
- Ensure the user's role is correctly populated.

### Active admin session logs out suddenly
- The admin workspace implements a 1-hour session timeout for security. If you are logged out, simply log back in to renew your session. Your browser local storage time stamps (`admin_session_start`) are verified every 30 seconds.

### Inquiries save but emails are not sent
- Verify that `RESEND_API_KEY` is set.
- Ensure `NOTIFICATION_FROM_EMAIL` is verified in your Resend Dashboard.
- Verify `SALES_NOTIFICATION_EMAIL` contains a valid email address.

### Testimonials not showing up on the homepage
- Homepage testimonials must be set to `approved` and have `is_active = true` in the testimonials database table.
- Ensure the display order migrations (`034` and `035`) are applied to configure display ordering correctly.

### CV upload fails on careers page
- Check that the `SUPABASE_SERVICE_ROLE_KEY` is present.
- Check that the `images` bucket is configured to allow authenticated/service-role file uploads in storage policies.

### Styles not updating or Tailwind classes missing
- Since Tailwind v4 compiles via PostCSS, make sure your build output doesn't cache old stylesheets.
- Ensure classes are correctly scanned by verifying they exist within files located under the folders defined in `@source` in [app/globals.css](file:///g:/Semester5/Web/New%20folder/chtc_kama_pakistan/app/globals.css).

---

## License

No license file is included. Add a `LICENSE` file if you require explicit usage terms.

---

## Contact

For business inquiries, use the website contact form or contact information defined in **Site Settings** (phone, email, WhatsApp).

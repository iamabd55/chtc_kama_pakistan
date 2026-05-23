# Al Nasir Motors Pakistan

> A production-grade commercial vehicle marketing platform and operations admin panel built for CHTC Kama and Kinwin brands in Pakistan.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel&logoColor=white)](https://www.alnasirmotors.com)

**🌐 Live Site → [alnasirmotors.com](https://www.alnasirmotors.com)** &nbsp;&nbsp; **🔐 Admin Panel → [alnasirmotors.com/admin](https://www.alnasirmotors.com/admin)**

---

## Screenshots

![Homepage](/public/screenshots/homepage.png)

![Vehicles](/public/screenshots/vehicles.png)

![Brands](/public/screenshots/brands.png)

![Admin Panel](/public/screenshots/adminPanel.png)

---

## Overview

This is the official web platform for **Al Nasir Motors Pakistan**, a commercial vehicle distributor for CHTC Kama and Kinwin brands. The platform consists of two parts:

- **Public website** — product catalog, dealer finder, inquiries, news, careers, gallery, and testimonials
- **Admin panel** — a fully secured internal workspace for managing all content, leads, and site settings

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, shadcn/ui, Radix UI |
| Styling | Tailwind CSS v4 (CSS-native `@theme`) |
| Animation | Framer Motion v12, tw-animate-css |
| Backend | Supabase — Postgres, Auth, Storage, RLS |
| Email | Resend |
| Maps | Leaflet / react-leaflet |
| Charts | Recharts |
| Fonts | Poppins, Rajdhani, DM Sans |

> Tailwind CSS v4 is configured entirely through the `@theme` block in `app/globals.css` using the PostCSS compiler. The `tailwind.config.ts` file is retained only for editor IntelliSense and the shadcn CLI.

---

## Features

### Public Website

- **Hero slideshow** — dynamic slides managed from the admin panel with Supabase Storage fallback
- **Product catalog** — `/products`, `/products/[category]`, and full detail pages with specs, image gallery, brochure download, and an inline inquiry form
- **Vehicle comparison** — side-by-side comparison of up to 3 models
- **Dealer finder** — interactive Leaflet map with city and province filters, plus individual dealer detail pages
- **Inquiry system** — every submission gets a unique reference ID; customers can track their inquiry status at `/track-inquiry` without logging in
- **Testimonials** — customers submit reviews publicly; admin approves them before they appear on the site
- **Careers** — job listings with individual detail pages and a CV upload/URL application form
- **News & gallery** — fully database-driven
- **Announcement banner** — scrolling top banner toggled on/off from the admin dashboard

### Admin Panel

- **Role-based access control** via `admin_profiles` — four roles: `super_admin`, `editor`, `sales`, `hr`
- **Full content management** — products, categories, dealers, news, careers, team members, testimonials, gallery
- **Inquiry pipeline** — search, filter, update status, add notes, assign to team members, schedule follow-ups, send email updates to customers
- **Analytics dashboard** — inquiry volume over time, type breakdown, status funnel, top cities, and trends
- **1-hour session security** — automatic sign-out at 60 minutes with a warning toast at 55 minutes
- **Light / Dark theme** — persistent across sessions via localStorage
- **Mobile-first admin layout** — collapsible sidebar, adaptive menus, dedicated bottom navigation bar on small screens
- **Auto cache revalidation** — any dealer CRUD operation instantly updates the static `/find-dealer` pages
- **Automated storage cleanup** — deleting a product or category removes all associated files from Supabase Storage

---

## Project Structure

```
chtc_kama_pakistan/
├── app/
│   ├── globals.css           # Tailwind v4 @theme, custom styles, @source directives
│   ├── layout.tsx            # Root layout, fonts, SEO metadata, JSON-LD
│   ├── page.tsx              # Homepage
│   ├── sitemap.ts            # Dynamic sitemap
│   ├── robots.ts             # Disallows /admin from indexing
│   ├── products/             # Catalog, category, detail, and compare routes
│   ├── find-dealer/          # Dealer directory and individual dealer pages
│   ├── admin/                # Admin panel — 15 modules
│   └── api/                  # All server-side route handlers
├── src/
│   ├── components/           # UI components (admin, home, products, testimonials)
│   ├── lib/
│   │   ├── supabase/         # Browser/server clients, TypeScript types, storage cleanup
│   │   ├── notifications/    # Resend email templates
│   │   ├── validation/       # Zod schemas
│   │   ├── revalidate-dealers.ts
│   │   └── seo.ts
│   └── hooks/
│       ├── useAdminSession.ts    # Enforces 1-hour session expiry
│       ├── useAdminTheme.tsx     # Dark/Light mode context provider
│       └── useOptimization.ts   # Debounce utilities
├── public/
│   └── screenshots/          # README preview images
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/chtc_kama_pakistan.git
cd chtc_kama_pakistan
```

**2. Install dependencies**

```bash
npm install
```

**3. Add environment variables**

```bash
cp .env.example .env.local
```

Fill in the values — see [Environment Variables](#environment-variables) below.

**4. Start the development server**

```bash
npm run dev
```

| URL | |
|---|---|
| `http://localhost:3000` | Public website |
| `http://localhost:3000/admin` | Admin panel |

---

## Environment Variables

### Required

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — server-only, never expose to the browser |

### Email

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key |
| `NOTIFICATION_FROM_EMAIL` | Verified sender address |
| `NOTIFICATION_FROM_NAME` | Sender display name |
| `SALES_NOTIFICATION_EMAIL` | Admin inbox for new inquiry and testimonial alerts |

### Optional

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO, sitemap, and emails |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics measurement ID |
| `INQUIRY_WEBHOOK_URL` | Webhook endpoint called on new inquiry submissions |

---

## API Reference

### Public — Inquiries

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/inquiries/contact` | General contact form |
| `POST` | `/api/inquiries/quote` | Quote / brochure request |
| `POST` | `/api/inquiries/product` | Product page inquiry |
| `POST` | `/api/inquiries/after-sales` | After-sales / service request |
| `GET` `POST` | `/api/inquiries/track` | Public status lookup by reference number |

### Public — Careers & Testimonials

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/careers/apply` | Job application with CV upload or link |
| `POST` | `/api/testimonials/submit` | Submit a review (stored as `pending`) |

### Admin (authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/inquiries` | List and filter inquiries |
| `PATCH` | `/api/admin/inquiries/[id]` | Update status, notes, assignee |
| `DELETE` | `/api/admin/inquiries/[id]` | Delete inquiry |
| `POST` | `/api/admin/inquiries/bulk-delete` | Bulk delete |
| `POST` | `/api/admin/revalidate/dealers` | Purge static dealer page caches |
| `*` | `/api/admin/users` | Admin user management (`super_admin` only) |

---

## Admin Roles

| Role | Access |
|---|---|
| `super_admin` | Full access including user management |
| `editor` | Products, categories, news, careers, team, testimonials |
| `sales` | Inquiries and dealers |
| `hr` | Careers and job applications |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run build:turbopack` | Production build with Turbopack |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## Deployment

| Service | Purpose |
|---|---|
| [Vercel](https://vercel.com/) | Next.js hosting |
| [Supabase](https://supabase.com/) | Postgres database, Auth, Storage |
| [Resend](https://resend.com/) | Transactional email |

© 2026 Al-Nasir-Motors. All rights reserved.

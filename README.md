# CSDF Website

Trilingual (English / සිංහල / தமிழ்) website for the Community Strength Development Foundation, with a full admin panel to manage every piece of content on the site.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui (Radix UI) · Prisma · MySQL · NextAuth · PayHere

## Features

- Public pages: Home, About Us (overview/vision/mission/community), Projects, Services, Research & Report Publications, News, Events & Gallery, Community Business (product showcase with WhatsApp ordering), Suggestions, Contact, Donation
- Language switcher (EN/SI/TA) — every content field is editable in all three languages, with automatic English fallback
- Admin panel at `/admin` — manage projects, services, publications (PDF uploads), news, events, gallery, products, testimonials, partners, impact stats, and all site settings (hero text, about text, contact info, bank details, etc.)
- Inboxes for donations, suggestions, contact messages, and newsletter subscribers
- Online donations via PayHere (sandbox & live), plus admin-editable bank transfer details
- Image/PDF uploads stored in `public/uploads`

## Setup

### 1. Requirements

- Node.js 18.17+ (20+ recommended)
- MySQL 8 (or MariaDB 10.4+)

### 2. Install

```bash
npm install
```

### 3. Configure environment

```bash
copy .env.example .env   # Windows (use `cp` on macOS/Linux)
```

Edit `.env`:

- `DATABASE_URL` — your MySQL connection string. Create the database first:
  ```sql
  CREATE DATABASE csdf CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```
  utf8mb4 is required for Sinhala/Tamil text.
- `NEXTAUTH_SECRET` — any long random string (`openssl rand -base64 32`)
- `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` in development; your domain in production
- `PAYHERE_MERCHANT_ID` / `PAYHERE_MERCHANT_SECRET` — from your [PayHere](https://www.payhere.lk) merchant dashboard (use a [sandbox account](https://sandbox.payhere.lk) for testing)
- `PAYHERE_MODE` — `sandbox` or `live`

### 4. Create tables and seed content

```bash
npm run db:push
npm run db:seed
```

The seed creates all pages' starter content in three languages, sample projects/services/news/events, and the admin account:

> **Login:** `admin@csdf.lk` / `admin12345` — **change this password immediately** (Dashboard → Change Password).

### 5. Run

```bash
npm run dev        # development — http://localhost:3000
npm run build      # production build
npm start          # production server
```

Site: `http://localhost:3000` · Admin: `http://localhost:3000/admin`

## PayHere notes

- The **notify webhook** (`/api/payhere/notify`) must be reachable from the internet for donation statuses to update. On localhost, use a tunnel (e.g. `ngrok http 3000`) and set `NEXT_PUBLIC_SITE_URL` to the tunnel URL while testing.
- In the PayHere dashboard, whitelist your domain under Settings → Domains & Credentials.
- Donations are recorded as `pending` when the visitor is redirected, then updated to `success`/`failed`/`cancelled` by the webhook (signature-verified).

## Content management

Everything visible on the site is editable:

- **Site Settings** (`/admin/settings`) — site name, tagline, hero section, about texts, contact details, WhatsApp number, map embed, bank details
- **Content** — CRUD for all content types; each text field has EN/SI/TA inputs (Sinhala/Tamil optional; English shown as fallback)
- **Inbox** — donations, suggestions, contact messages, subscribers

## Deployment

Deploy to any Node.js host (VPS, cPanel with Node, Railway, etc.) with MySQL. Note: uploads are written to `public/uploads` on disk, so use a host with a persistent filesystem (serverless platforms like Vercel need S3-style storage instead — not wired up by default).

Suggested production start (PM2):

```bash
npm run build
pm2 start npm --name csdf -- start
```

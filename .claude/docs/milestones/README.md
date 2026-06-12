# Milestones — Source of Truth

> READ-ONLY. This file reflects the Upwork contract milestones. Do not edit.
> Scope conflicts are resolved by this document first, then `decisions.md`.

---

## Contract Overview

| # | Milestone | Duration | Focus |
|---|---|---|---|
| M1 | Foundation, Architecture & Authentication | Week 1 (Jun 8–14) | Scaffold, DB schema, auth, roles |
| M2 | Marketplace Module | Week 2 (Jun 15–21) | Product listing, categories, search, filters |
| M3 | Creator Public Pages & Video System | Week 3 (Jun 22–28) | Creator profiles, video feed, linked products |
| M4 | Referral, UTM & Attribution Engine | Week 4 (Jun 29–Jul 5) | Click tracking, cookie window, commission logic |
| M5 | Stripe Payments, Refunds & Commission Reversal | Week 5 (Jul 6–12) | Checkout, webhooks, refunds, commission reversal |
| M6 | Creator Dashboard & Analytics | Week 6 (Jul 13–19) | Creator stats, earnings, payout requests |
| M7 | Admin Dashboard | Week 7 (Jul 20–26) | Platform KPIs, user/product/order management |
| M8 | Testing, Polish & Deployment | Week 8 (Jul 27–Aug 2) | E2E tests, accessibility, production deploy |

---

## M1 — Foundation, Architecture & Authentication

### A. Project Setup & Scalable Architecture
- Next.js 15 App Router + TypeScript strict mode
- Tailwind CSS v4 + shadcn/ui component library
- Folder structure: app, components, lib, types, hooks, db, services
- Supabase DB + Auth + Storage + RLS policies
- GitHub CI (typecheck + lint on push/PR)
- Vercel deployment config
- Base responsive layout shell (Header, Footer, Navigation)
- Global styles + error boundaries (error.tsx, not-found.tsx)

### B. Authentication & Role-Based Access
- Google OAuth + Email/Password via Supabase Auth
- Multi-role: user / creator / admin
- Admin sub-roles: super_admin, product_manager, creator_manager, order_manager, moderator
- Role-permission matrix (admin_permissions table + seed)
- `hasPermission()` + `requirePermission()` utilities
- Registration, login, password reset, email verification, logout
- Protected routes by role

### C. Database Schema Design
- All 18 tables with indexes, FKs, RLS
- Per-product reward fields (direct/warm reward type + value)
- Seed: categories (9), admin roles + permissions, attribution config

---

## M2 — Marketplace Module

### A. Product Catalogue
- Product listing page with grid layout
- 9 category filter sidebar
- Search (name + description, trigram GIN index)
- Sort: newest, price asc/desc, trending
- Pagination (cursor-based or offset)

### B. Product Detail Page
- Product images, name, price, description
- Creator attribution display (who promoted it)
- Add to cart / Buy now
- Related products

### C. Cart & Checkout Entry
- Cart state (client-side, persisted to localStorage)
- Cart drawer / page
- Checkout entry point → hand off to Stripe (M5)

---

## M3 — Creator Public Pages & Video System

### A. Creator Profile Page (`/[creatorSlug]`)
- Creator bio, avatar, stats (followers, total sales)
- Video/reel feed (YouTube, Instagram, TikTok link-out + native MP4/MOV)
- Linked products grid under each video

### B. Native Video Upload
- MP4/MOV, vertical orientation, 30–90 seconds, max 100MB
- Upload to Supabase Storage via signed URL
- Video metadata stored in `videos` table
- Link video to one or more products

### C. Referral Link System
- Unique creator slug: `facelo.com/valeria`
- Product deep link: `facelo.com/valeria/product/123`
- Copy-link button on creator dashboard

---

## M4 — Referral, UTM & Attribution Engine

### A. Click Tracking
- Record every referral link click to `click_events`
- Capture: creator_id, product_id (if deep link), UTM params, traffic source, IP, user-agent

### B. Attribution Cookie
- Set `facelo_attr` cookie on click (7-day window, configurable)
- Cookie payload: creator_id, timestamp, product_id
- Last-touch model: newer click overwrites older

### C. Attribution at Checkout
- Read cookie at order creation
- Determine Direct (cookie product = ordered product) vs Warm (other product within window)
- Write attribution result to `referral_events` and `commissions`

### D. Admin Attribution Config
- Adjust window duration
- View direct vs warm split stats

---

## M5 — Stripe Payments, Refunds & Commission Reversal

### A. Stripe Checkout
- Stripe Checkout Session creation (Server Action)
- Redirect to Stripe hosted page
- Success/cancel redirect handling

### B. Webhook Handling
- `checkout.session.completed` → create order + order_items + payment record
- `payment_intent.payment_failed` → mark payment failed
- `charge.refunded` → create refund record + reverse commission

### C. Commission Reversal
- On refund: set commission status to `reversed`, record reversal timestamp + initiator
- Only `completed` + non-reversed commissions count toward earnings

---

## M6 — Creator Dashboard & Analytics

- Commission summary (total earned, pending, reversed)
- Order attribution breakdown (direct vs warm)
- Top performing products + videos
- Payout request form (manual — admin fulfills)
- Referral link manager

---

## M7 — Admin Dashboard

- Platform KPI overview (GMV, orders, active creators, conversion)
- User management (view, block, suspend, delete)
- Product management (publish, unpublish, edit)
- Order management (view details, initiate refund)
- Creator management (approve, suspend, view stats)
- Attribution config panel
- Commission ledger view

---

## M8 — Testing, Polish & Deployment

- Critical path tests: auth, checkout, attribution, commission reversal
- Accessibility audit (WCAG AA minimum)
- Performance: LCP < 2.5s on marketplace pages
- Mobile QA at 375px
- Production deploy on Vercel + Supabase
- Custom domain setup
- Final handoff documentation

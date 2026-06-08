# Distribution Tracker

A production-ready distribution & logistics management system built with **Payload CMS 3**,
**Next.js 15** and **MongoDB**. It helps a distribution business manage products, dealers,
delivery trips, live inventory, invoices and expenses — with automation that keeps stock
levels and dealer balances always in sync.

## ✨ Features

- **Delivery trips** — assign drivers, helpers and vehicles; track status (pending →
  in-progress → complete). Completing a trip **automatically deducts delivered items from
  inventory** — and reverting or deleting a completed trip **returns them to stock**.
- **Live inventory** — single source of truth for stock, kept in sync automatically, with a
  movement audit trail and **low-stock alerts** (reorder levels).
- **Invoices** — line items with **auto-calculated totals**, partial payments, and a
  derived `balanceDue` / `paymentStatus` (unpaid / partial / paid).
- **Dealers & employees** — manage your dealer network and staff (drivers, helpers, office
  roles), with smart relationship filters (e.g. only drivers selectable as a trip driver).
- **Expenses** — fuel, tolls, allowances, maintenance, branch costs — optionally linked to
  trips.
- **Role-based access control** — `admin`, `manager`, `dataEntry`, `viewer`. Sensitive
  fields (e.g. product cost price) are hidden from lower roles; deletes are admin-only.
- **Frontend** — a polished public landing page plus an authenticated **staff dashboard**
  with KPIs, sales/expense charts, recent trips & invoices, top outstanding balances and
  low-stock alerts.

## 🧱 Tech stack

| Layer    | Tech |
|----------|------|
| CMS/API  | Payload CMS 3.33 |
| Web      | Next.js 15 (App Router), React 19 |
| Database | MongoDB (Mongoose adapter) |
| UI       | Tailwind CSS v4, Recharts |

## 🚀 Getting started

### 1. Prerequisites
- Node.js `>= 20.9`
- pnpm `>= 9`
- MongoDB (locally, or via the bundled Docker Compose)

### 2. Environment
```bash
cp .env.example .env
# then set a unique PAYLOAD_SECRET:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Database (option A — Docker)
```bash
docker compose up -d mongo   # MongoDB on localhost:27017
```
Or point `DATABASE_URI` at any MongoDB instance (e.g. Atlas).

### 4. Install & run
```bash
pnpm install
pnpm seed     # optional: load demo data
pnpm dev
```

- Frontend: http://localhost:3000
- Admin panel: http://localhost:3000/admin
- Dashboard: http://localhost:3000/dashboard

### Demo login (after `pnpm seed`)
| Role    | Email             | Password      |
|---------|-------------------|---------------|
| Admin   | admin@demo.com    | password123   |
| Manager | manager@demo.com  | password123   |
| Viewer  | viewer@demo.com   | password123   |

> If you don't seed, the first time you open `/admin` Payload lets you create the first
> admin user.

## 📁 Project structure

```
src/
  access/        Role-based access helpers (isAdmin, canEdit, field-level, …)
  app/(frontend) Landing page, login, and the staff dashboard
  app/(payload)  Payload admin & API routes
  collections/   Data models (Products, Trips, Inventory, Invoices, …)
  components/     Dashboard UI (KpiCard, StatusBadge, Charts)
  lib/           Business logic (inventory adjustments, dashboard reports, formatting)
  scripts/       One-off admin scripts (e.g. password reset)
  seed.ts        Demo data seeder
  payload.config.ts
```

## 🔑 Key automation

- **`src/collections/Invoices.ts`** — `beforeChange` hook computes `totalAmount`,
  `balanceDue` and `paymentStatus` from line items.
- **`src/collections/Trips.ts`** — `afterChange` / `afterDelete` hooks reconcile inventory:
  completing a trip deducts delivered items, while reverting or deleting it returns them —
  every change logged to the movement trail.
- **`src/lib/inventory.ts`** — `adjustStock()` helper (single source of truth for stock
  changes).
- **`src/lib/reports.ts`** — dashboard aggregation; uses DB-side counts, `where` filters and
  a rolling 6-month window so it never loads entire collections.

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the dev server |
| `pnpm build` / `pnpm start` | Production build & start |
| `pnpm seed` | Load demo data |
| `pnpm reset-password` | List users / reset a password without email |
| `pnpm generate:types` | Regenerate `payload-types.ts` |
| `pnpm lint` | Lint |

### Forgot your password? (no email adapter in dev)

```bash
# list users
pnpm reset-password
# reset one
RESET_EMAIL=admin@demo.com RESET_PASSWORD=newpass123 pnpm reset-password
```

## License

MIT

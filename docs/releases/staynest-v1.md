# StayNest v1 — Launch Snapshot

> **Date:** 2026-06-06
> **Status:** Shipped
> **Bundle:** 39 routes, 22 migrations, 0 build errors

---

## Modules Shipped

### StayNest (Production)

| Module | Route | DB Repository | Description |
|--------|-------|---------------|-------------|
| Overview | `/dashboard/staynest` | — | KPI dashboard: residents, rooms, revenue, collection rate, maintenance counts, plan usage, quick actions |
| Rooms | `/dashboard/staynest/rooms` | `rooms.ts` | CRUD, soft-delete, status (available/partially_occupied/full/maintenance), capacity tracking |
| Residents | `/dashboard/staynest/residents` | `residents.ts` | CRUD, soft-delete, room assignment, emergency contact, ID proofs, status (active/notice_period/checked_out) |
| Visitors | `/dashboard/staynest/visitors` | `visitors.ts` | Digital check-in/check-out, resident linking, purpose tracking, timestamps |
| Maintenance | `/dashboard/staynest/maintenance` | `maintenance.ts` | 3-status workflow (open → in_progress → resolved), categories (electrical/plumbing/furniture/internet/cleaning/other), priority |
| Rent | `/dashboard/staynest/rent` | `rents.ts` (479 lines) | Full ledger: statuses (pending/paid/partially_paid/overdue), month-end generation, late fee calculation, revenue stats, filter by month/year/status |
| Receipts | `/dashboard/staynest/receipts` | `receipts.ts` (295 lines) | Receipt numbering, void with reason, regeneration chain, payment methods (cash/upi/bank_transfer/other) |
| Notices / Announcements | `/dashboard/staynest/notices` | `notices.ts`, `announcements.ts` | Publish/expiry dates, priority levels (normal/important/urgent), soft-delete |
| Analytics | `/dashboard/staynest/analytics` | `analytics.ts` (299 lines) | Server-side KPIs: occupancy %, revenue (expected/collected/pending/overdue), resident status counts, maintenance breakdown, 3 charts (revenue trend 6mo, occupancy history, maintenance trend) |
| Notifications | `/dashboard/staynest/notifications` | `notifications.ts` (342 lines), `notification-engine.ts` (312 lines) | Template rendering, event helpers, provider registry, rule engine, log retry, stats |
| Search | `/dashboard/staynest/search` | `search.ts` | Global ILIKE search across residents, rooms, maintenance, visitors |
| Export | `/dashboard/staynest/export` | `export.ts` | CSV export for residents, rent records, maintenance, visitors |
| Feedback | `/dashboard/staynest/feedback` | `product_feedback` table | Survey (frustrations, feature requests, NPS) + open feedback form |
| Demo/Seed | — | `demo.ts` (355 lines) | Seeds 15 rooms, 30 residents, 40 rent records, 20 visitors, 10 maintenance requests. Transactional rollback on failure. |

### ClinicNest (Foundation — Placeholder Data)

| Module | Route | Status |
|--------|-------|--------|
| Overview | `/dashboard/clinicnest` | Hardcoded stats |
| Appointments | `/dashboard/clinicnest/appointments` | Hardcoded data |
| Patients | `/dashboard/clinicnest/patients` | Hardcoded data |
| Prescriptions | `/dashboard/clinicnest/prescriptions` | Hardcoded data |

No database-backed modules. Data lives in `apps/web/src/lib/clinicnest/data.ts`.

### FreelanceNest & PropertyNest (Coming Soon)

Marketing landing pages exist at `/ecosystems/freelancenest` and `/ecosystems/propertynest`. No dashboard functionality. Ecosystem slugs seeded in the database.

---

## Database Migrations

22 migrations in `packages/db/supabase/migrations/`:

| # | File | Purpose |
|---|------|---------|
| 1 | `00001_core_schema.sql` | Core schema: enums, organizations, members, ecosystems, subscriptions, audit_logs, RLS policies |
| 2 | `00002_staynest_visitors.sql` | Visitor log table |
| 3 | `00003_staynest_complaints.sql` | Complaint tracker (legacy — replaced by maintenance) |
| 4 | `00004_staynest_residents.sql` | Residents table (v1: basic fields) |
| 5 | `00005_staynest_rooms.sql` | Rooms table (v1: basic fields) |
| 6 | `00006_residents_room_id.sql` | Add room_id FK to residents |
| 7 | `00007_staynest_rent_records.sql` | Rent records table (v1) |
| 8 | `00008_staynest_notices.sql` | Notices table |
| 9 | `00009_product_feedback.sql` | Cross-ecosystem feedback table |
| 10 | `00010_drop_profiles.sql` | Remove profiles table, use org_members instead |
| 11 | `00011_fix_rls_recursion.sql` | SECURITY DEFINER helpers to prevent RLS recursion |
| 12 | `00012_add_org_created_by.sql` | Add created_by to organizations |
| 13 | `00013_seed_ecosystems.sql` | Seed 4 ecosystems (staynest, clinicnest, freelancenest, propertynest) |
| 14 | `00014_add_org_ecosystems_insert_policy.sql` | INSERT policy for org_ecosystems |
| 15 | `00015_staynest_phase_s1.sql` | Production core: transformed residents/rooms, maintenance_requests, announcements, RLS reapply |
| 16 | `00016_staynest_phase_s2.sql` | Rent collection + notifications: late fees, receipts, notification_templates, notification_logs |
| 17 | `00017_staynest_phase_s3.sql` | Performance: GIN indexes for full-text search, query indexes |
| 18 | `00018_staynest_reconciliation.sql` | Idempotent catch-up: all Phase S1/S2/S3 changes, data migration, receipt fixes |
| 19 | `00019_fix_missing_ecosystem_activations.sql` | Repair orgs with zero activated ecosystems |
| 20 | `00020_staynest_maintenance_module.sql` | Simplify to 3-status, normalize priority, add RLS UPDATE policy |
| 21 | `00021_staynest_notification_rules.sql` | Notification rules table |
| 22 | `00022_staynest_receipt_void.sql` | Receipt void/regenerate: status, void_reason, regenerated_from_id |
| 23 | `00023_notification_integrity.sql` | UNIQUE constraints on subscriptions + org_ecosystems, provider_message_id column, indexes |

---

## Routes (39 Total)

### Marketing

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Landing page |
| `/login` | Dynamic | Login |
| `/signup` | Dynamic | Signup |
| `/pricing` | Dynamic | Plan comparison |
| `/privacy` | Dynamic | Privacy policy |
| `/terms` | Dynamic | Terms of service |
| `/ecosystems` | Dynamic | Ecosystem explorer |
| `/ecosystems/staynest` | Dynamic | StayNest marketing page |
| `/ecosystems/clinicnest` | Dynamic | ClinicNest marketing page |
| `/ecosystems/freelancenest` | Dynamic | FreelanceNest marketing |
| `/ecosystems/propertynest` | Dynamic | PropertyNest marketing |

### Auth / Onboarding

| Route | Type | Description |
|-------|------|-------------|
| `/auth/callback` | Dynamic | Auth redirect handler |
| `/onboarding` | Static | New-user org creation + ecosystem activation |

### Dashboard

| Route | Type | Description |
|-------|------|-------------|
| `/dashboard` | Dynamic | Main dashboard |
| `/dashboard/ecosystems` | Dynamic | Ecosystem management |
| `/dashboard/settings` | Dynamic | Account settings |
| `/dashboard/settings/subscription` | Dynamic | Subscription management |

### StayNest Dashboard

| Route | Type | Description |
|-------|------|-------------|
| `/dashboard/staynest` | Dynamic | Overview KPIs |
| `/dashboard/staynest/analytics` | Static | Analytics charts |
| `/dashboard/staynest/export` | Static | CSV export |
| `/dashboard/staynest/feedback` | Dynamic | In-app feedback |
| `/dashboard/staynest/maintenance` | Dynamic | Maintenance requests |
| `/dashboard/staynest/notices` | Dynamic | Announcements |
| `/dashboard/staynest/notifications` | Dynamic | Notification center |
| `/dashboard/staynest/notifications/execution` | Dynamic | Rule execution + stats |
| `/dashboard/staynest/receipts` | Dynamic | Receipts |
| `/dashboard/staynest/rent` | Dynamic | Rent ledger |
| `/dashboard/staynest/residents` | Dynamic | Residents |
| `/dashboard/staynest/rooms` | Dynamic | Rooms |
| `/dashboard/staynest/search` | Static | Global search |
| `/dashboard/staynest/visitors` | Dynamic | Visitors |

### ClinicNest Dashboard

| Route | Type | Description |
|-------|------|-------------|
| `/dashboard/clinicnest` | Static | Overview (placeholder) |
| `/dashboard/clinicnest/appointments` | Static | Appointments (placeholder) |
| `/dashboard/clinicnest/patients` | Static | Patients (placeholder) |
| `/dashboard/clinicnest/prescriptions` | Static | Prescriptions (placeholder) |

### API

| Route | Type | Description |
|-------|------|-------------|
| `/api/staynest/search` | Dynamic | Global search endpoint |

---

## Subscription Plans

| Tier | Price | Max Residents | Max Rooms | Max Properties | Key Features |
|------|-------|---------------|-----------|----------------|--------------|
| **Starter** | Free | 10 | 5 | 1 | Rent tracking, visitor log, basic email notifications |
| **Growth** | ₹999/mo | Unlimited | Unlimited | 1 | All features: WhatsApp, maintenance, announcements, analytics, receipts |
| **Pro** | Custom | Unlimited | Unlimited | Unlimited | Multi-property, custom integrations, priority support, SLA, on-site training |

**Enforcement:** PlanGuard (`packages/db/src/plan-guard.ts`) checks limits before `createResident` and `createRoom` server actions. Starter users hitting limits see an upgrade banner with usage bars. Subscription created automatically during onboarding with a 14-day trial mapped to Growth plan.

---

## Notification Capabilities

### Events (4 Trigger Events)

| Event | Recipients | Variables |
|-------|------------|-----------|
| `rent_due` | Active residents with pending/overdue rent | `resident_name`, `rent_amount`, `month`, `year`, `due_date` |
| `rent_overdue` | Residents with overdue rent | `resident_name`, `amount`, `month`, `year`, `late_fee`, `total_due` |
| `maintenance_resolved` | Residents whose request was resolved | `resident_name`, `title` |
| `announcement_created` | All active residents | `resident_name`, `title`, `message` |

### Channels (Schema)

- `whatsapp` — 4 default templates seeded
- `email` — No templates seeded
- `sms` — No templates seeded

### Providers

| Provider | Auth Fields | Status |
|----------|-------------|--------|
| Interakt | API Key, API Secret, Endpoint URL | BYOP — validate, test, activate implemented |
| WATI | API Key, Endpoint URL | BYOP — validate, test, activate implemented |
| Console | — | Registered stub, logs to console only |

### Default Templates

| Event | Template |
|-------|----------|
| `rent_due` | `Dear {{resident_name}}, your rent of Rs{{rent_amount}} for {{month}} {{year}} is due on {{due_date}}. Please pay to avoid late fees. - StayNest` |
| `rent_overdue` | `Dear {{resident_name}}, your rent of Rs{{amount}} for {{month}} {{year}} is now overdue. Late fee of Rs{{late_fee}} has been applied. Total due: Rs{{total_due}}. - StayNest` |
| `announcement_created` | `📢 {{title}}: {{message}} - StayNest` |
| `maintenance_resolved` | `Dear {{resident_name}}, your maintenance request "{{title}}" has been resolved. Please confirm. - StayNest` |

### Architecture

- `dispatchNotification()` creates a log entry, then `sendSingleNotification()` attempts immediate dispatch through the active org provider
- `sendPendingNotifications()` iterates pending logs, calls registered provider per channel (fallback/recovery path)
- `notificationEngine` executes rules: finds recipients per trigger event, dispatches batch, calls `sendSingleNotification()` per recipient
- Provider flow: Test Connection → Send Test Message → Activate → Engine uses active provider
- `sendPendingNotifications()` manual trigger via "Send Pending" button in UI
- `sendBatchViaProvider()` parallel variant for processing accumulated pending logs
- Announcement creation automatically queues notifications for all active residents with phone numbers
- Maintenance resolution automatically queues notification for the associated resident

**Current state:** Notifications are dispatched through the customer's active provider (Interakt or WATI). `provider_message_id` is stored for delivery tracking. If no provider is activated, notifications remain `pending` with error `"No active provider configured for this organization"`.
**MicroNest does not provide WhatsApp accounts.** Customers bring their own Interakt or WATI credentials (BYOP model).

---

## Project Architecture

### Monorepo Structure

```
micronest/
├── apps/web/          @micronest/web    — Next.js 15.1 app (App Router, Server Actions)
├── packages/
│   ├── config/        @micronest/config — Plans, app constants
│   ├── auth/          @micronest/auth   — Supabase SSR auth helpers
│   ├── db/            @micronest/db     — Migrations, types, repositories, client
│   └── ui/            @micronest/ui     — Shared UI components (Card, Button, Table, etc.)
```

### Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router, `next --turbo`) |
| Language | TypeScript 5.6 |
| Styling | Tailwind CSS 3.4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase SSR (cookie-based) |
| DB Access | Raw Supabase JS client (no ORM) |
| State | Server Components + Server Actions + `router.refresh()` |
| Monorepo | npm workspaces |

### Module Development Pattern

```
Migration → Types → Repository → Server Actions → Server Component → Client Component → Audit Events
```

---

## Known Limitations

### Critical (Unaddressed)

1. **Customer-owned provider credentials required** — MicroNest does not provide WhatsApp accounts. Customers must configure their own Interakt or WATI credentials. Without an activated provider, notifications remain `pending` with `"No active provider configured"`.
2. **No cron/trigger for pending notifications** — `sendPendingNotifications()` is never invoked automatically. Must be triggered manually via the "Send Pending" UI button.
3. **UNIQUE constraints added on subscriptions + organization_ecosystems** — Fixed in migration 00023. No duplicate subscriptions or ecosystem activations possible.
5. **seedDemoData bypasses plan enforcement** — Creates demo residents/rooms directly via DB, skipping PlanGuard checks. Starter orgs can exceed limits through demo seeding.

### High (Validated)

6. **No `service_role` key available** — Cannot run Supabase management operations or apply migrations programmatically.
7. **`notifyMaintenanceResolved` now called** — Fixed in v1. Maintenance resolve action queues a notification for the resident via the active provider.
8. **Rent records generated for soft-deleted rooms** — Fixed in v1 (`.is('deleted_at', null)` added to rooms query in `generateRentForMonth`). Previously active.
9. **No PDF generation anywhere** — Receipts display in UI only. No PDF download/print.
10. **No audit log UI** — `audit_logs` table exists and is populated on mutations, but no admin page to view them.
11. **No email/SMS sending** — Schema supports both channels but no providers registered, no templates seeded, no sending logic.

### Medium (Tolerated for v1)

12. **ClinicNest placeholder-only** — No database tables, no real CRUD, no RLS.
13. **FreelanceNest/PropertyNest marketing pages are TODO stubs** — Minimal content, no dashboard.
14. **No resident/mobile app** — Admin-only. Residents managed by staff.
15. **No multi-property support** — Pro plan promises it but not implemented.
16. **No payment gateway** — All payments tracked manually. No Razorpay/Stripe.
17. **No auto-recurring rent** — Monthly generation is manual via "Generate Rent for Month" button.
18. **No automated late fee scheduling** — Late fee calculation exists in code but no cron to apply it.
19. **No dark mode** — Design tokens exist in documentation but palette not shipped.
20. **Single org per user** — Code assumes `orgs[0]` everywhere. No org switcher.
21. **Search uses ILIKE** — Functional but no ElasticSearch/Algolia for fuzzy ranking.
22. **No CSV export for receipts or notifications** — Only residents, rent records, maintenance, visitors.
23. **No soft-delete on rent records, receipts, notices** — Only residents, rooms, maintenance, visitors have `deleted_at`.
24. **Announcement notifications skips residents without phone** — Filters residents with `phone` set. Residents missing phone get no notification.

---

## Future Roadmap

### Phase 2 (Next)

- **Cron infrastructure** — Schedule automatic rule execution, late fee application, rent generation via Vercel Cron Jobs or Supabase Edge Functions
- **Provider webhook handling** — Support delivery receipts and incoming messages from Interakt/WATI webhooks
- **Email/SMS provider integration** — Register handlers for email and SMS channels (schema supports both)
- **Resident app / portal** — Mobile app or web portal for residents to view rent, make payments, raise maintenance requests
- **Attendance module** — Resident attendance tracking (next StayNest module per docs)
- **PDF receipts** — Generate downloadable/printable PDF receipts

### Phase 3 (Medium-term)

- **Multi-property dashboard** — Org-level switching across multiple properties
- **Payment gateway** — Razorpay/UPI integration for online collections
- **ClinicNest production launch** — Full module (appointments, patients, prescriptions, billing)
- **Email/SMS provider integration** — Register handlers for email and SMS channels
- **Audit log viewer** — Admin page to browse and filter audit events
- **GST/tax invoices** — GST-compliant invoice generation

### Phase 4 (Future)

- **FreelanceNest & PropertyNest** — Ecosystem-specific feature sets
- **Custom WhatsApp templates** — Per-org template editing and approval
- **Role-based access control** — Fine-grained permissions beyond owner/admin/member
- **Bulk operations** — Import residents, bulk rent adjustments
- **Advanced analytics** — Revenue forecasting, churn prediction, occupancy optimization
- **On-site training & SLA** — Pro plan commitments

---

## Reference Files

| Area | File |
|------|------|
| Plan definitions | `packages/config/src/plans.ts` |
| Plan enforcement | `packages/db/src/plan-guard.ts` |
| Subscription helpers | `packages/db/src/helpers.ts` |
| Rent ledger | `packages/db/src/staynest/rents.ts` |
| Receipts | `packages/db/src/staynest/receipts.ts` |
| Notification engine | `packages/db/src/staynest/notifications.ts`, `notification-engine.ts` |
| Provider settings | `packages/db/src/staynest/provider-settings.ts` |
| Interakt provider | `packages/db/src/staynest/providers/interakt.ts` |
| WATI provider | `packages/db/src/staynest/providers/wati.ts` |
| Provider router | `packages/db/src/staynest/providers/provider-router.ts` |
| Migration 00023 | `packages/db/supabase/migrations/00023_notification_integrity.sql` |
| Demo seeding | `packages/db/src/staynest/demo.ts` |
| Server actions | `apps/web/src/lib/staynest/actions.ts` |
| Onboarding | `apps/web/src/lib/onboarding/actions.ts` |
| PlanGuard UI | `packages/ui/src/UpgradeBanner.tsx` |
| Subscription page | `apps/web/src/app/(dashboard)/dashboard/settings/subscription/page.tsx` |
| Notification UI | `apps/web/src/app/(dashboard)/dashboard/staynest/notifications/notifications-content.tsx` |
| Pricing page | `apps/web/src/app/(marketing)/pricing/page.tsx` |
| Privacy | `apps/web/src/app/(marketing)/privacy/page.tsx` |
| Terms | `apps/web/src/app/(marketing)/terms/page.tsx` |

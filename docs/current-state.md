# Current State — MicroNest

_Last updated: 2026-06-06_

## Notification Delivery

### Supported Providers

| Provider | Type | Status |
|----------|------|--------|
| Interakt | BYOP (Bring Your Own Provider) | Implemented — Test Connection, Send Test Message, Activate |
| WATI | BYOP (Bring Your Own Provider) | Implemented — Test Connection, Send Test Message, Activate |
| Console | Built-in stub | Logs to stdout |

MicroNest does **not** provide WhatsApp accounts. Customers connect their own Interakt or WATI credentials.

### Provider Workflow

1. Configure credentials (API key, secret, endpoint URL)
2. Test Connection — validates API credentials
3. Send Test Message — verifies message delivery to a phone number
4. Activate — marks provider as active for the organization (deactivates any other)
5. Notification engine dispatches through the active provider

### New Database Types

- `NotificationProviderResult` — standard return shape with `success`, `providerMessageId?`, `error?`
- `provider_message_id` column added to `staynest_notification_logs` for delivery tracking

### New Files

| File | Purpose |
|------|---------|
| `packages/db/src/staynest/providers/interakt.ts` | Interakt API integration (validate, send) |
| `packages/db/src/staynest/providers/wati.ts` | WATI API integration (validate, send) |
| `packages/db/src/staynest/providers/provider-router.ts` | Routes provider calls by name |
| `packages/db/supabase/migrations/00023_notification_integrity.sql` | UNIQUE constraints, provider_message_id, indexes |

### Fixed

- **Maintenance resolved notifications** — `resolveRequest` server action now calls `notifyMaintenanceResolved` to queue a WhatsApp notification for the resident when a maintenance request is resolved
- **Duplicate subscriptions prevented** — UNIQUE constraint on `subscriptions.organization_id`
- **Duplicate ecosystem activations prevented** — UNIQUE constraint on `organization_ecosystems(organization_id, ecosystem_id)`
- **Engine dispatches through active provider** — `executeRule` now calls `sendSingleNotification` after creating each log entry, updating status to `sent`/`failed` immediately

### Architecture Changes

- `sendSingleNotification()` — looks up active provider from org settings, dispatches message, updates log status + `provider_message_id`
- `sendBatchViaProvider()` — batch variant for processing multiple pending logs
- `getProvider()` / `getActiveProvider()` — router functions for selecting the right provider
- All providers return `NotificationProviderResult` consistently
- 15-second timeout on all provider API calls
- Per-recipient try/catch ensures one failed recipient doesn't stop a batch

## StayNest

### Production Modules (shipped)

| Module       | Status       |
|--------------|--------------|
| Visitors     | ✅ Completed |
| Maintenance  | ✅ Completed |
| Residents    | ✅ Completed |
| Rooms        | ✅ Completed |
| Rent         | ✅ Completed |
| Announcements| ✅ Completed |
| Analytics    | ✅ Completed |

### Recently Shipped

- **Analytics** — Server-side aggregated KPIs across all modules: Occupancy (Total Beds, Occupied Beds, Occupancy %), Revenue (Total Rent Due, Total Collected, Pending Rent, Overdue Rent), Operations (Active Residents, Open Maintenance, Visitors Today). 3 charts: Monthly Collections (6-month), Occupancy Trend (historical from resident check-in/out data), Maintenance by Status. No placeholder data — all metrics calculated from production tables.

### Up Next

- Attendance

## Other Ecosystems

### ClinicNest

Foundation Exists

Modules:
- Appointments (placeholder)
- Patients (placeholder)
- Prescriptions (placeholder)

Production Status:
- Not yet migrated to database-backed modules

## Technical Debt / Notes

- `packages/db/src/staynest/` contains feature-split repository files (visitors.ts, complaints.ts, residents.ts, rooms.ts, rents.ts, notices.ts) with a barrel `index.ts`.
- `packages/db/src/` also has `helpers.ts` for cross-cutting queries (profiles, orgs, audit logs).
- The old monolithic `staynest.ts` has been deleted.

## Marketing Site Redesign v2

**Date:** 2026-06-06

### Homepage Structure (8 sections)

| Section | Content |
|---------|---------|
| 1. Hero | "Run your business without spreadsheets" — dashboard mockup with live stats, two CTAs |
| 2. Problem | 4 problem cards (PG Owners, Clinics, Freelancers, Real Estate) |
| 3. Ecosystem Showcase | Large cards for StayNest (Live) and ClinicNest (Early Access) with screenshots, benefits, feature tags; smaller cards for FreelanceNest/PropertyNest (Coming Soon) |
| 4. Why Choose | 3-column: Purpose Built, Unified Login, Grow Together |
| 5. Real Screens | 4 dashboard mockups: Analytics, Rent Collection, Resident Directory, Maintenance Board |
| 6. Social Proof | 3 testimonial cards (PG Owner, Clinic Owner, Freelancer) with generic placeholders |
| 7. Pricing Preview | 3 tiers (Starter, Growth, Pro) with link to full pricing page |
| 8. Final CTA | "Start with StayNest today." — Create Free Account |

### Ecosystems Page Structure

- **Header** — title + description
- **Available Now** — Large featured cards for StayNest (Production Ready) and ClinicNest (Early Access) with screenshots, benefit lists, feature tags, dual CTAs
- **Coming Soon** — Smaller cards for FreelanceNest and PropertyNest
- **Ecosystem Roadmap** — Visual timeline with status indicators (Live → Early Access → In Development)

### Mobile-First Strategy

- All sections designed for 375px/390px/430px first
- Single-column layout on mobile, multi-column on desktop
- Floating bottom CTA (Start Free) appears on mobile after scrolling past hero
- Full-screen navigation drawer with larger tap targets on mobile
- Reduced text width, tighter spacing, one-column layouts
- Sticky bottom CTA on marketing pages (homepage, StayNest page)
- Larger tap targets throughout (min 44px on nav items, 48px on CTAs)

### Conversion Goals

- **Mobile conversion rate** — Floating CTA reduces friction on mobile
- **Signups** — Multiple CTAs throughout the page (hero, ecosystem cards, pricing, final CTA)
- **Demo requests** — "Explore StayNest" and "See Ecosystems" CTAs lead to product discovery
- **Trust** — Real screenshot mockups, social proof, transparent pricing
- **Product understanding** — Problem → Solution → Ecosystem showcase → Real screens flow

### Design System

- Background: `#f5f1ec` (cream)
- Cards: `#ffffff` (white)
- Text: `#111111` (charcoal)
- Accent: `#5e6ad2` (lavender)
- Muted: `#6b7280` (gray-500)
- Borders: `#ece7df` (border-light)
- Navigation: cream background with backdrop blur
- Buttons: pill-shaped, charcoal primary, bordered secondary

### Files Modified

| File | Change |
|------|--------|
| `apps/web/tailwind.config.ts` | Added `border-light: '#ece7df'` |
| `apps/web/src/app/layout.tsx` | Updated metadata, OpenGraph, body bg/tx colors |
| `apps/web/src/app/(marketing)/layout.tsx` | Added FloatingCTA, padding for mobile CTA |
| `apps/web/src/app/(marketing)/page.tsx` | Complete homepage rewrite (8 sections) |
| `apps/web/src/app/(marketing)/ecosystems/page.tsx` | Complete ecosystems rewrite |
| `packages/ui/src/MarketingNav.tsx` | Premium redesign: Products dropdown, full-screen mobile drawer, CTA |
| `packages/ui/src/Footer.tsx` | Multi-column footer with product/company/legal links |
| `packages/ui/src/index.ts` | Added FloatingCTA export |

### Files Created

| File | Purpose |
|------|---------|
| `packages/ui/src/FloatingCTA.tsx` | Mobile floating bottom CTA component |
| `docs/releases/marketing-redesign-v2.md` | Release documentation |

### SEO Improvements

- Updated root layout metadata with OpenGraph tags
- Page-specific metadata (title, description, OpenGraph) on homepage and ecosystems page
- Semantic HTML (proper section hierarchy, heading nesting)
- Proper `title` template in root layout

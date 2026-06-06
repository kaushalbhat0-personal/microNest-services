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

## Marketing Site Redesign v3

**Date:** 2026-06-06

### Homepage Structure (8 sections)

| Section | Content |
|---------|---------|
| 1. Hero | "One platform. Multiple business operating systems." — MicroNest Hub mockup showing activated ecosystems + cross-ecosystem metrics |
| 2. Problem | Visual "stitched together tools → MicroNest" transition graphic (Excel, WhatsApp, Notebook, Sheets, Reminders → MicroNest) |
| 3. Ecosystem Showcase | Horizontal product showcase rows (not cards) — StayNest and ClinicNest as full-width alternating rows with screenshots, metrics, CTAs; FreelanceNest/PropertyNest as dashed-border coming soon |
| 4. Why MicroNest | 4 pillars with visual diagrams: One Login, Shared Billing, Shared Analytics, Shared Infrastructure |
| 5. Product Ecosystem Map | MicroNest in center with four connected products showing activation flow |
| 6. Social Proof | Launch metrics with animated CountUp counters: 1,000+ Residents, 500+ Payments, 100+ Maintenance, 50+ Properties |
| 7. Roadmap | Timeline layout: StayNest (Available Now), ClinicNest (Early Access), FreelanceNest/PropertyNest (In Development) |
| 8. Final CTA | "Start with one ecosystem. Expand when you're ready." — Create Free Account on dark background |

### Ecosystems Page Structure

- **Header** — "Choose your operating system" platform narrative
- **Available Now** — Featured product showcase rows (Apple product page style) with bullet-feature lists, screenshots, dual CTAs
- **Coming Soon** — Dashed-border cards with product descriptions and notification CTAs
- **Roadmap** — Timeline with status indicators

### Mobile-First Strategy

- All sections designed for 375px/390px/430px first
- Single-column layout on mobile, multi-column on desktop
- **Always-visible floating bottom CTA** with MicroNest branding and "Create Free Account" button (min 44px touch target)
- Full-screen navigation drawer with backdrop
- Horizontal screenshots stack vertically on mobile
- Larger tap targets (min 44px on all interactive elements)
- Reduced text blocks, product screenshots prioritized over copy

### Conversion Improvements (v2 → v3)

| Metric | v2 | v3 |
|--------|----|----|
| Hero narrative | "Run your business without spreadsheets" (product-focused) | "One platform. Multiple business operating systems." (platform-focused) |
| Problem section | 4 industry-specific cards | Visual transition showing fragmented tools → unified platform |
| Product showcase | Card grids | Horizontal rows (Apple product page style) |
| Why choose | 3 cards | 4 pillars with diagrams |
| Social proof | Testimonial cards | Animated metrics counters |
| Roadmap | Included in ecosystems page | Dedicated section on homepage |
| Mobile CTA | Appears after scroll | Always visible, branded |
| Final CTA | "Start with StayNest today" | "Start with one ecosystem. Expand when you're ready." |

### Design System

- Background: `#f5f1ec` (cream)
- Cards: `#ffffff` (white)
- Text: `#111111` (charcoal)
- Accent: `#5e6ad2` (lavender)
- Muted: `#6b7280` (gray-500)
- Borders: `#ece7df` (border-light)
- Navigation: cream background with backdrop blur
- Buttons: pill-shaped, charcoal primary, bordered secondary
- Mockups: Real dashboard interfaces (not illustrations)
- Product showcases: Full-width alternating rows (not cards)
- Pillar diagrams: Icon + description layouts
- Ecosystem map: Center-hub diagram with connected products
- Counters: Animated via CountUp component (cubic ease-out)

### Files Modified (v3)

| File | Change |
|------|--------|
| `apps/web/src/app/layout.tsx` | Updated metadata to platform-first narrative, removed APP_NAME import |
| `apps/web/src/app/(marketing)/layout.tsx` | Reduced padding (FloatingCTA is always visible) |
| `apps/web/src/app/(marketing)/page.tsx` | Complete v3 rewrite: new hero narrative, problem transition, horizontal showcases, 4 pillars, ecosystem map, counters, roadmap, new CTA |
| `apps/web/src/app/(marketing)/ecosystems/page.tsx` | Complete v3 rewrite: Apple-style product comparison rows, bullet features, cleaner layout |
| `packages/ui/src/FloatingCTA.tsx` | Always visible, branded with MicroNest logo, larger touch targets |

### Files Modified (carried from v2)

| File | Change |
|------|--------|
| `apps/web/tailwind.config.ts` | Added `border-light: '#ece7df'` |
| `packages/ui/src/MarketingNav.tsx` | Premium redesign: Products dropdown, full-screen mobile drawer, CTA |
| `packages/ui/src/Footer.tsx` | Multi-column footer with product/company/legal links |
| `packages/ui/src/index.ts` | Added FloatingCTA export |

### SEO Improvements

- **Root layout**: Platform-first metadata ("One platform. Multiple business operating systems.")
- **Homepage**: Platform narrative in title, description, OpenGraph
- **Ecosystems page**: "Choose your operating system" narrative
- **Semantic HTML**: Proper section hierarchy, heading nesting (h1 → h2 → h3)
- **Title template**: `%s | MicroNest` — reinforces brand

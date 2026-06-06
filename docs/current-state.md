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

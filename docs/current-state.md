# Current State — MicroNest

_Last updated: 2026-06-05_

## StayNest

### Production Modules (shipped)

| Module     | Status       |
|------------|--------------|
| Visitors   | ✅ Completed |
| Complaints | ✅ Completed |
| Residents  | ✅ Completed |
| Rooms      | ✅ Completed |

### Recently Shipped

- **Rent Management** — Full CRUD with tab filtering, dashboard metrics, payment tracking, and audit events.

### Up Next

- Notices
- Attendance
- Analytics

## Other Ecosystems

- **ClinicNest** — Not yet started.

## Technical Debt / Notes

- `packages/db/src/staynest/` contains feature-split repository files (visitors.ts, complaints.ts, residents.ts, rooms.ts, rents.ts) with a barrel `index.ts`.
- `packages/db/src/` also has `helpers.ts` for cross-cutting queries (profiles, orgs, audit logs).
- The old monolithic `staynest.ts` has been deleted.

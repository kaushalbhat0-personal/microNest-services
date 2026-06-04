# Module Pattern — StayNest

Every entity module follows this lifecycle:

```
1. Migration       → SQL table, RLS, indexes, triggers
2. Types           → TypeScript interface + Database type-map entry
3. Repository      → Feature file under staynest/ with query helpers
4. Server Actions  → Next.js server actions (form actions + direct actions)
5. Server Component → Async page fetching data
6. Client Component → Interactive UI (tables, forms, empty states)
7. Audit Events    → Logged on create / update / deactivate
```

## Rules

| Rule | Description |
|------|-------------|
| `organization_id` | Required on every table — enforced at DB + app layer |
| `created_by` | Required on every table — references `auth.users(id)` |
| RLS | Required on every table — at minimum SELECT/INSERT/UPDATE policies scoped to organization members |
| Repository pattern | Required — DB queries live in `packages/db/src/staynest/<feature>.ts`, not in components |

## File Locations

| Layer | Path |
|-------|------|
| Migration | `packages/db/supabase/migrations/<NNNN>_<name>.sql` |
| Type | `packages/db/src/types.ts` |
| Repository | `packages/db/src/staynest/<feature>.ts` |
| Barrel | `packages/db/src/staynest/index.ts` |
| Public export | `packages/db/src/index.ts` |
| Server action | `apps/web/src/lib/staynest/actions.ts` |
| Server page | `apps/web/src/app/(dashboard)/dashboard/staynest/<feature>/page.tsx` |
| Client component | `apps/web/src/app/(dashboard)/dashboard/staynest/<feature>/<feature>-content.tsx` |

## Conventions

- Repository helpers accept `supabase: DBClient` as the first parameter
- All list helpers accept `organizationId` and filter by it
- Server actions revalidate both the feature path and `/dashboard/staynest`
- Client components use `useCallback` for handlers and `router.refresh()` after mutations
- UI reuses `@micronest/ui` components: `PageHeader`, `Table`, `EmptyState`, `StatusBadge`, `Button`, `Card`, `CardBody`

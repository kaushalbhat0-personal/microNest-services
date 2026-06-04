# MicroNest Architecture

## Monorepo Structure

```
apps/
  web/          # Next.js application

packages/
  auth/         # Supabase auth helpers (server + client)
  config/       # Shared configuration
  db/           # Database layer (migrations, types, repositories)
  ui/           # Shared UI components
```

## Ecosystems

MicroNest powers multiple property-management ecosystems:

- **StayNest** — PG accommodation / hostel management
- **ClinicNest** — Clinic / healthcare management

Each ecosystem follows the same module architecture.

## Module Lifecycle

```
Migration → Types → Repository → Server Action → Server Component → Client Component
```

1. **Migration** — SQL table definition with RLS, indexes, and triggers
2. **Types** — TypeScript interface + Database type-map entry
3. **Repository** — Feature-file with query helpers under `packages/db/src/<ecosystem>/`
4. **Server Action** — Next.js server action with auth, audit logging, and revalidation
5. **Server Component** — Async page that fetches data and passes props
6. **Client Component** — Interactive UI with inline forms, tables, and empty states

## Key Conventions

- All data modules live under `packages/db/src/<ecosystem>/` with a barrel `index.ts`
- All consumer imports go through `@micronest/db` (the top-level barrel)
- Every table includes `organization_id`, `created_by`, `created_at`, `updated_at`
- RLS is enforced on every table
- Audit events are logged for every create / update / deactivate action
- UI uses shared components from `@micronest/ui` (Card, Table, PageHeader, StatusBadge, Button, EmptyState)

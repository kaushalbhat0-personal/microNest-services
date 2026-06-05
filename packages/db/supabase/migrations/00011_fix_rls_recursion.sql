-- ============================================================================
-- Fix RLS infinite recursion on organization_members
-- ============================================================================
-- Root cause: org_members_select_member queried organization_members inside its
-- own USING clause. Every policy referencing organization_members (organizations,
-- organization_ecosystems, subscriptions, audit_logs) cascaded into the same
-- recursion.
--
-- Fix: SECURITY DEFINER helper functions bypass RLS on organization_members
-- so policy evaluation does not re-enter the same table.
-- ============================================================================

-- 1. SECURITY DEFINER helpers (bypass RLS to avoid recursion) ----------------

create or replace function public.is_member_of_org(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = org_id and user_id = auth.uid()
  );
$$;

create or replace function public.org_has_no_members(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (
    select 1 from public.organization_members
    where organization_id = org_id
  );
$$;

-- 2. Organizations -----------------------------------------------------------

drop policy if exists "organizations_select_member" on organizations;

create policy "organizations_select_member"
  on organizations for select
  using (public.is_member_of_org(id));

create policy "organizations_insert_authenticated"
  on organizations for insert
  to authenticated
  with check (true);

-- 3. Organization members ----------------------------------------------------

drop policy if exists "org_members_select_member" on organization_members;

-- Non-recursive: user sees only their own membership rows
create policy "org_members_select_own"
  on organization_members for select
  using (auth.uid() = user_id);

-- Self-insert allowed for the first member (onboarding) or existing members
create policy "org_members_insert_self"
  on organization_members for insert
  with check (
    auth.uid() = user_id
    and (
      public.org_has_no_members(organization_id)
      or public.is_member_of_org(organization_id)
    )
  );

-- 4. Organization ecosystems -------------------------------------------------

drop policy if exists "org_ecosystems_select_member" on organization_ecosystems;

create policy "org_ecosystems_select_member"
  on organization_ecosystems for select
  using (public.is_member_of_org(organization_id));

-- 5. Subscriptions -----------------------------------------------------------

drop policy if exists "subscriptions_select_member" on subscriptions;

create policy "subscriptions_select_member"
  on subscriptions for select
  using (public.is_member_of_org(organization_id));

-- 6. Audit logs --------------------------------------------------------------

drop policy if exists "audit_logs_select_member" on audit_logs;

create policy "audit_logs_select_member"
  on audit_logs for select
  using (
    organization_id is null
    or public.is_member_of_org(organization_id)
  );

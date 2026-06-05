-- ============================================================================
-- Add created_by to organizations for RLS SELECT policy
-- ============================================================================
-- The onboarding flow: INSERT org → INSERT org_member → done.
-- After inserting the org, RETURNING * is blocked by the SELECT policy because
-- the user is not yet in organization_members. Adding created_by allows the
-- SELECT policy to let the creator through immediately.
-- ============================================================================

alter table organizations
  add column created_by uuid references auth.users(id);

drop policy if exists "organizations_select_member" on organizations;

create policy "organizations_select_member"
  on organizations for select
  using (
    created_by = auth.uid()
    or public.is_member_of_org(id)
  );

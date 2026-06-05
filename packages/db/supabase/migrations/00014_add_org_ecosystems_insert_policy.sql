-- ============================================================================
-- Add INSERT policy for organization_ecosystems
-- ============================================================================
-- Root cause: Only SELECT policies existed (from 00001 and 00011). With RLS
-- enabled, INSERT is default-deny. activateEcosystem() in helpers.ts called
-- .insert().select('*').single() — the INSERT was silently rejected, data was
-- null, and onboarding continued as if successful. Zero rows ever landed in
-- the table, causing "No ecosystems activated yet" on the dashboard.
-- ============================================================================

create policy "org_ecosystems_insert_member"
  on organization_ecosystems for insert
  with check (public.is_member_of_org(organization_id));

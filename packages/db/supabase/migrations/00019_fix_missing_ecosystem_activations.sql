-- ============================================================================
-- Fix Missing Ecosystem Activations for Existing Organizations
-- ============================================================================
-- Root cause: Before migration 00014 (org_ecosystems INSERT policy),
-- the activateEcosystem INSERT was silently blocked by RLS default-deny.
-- Organizations were created, members were added, but ecosystem activations
-- silently failed. The user saw an error during onboarding and got stuck with
-- a partially-created org and zero activated ecosystems.
--
-- This migration detects and repairs:
--   1. Organizations with zero activated ecosystems (activations failed)
--   2. Organizations that have members but are fully orphaned
--   3. Organizations missing created_by
-- ============================================================================

-- 1. Detect organizations with zero ecosystem activations --------------------

do $$
declare
  org_rec record;
  eco_rec record;
  activated_count int;
  member_count int;
begin
  raise notice '=== Checking for organizations with missing ecosystem activations ===';

  for org_rec in
    select o.id, o.name, o.slug, o.created_by
    from organizations o
    order by o.created_at
  loop
    -- Count activated ecosystems for this org
    select count(*) into activated_count
    from organization_ecosystems
    where organization_id = org_rec.id;

    -- Count members
    select count(*) into member_count
    from organization_members
    where organization_id = org_rec.id;

    if activated_count = 0 and member_count > 0 then
      raise notice '  ORG: % (ID: %, members: %) — ZERO activations. Repairing...',
        org_rec.name, org_rec.id, member_count;

      -- Activate all available ecosystems for this org
      for eco_rec in
        select e.id, e.slug, e.name
        from ecosystems e
        where e.is_active = true
        order by e.slug
      loop
        begin
          insert into organization_ecosystems (organization_id, ecosystem_id, settings)
          values (org_rec.id, eco_rec.id, '{}')
          on conflict (organization_id, ecosystem_id) do nothing;

          if found then
            raise notice '    ✅ Activated: %', eco_rec.name;
          else
            raise notice '    ⏭ Already active: %', eco_rec.name;
          end if;
        exception when others then
          raise notice '    ❌ Failed to activate %: %', eco_rec.name, SQLERRM;
        end;
      end loop;

      -- Also add audit log for the repair
      insert into audit_logs (organization_id, user_id, action, entity_type, entity_id, metadata)
      values (
        org_rec.id,
        coalesce(org_rec.created_by, (select user_id from organization_members where organization_id = org_rec.id limit 1)),
        'ecosystem.activation_repaired',
        'organization',
        org_rec.id,
        jsonb_build_object('note', 'Ecosystem activations repaired by migration 00019')
      );
    end if;

    -- Fix missing created_by for this org
    if org_rec.created_by is null and member_count > 0 then
      update organizations
        set created_by = (select user_id from organization_members where organization_id = org_rec.id order by created_at limit 1)
        where id = org_rec.id;

      raise notice '  ORG: % — Fixed missing created_by', org_rec.name;
    end if;
  end loop;

  raise notice '=== Ecosystem activation repair complete ===';
end;
$$;

-- 2. Ensure all organizations have at least created_by if they have members --
-- (handles edge case for organizations with members but no created_by)

update organizations o
  set created_by = (
    select om.user_id
    from organization_members om
    where om.organization_id = o.id
    order by om.created_at
    limit 1
  )
  where o.created_by is null
    and exists (select 1 from organization_members where organization_id = o.id);

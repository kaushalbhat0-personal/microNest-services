-- ============================================================================
-- Migration 00020: StayNest Maintenance Module (production)
-- ============================================================================
-- Purpose: Simplify staynest_maintenance_requests with 3-status workflow:
--   Open → In Progress → Resolved
-- Priority: Low, Medium, High (no Urgent)
-- ============================================================================

-- Since check constraints can't be altered in place, we must drop and re-add

-- 1. Update priority check constraint
alter table staynest_maintenance_requests
  drop constraint if exists staynest_maintenance_requests_priority_check;

-- Normalize any existing 'urgent' values to 'high' before adding constraint
update staynest_maintenance_requests
  set priority = 'high'
  where priority = 'urgent';

alter table staynest_maintenance_requests
  add constraint staynest_maintenance_requests_priority_check
    check (priority in ('low', 'medium', 'high'));

-- 2. Update status check constraint
alter table staynest_maintenance_requests
  drop constraint if exists staynest_maintenance_requests_status_check;

-- Normalize: 'assigned' → 'open', 'closed' → 'resolved'
update staynest_maintenance_requests
  set status = 'open'
  where status in ('assigned', 'closed');

alter table staynest_maintenance_requests
  add constraint staynest_maintenance_requests_status_check
    check (status in ('open', 'in_progress', 'resolved'));

-- 3. RLS: ensure UPDATE policy exists
drop policy if exists "Members can update maintenance requests" on staynest_maintenance_requests;

create policy "Members can update maintenance requests"
  on staynest_maintenance_requests
  for update
  using (public.is_member_of_org(organization_id));

-- 4. Update notification template: previously 'maintenance_resolved' event stays unchanged
--    (template text is generic, no changes needed)

-- 5. Update analytics maintenance trend function comment — no functional change

-- 6. Add metadata column for structured resolution notes
alter table staynest_maintenance_requests
  add column if not exists resolved_notes text;

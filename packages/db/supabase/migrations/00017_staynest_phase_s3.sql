-- ============================================================================
-- Phase S3 — Analytics, Search, Performance, Production Hardening
-- ============================================================================

-- 1. SEARCH INDEXES (full-text search acceleration) -------------------------

create index if not exists idx_staynest_residents_search
  on staynest_residents using gin(to_tsvector('english', coalesce(full_name, '') || ' ' || coalesce(phone, '')))
  where deleted_at is null;

create index if not exists idx_staynest_rooms_search
  on staynest_rooms using gin(to_tsvector('english', coalesce(room_number, '')))
  where deleted_at is null;

create index if not exists idx_staynest_maint_request_search
  on staynest_maintenance_requests using gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')))
  where deleted_at is null;

create index if not exists idx_staynest_visitors_search
  on staynest_visitors using gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(phone, '') || ' ' || coalesce(purpose, '')))
  where deleted_at is null;

-- 2. PERFORMANCE INDEXES (common query patterns) ---------------------------

-- Residents
create index if not exists idx_staynest_residents_status
  on staynest_residents(status) where deleted_at is null;
create index if not exists staynest_residents_room_id_idx
  on staynest_residents(room_id) where deleted_at is null;

-- Rooms
create index if not exists idx_staynest_rooms_status
  on staynest_rooms(status) where deleted_at is null;

-- Rent records
create index if not exists idx_staynest_rent_records_status_month
  on staynest_rent_records(organization_id, status, billing_year, billing_month);
create index if not exists idx_staynest_rent_records_resident
  on staynest_rent_records(resident_id);

-- Maintenance
create index if not exists idx_staynest_maint_org_status
  on staynest_maintenance_requests(organization_id, status) where deleted_at is null;

-- Visitors
create index if not exists idx_staynest_visitors_check_in
  on staynest_visitors(check_in_at) where deleted_at is null;
create index if not exists idx_staynest_visitors_org_in_at
  on staynest_visitors(organization_id, check_in_at) where deleted_at is null;

-- Audit logs
create index if not exists idx_audit_logs_org_action
  on audit_logs(organization_id, action, created_at desc);

-- Announcements
create index if not exists idx_staynest_announcements_publish
  on staynest_announcements(organization_id, publish_date) where deleted_at is null;

-- 3. ANALYTICS VIEW (materialized snapshot for dashboard performance) -------
-- Kept as regular queries for simplicity; indexes above provide sufficient speed.

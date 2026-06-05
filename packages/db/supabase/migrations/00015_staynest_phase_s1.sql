-- ============================================================================
-- Phase S1 — Production StayNest Core Operations
-- ============================================================================
-- Transforms demo tables into production-ready operational schema.
-- Residents, Rooms, Maintenance, Visitors, Announcements.
-- ============================================================================

-- 1. RESIDENTS (alter) ------------------------------------------------------

alter table staynest_residents
  add column if not exists emergency_contact_name text,
  add column if not exists emergency_contact_phone text,
  add column if not exists id_proof_type text check (id_proof_type in ('aadhaar', 'pan', 'voter', 'driving_license', 'passport', 'other')),
  add column if not exists id_proof_number text,
  add column if not exists bed_number integer,
  add column if not exists deleted_at timestamptz,
  drop constraint if exists staynest_residents_status_check,
  add constraint staynest_residents_status_check
    check (status in ('active', 'notice_period', 'checked_out'));

-- Add room_id FK column (nullable initially for existing data)
alter table staynest_residents
  add column if not exists room_id uuid references staynest_rooms(id);

-- Rename columns for production semantics
-- guardian_name -> emergency_contact_name already handled above
-- joining_date -> check_in_date
alter table staynest_residents
  add column if not exists check_in_date date not null default current_date,
  add column if not exists check_out_date date;

-- Migrate existing joining_date values into check_in_date
update staynest_residents set check_in_date = joining_date where check_in_date = current_date and joining_date != current_date;

create index if not exists idx_staynest_residents_room_id on staynest_residents(room_id);
create index if not exists idx_staynest_residents_emergency on staynest_residents(emergency_contact_phone);
create index if not exists idx_staynest_residents_deleted on staynest_residents(deleted_at);

-- Migrate status values
update staynest_residents set status = 'checked_out' where status = 'inactive';

-- 2. ROOMS (alter) ----------------------------------------------------------

alter table staynest_rooms
  add column if not exists floor integer,
  add column if not exists occupied_beds integer not null default 0,
  add column if not exists rent_per_bed integer not null default 0,
  add column if not exists deleted_at timestamptz;

-- Copy existing values
update staynest_rooms set occupied_beds = occupied_count where occupied_beds = 0;
update staynest_rooms set rent_per_bed = monthly_rent where rent_per_bed = 0;

-- Update status values
update staynest_rooms set status = 'available' where status = 'active';
update staynest_rooms set status = 'maintenance' where status = 'inactive';

alter table staynest_rooms drop constraint if exists staynest_rooms_status_check;
alter table staynest_rooms
  add constraint staynest_rooms_status_check
    check (status in ('available', 'partially_occupied', 'full', 'maintenance'));

create index if not exists idx_staynest_rooms_floor on staynest_rooms(floor);
create index if not exists idx_staynest_rooms_deleted on staynest_rooms(deleted_at);

-- 3. MAINTENANCE REQUESTS (new table — replaces staynest_complaints) --------

create table if not exists staynest_maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null check (category in ('electrical', 'plumbing', 'furniture', 'internet', 'cleaning', 'other')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'open' check (status in ('open', 'assigned', 'in_progress', 'resolved', 'closed')),
  resident_id uuid references staynest_residents(id),
  room_id uuid references staynest_rooms(id),
  assigned_to uuid references auth.users(id),
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id),
  notes text,
  deleted_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_staynest_maint_req_org on staynest_maintenance_requests(organization_id);
create index idx_staynest_maint_req_status on staynest_maintenance_requests(status);
create index idx_staynest_maint_req_priority on staynest_maintenance_requests(priority);
create index idx_staynest_maint_req_category on staynest_maintenance_requests(category);
create index idx_staynest_maint_req_resident on staynest_maintenance_requests(resident_id);
create index idx_staynest_maint_req_room on staynest_maintenance_requests(room_id);
create index idx_staynest_maint_req_assigned on staynest_maintenance_requests(assigned_to);
create index idx_staynest_maint_req_deleted on staynest_maintenance_requests(deleted_at);

create trigger handle_staynest_maintenance_requests_updated_at
  before update on staynest_maintenance_requests
  for each row execute function update_updated_at();

alter table staynest_maintenance_requests enable row level security;

-- 4. VISITORS (alter) -------------------------------------------------------

alter table staynest_visitors
  add column if not exists resident_id uuid references staynest_residents(id),
  add column if not exists notes text,
  add column if not exists deleted_at timestamptz;

create index if not exists idx_staynest_visitors_resident on staynest_visitors(resident_id);
create index if not exists idx_staynest_visitors_check_in on staynest_visitors(check_in_at);
create index if not exists idx_staynest_visitors_deleted on staynest_visitors(deleted_at);

-- 5. ANNOUNCEMENTS (new table — replaces staynest_notices) ------------------

create table if not exists staynest_announcements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  title text not null,
  message text not null,
  priority text not null default 'normal' check (priority in ('normal', 'important', 'urgent')),
  publish_date date not null default current_date,
  expiry_date date,
  deleted_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_staynest_announcements_org on staynest_announcements(organization_id);
create index idx_staynest_announcements_priority on staynest_announcements(priority);
create index idx_staynest_announcements_publish on staynest_announcements(publish_date);
create index idx_staynest_announcements_deleted on staynest_announcements(deleted_at);

create trigger handle_staynest_announcements_updated_at
  before update on staynest_announcements
  for each row execute function update_updated_at();

alter table staynest_announcements enable row level security;

-- 6. RLS POLICIES (using is_member_of_org helper from 00011) ----------------

-- staynest_maintenance_requests
create policy "Members can view maintenance requests"
  on staynest_maintenance_requests for select
  using (public.is_member_of_org(organization_id));

create policy "Members can create maintenance requests"
  on staynest_maintenance_requests for insert
  with check (public.is_member_of_org(organization_id));

create policy "Members can update maintenance requests"
  on staynest_maintenance_requests for update
  using (public.is_member_of_org(organization_id));

-- staynest_announcements
create policy "Members can view announcements"
  on staynest_announcements for select
  using (public.is_member_of_org(organization_id));

create policy "Members can create announcements"
  on staynest_announcements for insert
  with check (public.is_member_of_org(organization_id));

create policy "Members can update announcements"
  on staynest_announcements for update
  using (public.is_member_of_org(organization_id));

-- Redefine existing table policies to use helper (replaces recursive subqueries)
drop policy if exists "Members can view residents in their organization" on staynest_residents;
drop policy if exists "Members can create residents in their organization" on staynest_residents;
drop policy if exists "Members can update residents in their organization" on staynest_residents;

create policy "Members can view residents"
  on staynest_residents for select
  using (public.is_member_of_org(organization_id));

create policy "Members can create residents"
  on staynest_residents for insert
  with check (public.is_member_of_org(organization_id));

create policy "Members can update residents"
  on staynest_residents for update
  using (public.is_member_of_org(organization_id));

drop policy if exists "Members can view rooms in their organization" on staynest_rooms;
drop policy if exists "Members can create rooms in their organization" on staynest_rooms;
drop policy if exists "Members can update rooms in their organization" on staynest_rooms;

create policy "Members can view rooms"
  on staynest_rooms for select
  using (public.is_member_of_org(organization_id));

create policy "Members can create rooms"
  on staynest_rooms for insert
  with check (public.is_member_of_org(organization_id));

create policy "Members can update rooms"
  on staynest_rooms for update
  using (public.is_member_of_org(organization_id));

drop policy if exists "Members can view visitors in their organization" on staynest_visitors;
drop policy if exists "Members can create visitors in their organization" on staynest_visitors;
drop policy if exists "Members can update visitors in their organization" on staynest_visitors;

create policy "Members can view visitors"
  on staynest_visitors for select
  using (public.is_member_of_org(organization_id));

create policy "Members can create visitors"
  on staynest_visitors for insert
  with check (public.is_member_of_org(organization_id));

create policy "Members can update visitors"
  on staynest_visitors for update
  using (public.is_member_of_org(organization_id));

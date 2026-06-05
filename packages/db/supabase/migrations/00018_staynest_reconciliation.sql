-- ============================================================================
-- Reconciliation Migration — Applies ALL missing Phase S1/S2/S3 changes
-- ============================================================================
-- Safe to run multiple times. Idempotent guards everywhere.
-- Preserves all existing data. Fixes old values before new constraints.
-- ============================================================================

-- 0. SAFEGUARD: Skip if already fully reconciled ---------------------------
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'staynest_rooms'
      and column_name = 'floor'
  ) and exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'staynest_maintenance_requests'
  ) then
    raise notice 'Schema already reconciled (Phase S1-S3 columns + tables detected). Skipping.';
    return;
  end if;
end
$$;

-- ============================================================================
-- PART 1: MISSING COLUMNS (Phase S1 + S2 additive changes)
-- ============================================================================

-- 1a. staynest_residents ----------------------------------------------------

alter table staynest_residents
  add column if not exists emergency_contact_name text,
  add column if not exists emergency_contact_phone text,
  add column if not exists id_proof_type text,
  add column if not exists id_proof_number text,
  add column if not exists bed_number integer,
  add column if not exists deleted_at timestamptz,
  add column if not exists check_in_date date not null default current_date,
  add column if not exists check_out_date date;

-- Move existing joining_date values into check_in_date if check_in_date still default
update staynest_residents
  set check_in_date = joining_date
  where check_in_date = current_date
    and joining_date is not null
    and joining_date != current_date;

-- Rename guardian columns to emergency_contact (copy data, don't drop old)
update staynest_residents
  set emergency_contact_name = guardian_name
  where emergency_contact_name is null and guardian_name is not null;

update staynest_residents
  set emergency_contact_phone = guardian_phone
  where emergency_contact_phone is null and guardian_phone is not null;

-- Add id_proof_type check constraint (nullify invalid values first)
update staynest_residents set id_proof_type = null
  where id_proof_type is not null
    and id_proof_type not in ('aadhaar', 'pan', 'voter', 'driving_license', 'passport', 'other');
alter table staynest_residents
  drop constraint if exists staynest_residents_id_proof_type_check;
alter table staynest_residents
  add constraint staynest_residents_id_proof_type_check
    check (id_proof_type in ('aadhaar', 'pan', 'voter', 'driving_license', 'passport', 'other'));

-- 1b. staynest_rooms ---------------------------------------------------------

alter table staynest_rooms
  add column if not exists floor integer,
  add column if not exists occupied_beds integer not null default 0,
  add column if not exists rent_per_bed integer not null default 0,
  add column if not exists deleted_at timestamptz;

-- Migrate existing values
update staynest_rooms set occupied_beds = occupied_count where occupied_beds = 0;
update staynest_rooms set rent_per_bed = monthly_rent where rent_per_bed = 0;

-- 1c. staynest_visitors ------------------------------------------------------

alter table staynest_visitors
  add column if not exists resident_id uuid references staynest_residents(id),
  add column if not exists notes text,
  add column if not exists deleted_at timestamptz;

-- 1d. staynest_rent_records (Phase S2) ---------------------------------------

alter table staynest_rent_records
  add column if not exists rent_amount integer not null default 0,
  add column if not exists late_fee integer not null default 0,
  add column if not exists paid_amount integer not null default 0,
  add column if not exists payment_date timestamptz,
  add column if not exists receipt_number text;

-- Migrate existing data
update staynest_rent_records set rent_amount = amount where rent_amount = 0;
update staynest_rent_records set paid_amount = amount where paid_amount = 0 and status = 'paid';

-- 1e. organizations (Phase S2) -----------------------------------------------

alter table organizations
  add column if not exists late_fee_type text not null default 'fixed',
  add column if not exists late_fee_amount integer not null default 100,
  add column if not exists late_fee_grace_period integer not null default 3,
  add column if not exists rent_due_day integer not null default 5;

-- Add late_fee_type check constraint
alter table organizations
  drop constraint if exists organizations_late_fee_type_check;
alter table organizations
  add constraint organizations_late_fee_type_check
    check (late_fee_type in ('fixed', 'per_day'));

alter table organizations
  drop constraint if exists organizations_rent_due_day_check;
alter table organizations
  add constraint organizations_rent_due_day_check
    check (rent_due_day between 1 and 28);

-- ============================================================================
-- PART 2: STATUS CONSTRAINT UPDATES (safe migration of old values)
-- ============================================================================
-- CRITICAL: Drop old constraint FIRST, then UPDATE values that would have
-- violated it, then ADD the new constraint. This handles rows that may
-- already contain post-migration values from a partial 00015 run.
-- ============================================================================

-- 2a. staynest_rooms: 'active' -> 'available', 'inactive' -> 'maintenance'
--     New allowed: ('available', 'partially_occupied', 'full', 'maintenance')

alter table staynest_rooms
  drop constraint if exists staynest_rooms_status_check;

update staynest_rooms set status = 'available' where status = 'active';
update staynest_rooms set status = 'maintenance' where status = 'inactive';
-- Catch any row with a status not in the new set (e.g. from partial migration)
update staynest_rooms set status = 'available'
  where status is null or status not in ('available', 'partially_occupied', 'full', 'maintenance');

alter table staynest_rooms
  add constraint staynest_rooms_status_check
    check (status in ('available', 'partially_occupied', 'full', 'maintenance'));

-- 2b. staynest_residents: 'inactive' -> 'checked_out'
--     New allowed: ('active', 'notice_period', 'checked_out')

alter table staynest_residents
  drop constraint if exists staynest_residents_status_check;

update staynest_residents set status = 'checked_out' where status = 'inactive';
-- Catch any row with a status not in the new set
update staynest_residents set status = 'active'
  where status is null or status not in ('active', 'notice_period', 'checked_out');

alter table staynest_residents
  add constraint staynest_residents_status_check
    check (status in ('active', 'notice_period', 'checked_out'));

-- 2c. staynest_rent_records: add 'partially_paid'
--     New allowed: ('pending', 'paid', 'partially_paid', 'overdue')

alter table staynest_rent_records
  drop constraint if exists staynest_rent_records_status_check;

-- Normalize any unexpected status values
update staynest_rent_records set status = 'pending'
  where status is null or status not in ('pending', 'paid', 'partially_paid', 'overdue');

alter table staynest_rent_records
  add constraint staynest_rent_records_status_check
    check (status in ('pending', 'paid', 'partially_paid', 'overdue'));

-- ============================================================================
-- PART 3: NEW TABLES (Phase S1 + S2)
-- ============================================================================

-- 3a. staynest_maintenance_requests ------------------------------------------

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

-- 3b. staynest_announcements -------------------------------------------------

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

-- 3c. staynest_receipts (Phase S2) -------------------------------------------

create table if not exists staynest_receipts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  rent_record_id uuid not null references staynest_rent_records(id) on delete cascade,
  receipt_number text not null,
  amount_paid integer not null,
  payment_method text not null check (payment_method in ('cash', 'upi', 'bank_transfer', 'other')),
  payment_date timestamptz not null default now(),
  notes text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- 3d. staynest_notification_templates (Phase S2) -----------------------------

create table if not exists staynest_notification_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  event text not null check (event in (
    'rent_due', 'rent_overdue', 'announcement_created', 'maintenance_resolved'
  )),
  channel text not null check (channel in ('whatsapp', 'email', 'sms')),
  template_text text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, event, channel)
);

-- 3e. staynest_notification_logs (Phase S2) ----------------------------------

create table if not exists staynest_notification_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  template_id uuid references staynest_notification_templates(id),
  event text not null,
  channel text not null,
  recipient text not null,
  rendered_message text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- PART 4: TRIGGERS
-- ============================================================================

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'handle_staynest_maintenance_requests_updated_at') then
    create trigger handle_staynest_maintenance_requests_updated_at
      before update on staynest_maintenance_requests
      for each row execute function update_updated_at();
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'handle_staynest_announcements_updated_at') then
    create trigger handle_staynest_announcements_updated_at
      before update on staynest_announcements
      for each row execute function update_updated_at();
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'handle_staynest_notification_templates_updated_at') then
    create trigger handle_staynest_notification_templates_updated_at
      before update on staynest_notification_templates
      for each row execute function update_updated_at();
  end if;
end $$;

-- ============================================================================
-- PART 5: INDEXES (Phase S1 + S2 + S3)
-- ============================================================================

-- staynest_residents
create index if not exists idx_staynest_residents_room_id on staynest_residents(room_id);
create index if not exists idx_staynest_residents_emergency on staynest_residents(emergency_contact_phone);
create index if not exists idx_staynest_residents_deleted on staynest_residents(deleted_at);
create index if not exists idx_staynest_residents_search
  on staynest_residents using gin(to_tsvector('english', coalesce(full_name, '') || ' ' || coalesce(phone, '')))
  where deleted_at is null;
create index if not exists idx_staynest_residents_status
  on staynest_residents(status) where deleted_at is null;
create index if not exists staynest_residents_room_id_idx
  on staynest_residents(room_id) where deleted_at is null;

-- staynest_rooms
create index if not exists idx_staynest_rooms_floor on staynest_rooms(floor);
create index if not exists idx_staynest_rooms_deleted on staynest_rooms(deleted_at);
create index if not exists idx_staynest_rooms_search
  on staynest_rooms using gin(to_tsvector('english', coalesce(room_number, '')))
  where deleted_at is null;
create index if not exists idx_staynest_rooms_status
  on staynest_rooms(status) where deleted_at is null;

-- staynest_visitors
create index if not exists idx_staynest_visitors_resident on staynest_visitors(resident_id);
create index if not exists idx_staynest_visitors_check_in on staynest_visitors(check_in_at);
create index if not exists idx_staynest_visitors_deleted on staynest_visitors(deleted_at);
create index if not exists idx_staynest_visitors_search
  on staynest_visitors using gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(phone, '') || ' ' || coalesce(purpose, '')))
  where deleted_at is null;
create index if not exists idx_staynest_visitors_org_in_at
  on staynest_visitors(organization_id, check_in_at) where deleted_at is null;

-- staynest_rent_records
create index if not exists idx_staynest_rent_records_month on staynest_rent_records(billing_year, billing_month);
create index if not exists staynest_rent_records_status_idx on staynest_rent_records(status);
create index if not exists staynest_rent_records_receipt on staynest_rent_records(receipt_number);
create index if not exists idx_staynest_rent_records_status_month
  on staynest_rent_records(organization_id, status, billing_year, billing_month);
create index if not exists idx_staynest_rent_records_resident
  on staynest_rent_records(resident_id);

-- staynest_maintenance_requests
create index if not exists idx_staynest_maint_req_org on staynest_maintenance_requests(organization_id);
create index if not exists idx_staynest_maint_req_status on staynest_maintenance_requests(status);
create index if not exists idx_staynest_maint_req_priority on staynest_maintenance_requests(priority);
create index if not exists idx_staynest_maint_req_category on staynest_maintenance_requests(category);
create index if not exists idx_staynest_maint_req_resident on staynest_maintenance_requests(resident_id);
create index if not exists idx_staynest_maint_req_room on staynest_maintenance_requests(room_id);
create index if not exists idx_staynest_maint_req_assigned on staynest_maintenance_requests(assigned_to);
create index if not exists idx_staynest_maint_req_deleted on staynest_maintenance_requests(deleted_at);
create index if not exists idx_staynest_maint_request_search
  on staynest_maintenance_requests using gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')))
  where deleted_at is null;
create index if not exists idx_staynest_maint_org_status
  on staynest_maintenance_requests(organization_id, status) where deleted_at is null;

-- staynest_announcements
create index if not exists idx_staynest_announcements_org on staynest_announcements(organization_id);
create index if not exists idx_staynest_announcements_priority on staynest_announcements(priority);
create index if not exists idx_staynest_announcements_publish on staynest_announcements(publish_date);
create index if not exists idx_staynest_announcements_deleted on staynest_announcements(deleted_at);
create index if not exists idx_staynest_announcements_publish
  on staynest_announcements(organization_id, publish_date) where deleted_at is null;

-- staynest_receipts
create index if not exists idx_staynest_receipts_org on staynest_receipts(organization_id);
create index if not exists idx_staynest_receipts_rent on staynest_receipts(rent_record_id);
create index if not exists idx_staynest_receipts_number on staynest_receipts(receipt_number);

-- staynest_notification_logs
create index if not exists idx_staynest_notif_logs_org on staynest_notification_logs(organization_id);
create index if not exists idx_staynest_notif_logs_event on staynest_notification_logs(event);
create index if not exists idx_staynest_notif_logs_status on staynest_notification_logs(status);

-- audit_logs
create index if not exists idx_audit_logs_org_action
  on audit_logs(organization_id, action, created_at desc);

-- ============================================================================
-- PART 6: RLS POLICIES
-- ============================================================================

-- 6a. staynest_maintenance_requests ------------------------------------------

alter table staynest_maintenance_requests enable row level security;

drop policy if exists "Members can view maintenance requests" on staynest_maintenance_requests;
create policy "Members can view maintenance requests"
  on staynest_maintenance_requests for select
  using (public.is_member_of_org(organization_id));

drop policy if exists "Members can create maintenance requests" on staynest_maintenance_requests;
create policy "Members can create maintenance requests"
  on staynest_maintenance_requests for insert
  with check (public.is_member_of_org(organization_id));

drop policy if exists "Members can update maintenance requests" on staynest_maintenance_requests;
create policy "Members can update maintenance requests"
  on staynest_maintenance_requests for update
  using (public.is_member_of_org(organization_id));

-- 6b. staynest_announcements ------------------------------------------------

alter table staynest_announcements enable row level security;

drop policy if exists "Members can view announcements" on staynest_announcements;
create policy "Members can view announcements"
  on staynest_announcements for select
  using (public.is_member_of_org(organization_id));

drop policy if exists "Members can create announcements" on staynest_announcements;
create policy "Members can create announcements"
  on staynest_announcements for insert
  with check (public.is_member_of_org(organization_id));

drop policy if exists "Members can update announcements" on staynest_announcements;
create policy "Members can update announcements"
  on staynest_announcements for update
  using (public.is_member_of_org(organization_id));

-- 6c. staynest_receipts ------------------------------------------------------

alter table staynest_receipts enable row level security;

drop policy if exists receipts_select on staynest_receipts;
create policy receipts_select on staynest_receipts
  for select using (public.is_member_of_org(organization_id));

drop policy if exists receipts_insert on staynest_receipts;
create policy receipts_insert on staynest_receipts
  for insert with check (public.is_member_of_org(organization_id));

-- 6d. staynest_notification_templates ---------------------------------------

alter table staynest_notification_templates enable row level security;

drop policy if exists notif_templates_select on staynest_notification_templates;
create policy notif_templates_select on staynest_notification_templates
  for select using (organization_id is null or public.is_member_of_org(organization_id));

-- 6e. staynest_notification_logs --------------------------------------------

alter table staynest_notification_logs enable row level security;

drop policy if exists notif_logs_select on staynest_notification_logs;
create policy notif_logs_select on staynest_notification_logs
  for select using (public.is_member_of_org(organization_id));

drop policy if exists notif_logs_insert on staynest_notification_logs;
create policy notif_logs_insert on staynest_notification_logs
  for insert with check (public.is_member_of_org(organization_id));

-- 6f. Migrate existing StayNest table policies to use is_member_of_org() ----

drop policy if exists "Members can view residents in their organization" on staynest_residents;
drop policy if exists "Members can create residents in their organization" on staynest_residents;
drop policy if exists "Members can update residents in their organization" on staynest_residents;

drop policy if exists "Members can view residents" on staynest_residents;
create policy "Members can view residents"
  on staynest_residents for select
  using (public.is_member_of_org(organization_id));

drop policy if exists "Members can create residents" on staynest_residents;
create policy "Members can create residents"
  on staynest_residents for insert
  with check (public.is_member_of_org(organization_id));

drop policy if exists "Members can update residents" on staynest_residents;
create policy "Members can update residents"
  on staynest_residents for update
  using (public.is_member_of_org(organization_id));

-- Rooms
drop policy if exists "Members can view rooms in their organization" on staynest_rooms;
drop policy if exists "Members can create rooms in their organization" on staynest_rooms;
drop policy if exists "Members can update rooms in their organization" on staynest_rooms;

drop policy if exists "Members can view rooms" on staynest_rooms;
create policy "Members can view rooms"
  on staynest_rooms for select
  using (public.is_member_of_org(organization_id));

drop policy if exists "Members can create rooms" on staynest_rooms;
create policy "Members can create rooms"
  on staynest_rooms for insert
  with check (public.is_member_of_org(organization_id));

drop policy if exists "Members can update rooms" on staynest_rooms;
create policy "Members can update rooms"
  on staynest_rooms for update
  using (public.is_member_of_org(organization_id));

-- Visitors
drop policy if exists "Members can view visitors in their organization" on staynest_visitors;
drop policy if exists "Members can create visitors in their organization" on staynest_visitors;
drop policy if exists "Members can update visitors in their organization" on staynest_visitors;

drop policy if exists "Members can view visitors" on staynest_visitors;
create policy "Members can view visitors"
  on staynest_visitors for select
  using (public.is_member_of_org(organization_id));

drop policy if exists "Members can create visitors" on staynest_visitors;
create policy "Members can create visitors"
  on staynest_visitors for insert
  with check (public.is_member_of_org(organization_id));

drop policy if exists "Members can update visitors" on staynest_visitors;
create policy "Members can update visitors"
  on staynest_visitors for update
  using (public.is_member_of_org(organization_id));

-- Complaints (keep backward compat)
drop policy if exists "Members can view complaints in their organization" on staynest_complaints;
drop policy if exists "Members can create complaints in their organization" on staynest_complaints;
drop policy if exists "Members can update complaints in their organization" on staynest_complaints;

drop policy if exists "Members can view complaints" on staynest_complaints;
create policy "Members can view complaints"
  on staynest_complaints for select
  using (public.is_member_of_org(organization_id));

drop policy if exists "Members can create complaints" on staynest_complaints;
create policy "Members can create complaints"
  on staynest_complaints for insert
  with check (public.is_member_of_org(organization_id));

drop policy if exists "Members can update complaints" on staynest_complaints;
create policy "Members can update complaints"
  on staynest_complaints for update
  using (public.is_member_of_org(organization_id));

-- Notices (keep backward compat)
drop policy if exists "Members can view notices in their organization" on staynest_notices;
drop policy if exists "Members can create notices in their organization" on staynest_notices;
drop policy if exists "Members can update notices in their organization" on staynest_notices;

drop policy if exists "Members can view notices" on staynest_notices;
create policy "Members can view notices"
  on staynest_notices for select
  using (public.is_member_of_org(organization_id));

drop policy if exists "Members can create notices" on staynest_notices;
create policy "Members can create notices"
  on staynest_notices for insert
  with check (public.is_member_of_org(organization_id));

drop policy if exists "Members can update notices" on staynest_notices;
create policy "Members can update notices"
  on staynest_notices for update
  using (public.is_member_of_org(organization_id));

-- Rent records (Phase S2)
drop policy if exists "Members can view rent records in their organization" on staynest_rent_records;
drop policy if exists "Members can create rent records in their organization" on staynest_rent_records;
drop policy if exists "Members can update rent records in their organization" on staynest_rent_records;

drop policy if exists "Members can view rent records" on staynest_rent_records;
create policy "Members can view rent records"
  on staynest_rent_records for select
  using (public.is_member_of_org(organization_id));

drop policy if exists "Members can create rent records" on staynest_rent_records;
create policy "Members can create rent records"
  on staynest_rent_records for insert
  with check (public.is_member_of_org(organization_id));

drop policy if exists "Members can update rent records" on staynest_rent_records;
create policy "Members can update rent records"
  on staynest_rent_records for update
  using (public.is_member_of_org(organization_id));

-- ============================================================================
-- PART 7: HELPER FUNCTIONS (Phase S2)
-- ============================================================================

-- 7a. Receipt number sequence -------------------------------------------------

create sequence if not exists staynest_receipt_number_seq;

-- 7b. generate_receipt_number ------------------------------------------------

create or replace function generate_receipt_number(org_id uuid)
returns text
language plpgsql
security definer
as $$
declare
  seq bigint;
  prefix text;
begin
  select coalesce(max(regexp_replace(receipt_number, '^RCP-', '')::int), 0) + 1
    into seq
    from staynest_receipts
    where organization_id = org_id;

  prefix := to_char(now(), 'YYYYMM');
  return 'RCP-' || prefix || '-' || lpad(seq::text, 5, '0');
end;
$$;

-- 7c. calculate_late_fee ------------------------------------------------------

create or replace function calculate_late_fee(
  org_id uuid,
  days_overdue integer
)
returns integer
language plpgsql
security definer
as $$
declare
  fee_type text;
  fee_amount integer;
  grace integer;
begin
  select late_fee_type, late_fee_amount, late_fee_grace_period
    into fee_type, fee_amount, grace
    from organizations
    where id = org_id;

  if days_overdue <= grace then
    return 0;
  end if;

  if fee_type = 'fixed' then
    return fee_amount;
  else
    return fee_amount * (days_overdue - grace);
  end if;
end;
$$;

-- 7d. process_overdue_rent ----------------------------------------------------

create or replace function process_overdue_rent(org_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  rec record;
  days_over int;
  calculated_fee int;
begin
  for rec in
    select id, due_date, rent_amount, late_fee, status
    from staynest_rent_records
    where organization_id = org_id
      and status in ('pending', 'partially_paid')
      and due_date < current_date
  loop
    days_over := current_date - rec.due_date::date;

    if rec.status = 'pending' then
      calculated_fee := calculate_late_fee(org_id, days_over);
      if calculated_fee != rec.late_fee then
        update staynest_rent_records
          set late_fee = calculated_fee,
              amount = rec.rent_amount + calculated_fee,
              status = 'overdue'
          where id = rec.id;
      end if;
    end if;

    if rec.status = 'partially_paid' then
      calculated_fee := calculate_late_fee(org_id, days_over);
      if calculated_fee != rec.late_fee then
        update staynest_rent_records
          set late_fee = calculated_fee,
              amount = rec.rent_amount + calculated_fee
          where id = rec.id;
      end if;
    end if;
  end loop;
end;
$$;

-- ============================================================================
-- PART 8: SEED DATA (idempotent)
-- ============================================================================

-- Notification templates (system-wide defaults)
insert into staynest_notification_templates (organization_id, event, channel, template_text) values
  (null, 'rent_due', 'whatsapp',
   'Dear {{resident_name}}, your rent of ₹{{rent_amount}} for {{month}} {{year}} is due on {{due_date}}. Please pay to avoid late fees. - StayNest'),
  (null, 'rent_overdue', 'whatsapp',
   'Dear {{resident_name}}, your rent of ₹{{amount}} for {{month}} {{year}} is now overdue. Late fee of ₹{{late_fee}} has been applied. Total due: ₹{{total_due}}. - StayNest'),
  (null, 'announcement_created', 'whatsapp',
   '📢 {{title}}: {{message}} - StayNest'),
  (null, 'maintenance_resolved', 'whatsapp',
   'Dear {{resident_name}}, your maintenance request "{{title}}" has been resolved. Please confirm. - StayNest')
on conflict (organization_id, event, channel) do nothing;

-- ============================================================================
-- COMPLETE
-- ============================================================================

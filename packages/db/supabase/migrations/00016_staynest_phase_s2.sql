-- ============================================================================
-- Phase S2 — Rent Collection & Automation
-- ============================================================================
-- Revenue engine: rent ledger, receipts, late fees, notifications.
-- ============================================================================

-- 1. RENT RECORDS (alter) ---------------------------------------------------
-- Extend existing table with revenue-engine columns.

alter table staynest_rent_records
  add column if not exists rent_amount integer not null default 0,
  add column if not exists late_fee integer not null default 0,
  add column if not exists paid_amount integer not null default 0,
  add column if not exists payment_date timestamptz,
  add column if not exists receipt_number text;

-- Migrate existing data
update staynest_rent_records set rent_amount = amount where rent_amount = 0;
update staynest_rent_records set paid_amount = amount where paid_amount = 0 and status = 'paid';

-- Update status check to include partially_paid
alter table staynest_rent_records
  drop constraint if exists staynest_rent_records_status_check;

alter table staynest_rent_records
  add constraint staynest_rent_records_status_check
    check (status in ('pending', 'paid', 'partially_paid', 'overdue'));

create index if not exists idx_staynest_rent_records_month on staynest_rent_records(billing_year, billing_month);
create index if not exists staynest_rent_records_status_idx on staynest_rent_records(status);
create index if not exists staynest_rent_records_receipt on staynest_rent_records(receipt_number);

-- 2. ORGANIZATION SETTINGS (alter) ------------------------------------------
-- Rent automation configuration.

alter table organizations
  add column if not exists late_fee_type text not null default 'fixed'
    check (late_fee_type in ('fixed', 'per_day')),
  add column if not exists late_fee_amount integer not null default 100,
  add column if not exists late_fee_grace_period integer not null default 3,
  add column if not exists rent_due_day integer not null default 5
    check (rent_due_day between 1 and 28);

-- 3. RECEIPTS (new table) ----------------------------------------------------

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

create index if not exists idx_staynest_receipts_org on staynest_receipts(organization_id);
create index if not exists idx_staynest_receipts_rent on staynest_receipts(rent_record_id);
create index if not exists idx_staynest_receipts_number on staynest_receipts(receipt_number);

-- Receipt numbering sequence (per organization)
create sequence if not exists staynest_receipt_number_seq;

-- 4. NOTIFICATION TEMPLATES (new table) --------------------------------------

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

create trigger handle_staynest_notification_templates_updated_at
  before update on staynest_notification_templates
  for each row execute function update_updated_at();

-- Seed default system-wide templates (org_id = null)
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

-- 5. NOTIFICATION LOGS (new table) ------------------------------------------

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

create index if not exists idx_staynest_notif_logs_org on staynest_notification_logs(organization_id);
create index if not exists idx_staynest_notif_logs_event on staynest_notification_logs(event);
create index if not exists idx_staynest_notif_logs_status on staynest_notification_logs(status);

-- 6. RLS POLICIES -----------------------------------------------------------

-- Receipts
alter table staynest_receipts enable row level security;

create policy receipts_select on staynest_receipts
  for select using (
    is_member_of_org(organization_id)
  );

create policy receipts_insert on staynest_receipts
  for insert with check (
    is_member_of_org(organization_id)
  );

-- Notification templates (read-only for members)
alter table staynest_notification_templates enable row level security;

create policy notif_templates_select on staynest_notification_templates
  for select using (
    organization_id is null or is_member_of_org(organization_id)
  );

-- Notification logs (insert only for service, select for members)
alter table staynest_notification_logs enable row level security;

create policy notif_logs_select on staynest_notification_logs
  for select using (
    is_member_of_org(organization_id)
  );

create policy notif_logs_insert on staynest_notification_logs
  for insert with check (
    is_member_of_org(organization_id)
  );

-- 7. HELPER FUNCTIONS -------------------------------------------------------

-- Generate next receipt number for an organization
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

-- Calculate late fee for an organization
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

-- Mark overdue records and apply late fees
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

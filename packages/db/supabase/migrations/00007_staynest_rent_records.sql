-- StayNest: Rent Records

create table if not exists staynest_rent_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  resident_id uuid not null references staynest_residents(id),
  room_id uuid references staynest_rooms(id),

  billing_month integer not null check (billing_month between 1 and 12),
  billing_year integer not null,

  amount integer not null check (amount >= 0),

  due_date date not null,

  paid_at timestamptz,
  payment_method text check (payment_method in ('cash', 'upi', 'bank_transfer', 'other')),

  status text not null default 'pending' check (status in ('pending', 'paid', 'overdue')),

  notes text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_staynest_rent_records_org on staynest_rent_records(organization_id);
create index idx_staynest_rent_records_resident on staynest_rent_records(resident_id);
create index idx_staynest_rent_records_status on staynest_rent_records(status);
create index idx_staynest_rent_records_due on staynest_rent_records(due_date);

-- updated_at trigger
create trigger handle_staynest_rent_records_updated_at
  before update on staynest_rent_records
  for each row
  execute function update_updated_at();

-- RLS
alter table staynest_rent_records enable row level security;

create policy "Members can view rent records in their organization"
  on staynest_rent_records for select
  using (
    exists (
      select 1 from organization_members
      where organization_id = staynest_rent_records.organization_id
        and user_id = auth.uid()
    )
  );

create policy "Members can create rent records in their organization"
  on staynest_rent_records for insert
  with check (
    exists (
      select 1 from organization_members
      where organization_id = staynest_rent_records.organization_id
        and user_id = auth.uid()
    )
  );

create policy "Members can update rent records in their organization"
  on staynest_rent_records for update
  using (
    exists (
      select 1 from organization_members
      where organization_id = staynest_rent_records.organization_id
        and user_id = auth.uid()
    )
  );

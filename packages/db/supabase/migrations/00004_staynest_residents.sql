-- StayNest: Residents

create table if not exists staynest_residents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  gender text check (gender in ('male', 'female', 'other')),
  guardian_name text,
  guardian_phone text,
  room_number text not null,
  joining_date date not null default current_date,
  status text not null default 'active' check (status in ('active', 'inactive')),
  notes text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_staynest_residents_org on staynest_residents(organization_id);
create index idx_staynest_residents_status on staynest_residents(status);
create index idx_staynest_residents_room on staynest_residents(room_number);

-- updated_at trigger
create trigger handle_staynest_residents_updated_at
  before update on staynest_residents
  for each row
  execute function update_updated_at();

-- RLS
alter table staynest_residents enable row level security;

create policy "Members can view residents in their organization"
  on staynest_residents for select
  using (
    exists (
      select 1 from organization_members
      where organization_id = staynest_residents.organization_id
        and user_id = auth.uid()
    )
  );

create policy "Members can create residents in their organization"
  on staynest_residents for insert
  with check (
    exists (
      select 1 from organization_members
      where organization_id = staynest_residents.organization_id
        and user_id = auth.uid()
    )
  );

create policy "Members can update residents in their organization"
  on staynest_residents for update
  using (
    exists (
      select 1 from organization_members
      where organization_id = staynest_residents.organization_id
        and user_id = auth.uid()
    )
  );

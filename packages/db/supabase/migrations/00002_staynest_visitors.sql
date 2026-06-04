-- StayNest: Visitor Log

create table if not exists staynest_visitors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  phone text not null,
  purpose text not null,
  room_number text not null,
  status text not null default 'checked-in' check (status in ('checked-in', 'checked-out')),
  check_in_at timestamptz not null default now(),
  check_out_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_staynest_visitors_org on staynest_visitors(organization_id);
create index idx_staynest_visitors_status on staynest_visitors(status);

-- updated_at trigger
create trigger handle_staynest_visitors_updated_at
  before update on staynest_visitors
  for each row
  execute function update_updated_at();

-- RLS
alter table staynest_visitors enable row level security;

create policy "Members can view visitors in their organization"
  on staynest_visitors for select
  using (
    exists (
      select 1 from organization_members
      where organization_id = staynest_visitors.organization_id
        and user_id = auth.uid()
    )
  );

create policy "Members can create visitors in their organization"
  on staynest_visitors for insert
  with check (
    exists (
      select 1 from organization_members
      where organization_id = staynest_visitors.organization_id
        and user_id = auth.uid()
    )
  );

create policy "Members can update visitors in their organization"
  on staynest_visitors for update
  using (
    exists (
      select 1 from organization_members
      where organization_id = staynest_visitors.organization_id
        and user_id = auth.uid()
    )
  );

-- StayNest: Rooms

create table if not exists staynest_rooms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  room_number text not null,
  room_type text check (room_type in ('single', 'double', 'triple', 'dorm', 'other')),
  capacity integer not null default 1,
  occupied_count integer not null default 0,
  monthly_rent integer not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive', 'maintenance')),
  notes text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_staynest_rooms_org on staynest_rooms(organization_id);
create index idx_staynest_rooms_status on staynest_rooms(status);

-- updated_at trigger
create trigger handle_staynest_rooms_updated_at
  before update on staynest_rooms
  for each row
  execute function update_updated_at();

-- RLS
alter table staynest_rooms enable row level security;

create policy "Members can view rooms in their organization"
  on staynest_rooms for select
  using (
    exists (
      select 1 from organization_members
      where organization_id = staynest_rooms.organization_id
        and user_id = auth.uid()
    )
  );

create policy "Members can create rooms in their organization"
  on staynest_rooms for insert
  with check (
    exists (
      select 1 from organization_members
      where organization_id = staynest_rooms.organization_id
        and user_id = auth.uid()
    )
  );

create policy "Members can update rooms in their organization"
  on staynest_rooms for update
  using (
    exists (
      select 1 from organization_members
      where organization_id = staynest_rooms.organization_id
        and user_id = auth.uid()
    )
  );

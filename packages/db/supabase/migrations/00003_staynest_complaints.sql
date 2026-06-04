-- StayNest: Complaint Tracker

create table if not exists staynest_complaints (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  title text not null,
  description text not null,
  raised_by text not null,
  room_number text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'in-progress', 'resolved')),
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_staynest_complaints_org on staynest_complaints(organization_id);
create index idx_staynest_complaints_status on staynest_complaints(status);
create index idx_staynest_complaints_priority on staynest_complaints(priority);

-- updated_at trigger
create trigger handle_staynest_complaints_updated_at
  before update on staynest_complaints
  for each row
  execute function update_updated_at();

-- RLS
alter table staynest_complaints enable row level security;

create policy "Members can view complaints in their organization"
  on staynest_complaints for select
  using (
    exists (
      select 1 from organization_members
      where organization_id = staynest_complaints.organization_id
        and user_id = auth.uid()
    )
  );

create policy "Members can create complaints in their organization"
  on staynest_complaints for insert
  with check (
    exists (
      select 1 from organization_members
      where organization_id = staynest_complaints.organization_id
        and user_id = auth.uid()
    )
  );

create policy "Members can update complaints in their organization"
  on staynest_complaints for update
  using (
    exists (
      select 1 from organization_members
      where organization_id = staynest_complaints.organization_id
        and user_id = auth.uid()
    )
  );

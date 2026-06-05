-- StayNest: Notices

create table if not exists staynest_notices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  title text not null,
  content text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_staynest_notices_org on staynest_notices(organization_id);
create index idx_staynest_notices_status on staynest_notices(status);

-- updated_at trigger
create trigger handle_staynest_notices_updated_at
  before update on staynest_notices
  for each row
  execute function update_updated_at();

-- RLS
alter table staynest_notices enable row level security;

create policy "Members can view notices in their organization"
  on staynest_notices for select
  using (
    exists (
      select 1 from organization_members
      where organization_id = staynest_notices.organization_id
        and user_id = auth.uid()
    )
  );

create policy "Members can create notices in their organization"
  on staynest_notices for insert
  with check (
    exists (
      select 1 from organization_members
      where organization_id = staynest_notices.organization_id
        and user_id = auth.uid()
    )
  );

create policy "Members can update notices in their organization"
  on staynest_notices for update
  using (
    exists (
      select 1 from organization_members
      where organization_id = staynest_notices.organization_id
        and user_id = auth.uid()
    )
  );

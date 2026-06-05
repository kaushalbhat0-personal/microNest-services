-- Product Feedback / Pain Collection — cross-ecosystem feature discovery

create table if not exists product_feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_name text not null,
  phone text not null,
  ecosystem text not null check (ecosystem in ('staynest', 'clinicnest', 'freelancenest', 'propertynest')),
  category text not null check (category in ('rent', 'rooms', 'complaints', 'visitors', 'electricity', 'staff', 'food', 'deposits', 'attendance', 'other')),
  problem text not null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'planned', 'implemented')),
  created_at timestamptz not null default now()
);

create index idx_product_feedback_ecosystem on product_feedback(ecosystem);
create index idx_product_feedback_category on product_feedback(category);
create index idx_product_feedback_status on product_feedback(status);

-- RLS: only organization members can view feedback for their ecosystem
alter table product_feedback enable row level security;

create policy "Members can view feedback"
  on product_feedback for select
  using (
    exists (
      select 1 from organization_members
      where user_id = auth.uid()
    )
  );

create policy "Anyone can submit feedback"
  on product_feedback for insert
  with check (true);

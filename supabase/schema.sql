-- Run this in the Supabase SQL editor

create table if not exists founders (
  id          text        primary key,
  name        text        not null,
  role        text        not null,
  company     text        not null,
  tools       jsonb       not null default '[]'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Row Level Security (open for MVP — no auth yet)
alter table founders enable row level security;

create policy "Public read"   on founders for select using (true);
create policy "Public insert" on founders for insert with check (true);
create policy "Public update" on founders for update using (true);
create policy "Public delete" on founders for delete using (true);

-- Enable real-time
alter publication supabase_realtime add table founders;

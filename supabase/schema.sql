-- Run this in Supabase SQL Editor (Project → SQL Editor → New query)

create table if not exists memoboard_notes (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  role        text not null,
  message     text not null,
  ip_hash     text,
  color       text default 'white',
  rotate      int  default 0,
  pos_top     text default '10%',
  pos_left    text default '10%',
  created_at  timestamptz default now()
);

-- Enable RLS
alter table memoboard_notes enable row level security;

-- Public: read all + insert (no update/delete from client)
create policy "public_read" on memoboard_notes
  for select using (true);

create policy "public_insert" on memoboard_notes
  for insert with check (true);

-- Index for faster loading
create index if not exists memoboard_created_idx
  on memoboard_notes (created_at desc);

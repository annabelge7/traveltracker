-- Supabase Database Schema for TravelTracker
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Posts table
create table if not exists posts (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('place', 'hostel', 'people', 'bus', 'photo', 'other')),
  title text not null,
  description text,
  location text,
  country text,
  latitude double precision,
  longitude double precision,
  date date not null default current_date,
  photos text[] default '{}',
  metadata jsonb default '{}'
);

-- Create indexes for common queries
create index if not exists posts_user_id_idx on posts(user_id);
create index if not exists posts_date_idx on posts(date desc);
create index if not exists posts_type_idx on posts(type);
create index if not exists posts_country_idx on posts(country);

-- Enable Row Level Security
alter table posts enable row level security;

-- Policy: Anyone can view posts (public timeline)
create policy "Posts are viewable by everyone"
  on posts for select
  using (true);

-- Policy: Only authenticated users can insert their own posts
create policy "Users can insert their own posts"
  on posts for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own posts
create policy "Users can update their own posts"
  on posts for update
  using (auth.uid() = user_id);

-- Policy: Users can delete their own posts
create policy "Users can delete their own posts"
  on posts for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_posts_updated_at
  before update on posts
  for each row
  execute function update_updated_at_column();

-- Storage bucket for photos
-- Run this in the Supabase dashboard under Storage or via API

-- insert into storage.buckets (id, name, public)
-- values ('photos', 'photos', true);

-- Storage policies (run in SQL editor after creating bucket)
-- create policy "Anyone can view photos"
--   on storage.objects for select
--   using (bucket_id = 'photos');

-- create policy "Authenticated users can upload photos"
--   on storage.objects for insert
--   with check (bucket_id = 'photos' and auth.role() = 'authenticated');

-- create policy "Users can delete their own photos"
--   on storage.objects for delete
--   using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);

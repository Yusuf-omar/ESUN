-- ESUN: Egyptian Students Union - Nisantasi University
-- Run this in Supabase SQL Editor to create tables and RLS.
-- This file is idempotent and safe to re-run.

create extension if not exists pgcrypto;

-- Profiles (extend auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  student_number text unique,
  phone_number text,
  email text,
  updated_at timestamptz default now()
);
alter table public.profiles add column if not exists phone_number text;
alter table public.profiles add column if not exists email text;

-- Applications (service requests)
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  service_type text not null check (
    service_type in (
      'academic_support',
      'cultural_activities',
      'religious_social_guidance'
    )
  ),
  description text not null,
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'resolved')
  ),
  created_at timestamptz not null default now()
);
alter table public.applications add column if not exists archived_at timestamptz;
create index if not exists applications_archived_created_idx
  on public.applications (archived_at, created_at desc);

-- Events (for admin and community)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content_locale text not null default 'ar' check (content_locale in ('ar', 'en', 'tr', 'all')),
  date date not null,
  registration_link text,
  created_at timestamptz default now()
);
alter table public.events add column if not exists content_locale text;
update public.events set content_locale = 'ar' where content_locale is null;
alter table public.events alter column content_locale set default 'ar';
alter table public.events alter column content_locale set not null;

-- Library resources
create table if not exists public.library_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content_locale text not null default 'ar' check (content_locale in ('ar', 'en', 'tr', 'all')),
  author text,
  category text,
  description text,
  file_url text,
  post_url text,
  preview_image_url text,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.library_items add column if not exists post_url text;
alter table public.library_items add column if not exists preview_image_url text;
alter table public.library_items add column if not exists content_locale text;
update public.library_items set content_locale = 'ar' where content_locale is null;
alter table public.library_items alter column content_locale set default 'ar';
alter table public.library_items alter column content_locale set not null;

-- Backfill legacy data: old file_url becomes post_url if post_url is empty.
update public.library_items
set post_url = file_url
where post_url is null
  and file_url is not null;

-- Contact messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone_number text,
  email text,
  message text not null,
  created_at timestamptz default now()
);
alter table public.contact_messages add column if not exists phone_number text;
alter table public.contact_messages alter column email drop not null;
create index if not exists contact_messages_phone_created_at_idx
  on public.contact_messages (phone_number, created_at desc);

-- RLS
alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.events enable row level security;
alter table public.library_items enable row level security;
alter table public.contact_messages enable row level security;

-- Profiles: users can read/update/insert own row
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Applications: users can insert/read/delete own
drop policy if exists "Users can insert own application" on public.applications;
create policy "Users can insert own application"
  on public.applications for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own applications" on public.applications;
create policy "Users can read own applications"
  on public.applications for select
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own applications" on public.applications;
create policy "Users can delete own applications"
  on public.applications for delete
  using (auth.uid() = user_id);

-- Events: public read
drop policy if exists "Anyone can read events" on public.events;
create policy "Anyone can read events"
  on public.events for select
  using (true);

-- Library: public read for published resources
drop policy if exists "Anyone can read library items" on public.library_items;
create policy "Anyone can read library items"
  on public.library_items for select
  using (is_public = true);

-- Contact: allow insert for anyone (anon)
drop policy if exists "Anyone can insert contact message" on public.contact_messages;
create policy "Anyone can insert contact message"
  on public.contact_messages for insert
  with check (phone_number is not null and length(trim(phone_number)) > 0);

-- Trigger: create/update profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, student_number, phone_number, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'student_number',
    new.raw_user_meta_data->>'phone_number',
    new.email
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    student_number = excluded.student_number,
    phone_number = excluded.phone_number,
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Digital-Services
-- Initial database schema

create extension if not exists pgcrypto;

-- 1. User profiles
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text unique,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. Service catalog
create table if not exists public.services (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    platform text not null,
    category text not null,
    description text,
    active boolean not null default true,
    created_at timestamptz not null default now()
);

-- 3. Orders
create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    service_id uuid references public.services(id) on delete set null,
    status text not null default 'pending'
        check (status in ('pending', 'processing', 'completed', 'cancelled')),
    created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.orders enable row level security;

-- Users can read their own profile
create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Authenticated users can view active services
create policy "Authenticated users can view active services"
on public.services
for select
to authenticated
using (active = true);

-- Users can view only their own orders
create policy "Users can view their own orders"
on public.orders
for select
to authenticated
using (auth.uid() = user_id);

-- Users can create orders only for themselves
create policy "Users can create their own orders"
on public.orders
for insert
to authenticated
with check (auth.uid() = user_id);

-- Indexes for faster queries
create index if not exists orders_user_id_idx
on public.orders(user_id);

create index if not exists orders_created_at_idx
on public.orders(created_at desc);

create index if not exists services_active_idx
on public.services(active);

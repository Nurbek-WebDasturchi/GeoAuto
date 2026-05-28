create extension if not exists "uuid-ossp";
create extension if not exists cube;
create extension if not exists earthdistance;

create type user_role as enum ('USER', 'ADMIN');
create type listing_status as enum ('DRAFT', 'PENDING', 'ACTIVE', 'REJECTED', 'SOLD');
create type fuel_type as enum ('PETROL', 'GAS', 'HYBRID', 'ELECTRIC', 'DIESEL');
create type transmission_type as enum ('MANUAL', 'AUTOMATIC');
create type body_type as enum ('SEDAN', 'HATCHBACK', 'SUV', 'COUPE', 'WAGON', 'PICKUP', 'VAN', 'MINIVAN');

create table profiles (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  password_hash text not null,
  full_name text not null,
  phone text not null,
  avatar_url text,
  role user_role not null default 'USER',
  region text not null default 'Toshkent',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table listings (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  brand text not null,
  model text not null,
  year int not null check (year between 1970 and extract(year from now())::int + 1),
  price_usd int not null check (price_usd > 0),
  mileage_km int not null check (mileage_km >= 0),
  region text not null,
  district text not null,
  address text,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  fuel_type fuel_type not null,
  transmission transmission_type not null,
  body_type body_type not null,
  color text not null,
  engine_liters numeric(3,1),
  description text not null,
  is_premium boolean not null default false,
  is_top boolean not null default false,
  status listing_status not null default 'PENDING',
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table listing_images (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references listings(id) on delete cascade,
  url text not null,
  path text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table favorites (
  user_id uuid not null references profiles(id) on delete cascade,
  listing_id uuid not null references listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table recently_viewed (
  user_id uuid not null references profiles(id) on delete cascade,
  listing_id uuid not null references listings(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  listing_id uuid not null references listings(id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now()
);

create table conversations (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references listings(id) on delete cascade,
  buyer_id uuid not null references profiles(id) on delete cascade,
  seller_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (listing_id, buyer_id, seller_id)
);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index listings_search_idx on listings using gin (to_tsvector('simple', title || ' ' || brand || ' ' || model || ' ' || region));
create index listings_location_idx on listings using gist (ll_to_earth(latitude::float8, longitude::float8));
create index listings_filters_idx on listings (brand, model, region, fuel_type, transmission, body_type, price_usd, year, status);

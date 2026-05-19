
-- Catalog tables
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete cascade,
  slug text unique not null,
  name text not null,
  description text,
  moq int not null default 50,
  base_image_url text,
  mask_image_url text,
  print_area jsonb not null default '{"x":0.3,"y":0.4,"w":0.4,"h":0.2}'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  name text not null,
  description text,
  moq int not null default 50,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.colors (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  name text not null,
  hex text not null,
  swatch_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  min_qty int not null,
  max_qty int,
  unit_price_egp numeric(10,2) not null,
  currency text not null default 'EGP',
  created_at timestamptz not null default now()
);

create table public.preset_designs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null,
  category text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  phone text,
  category text,
  product_id uuid,
  color_id uuid,
  quantity int,
  design_url text,
  total_egp numeric(10,2),
  source text default 'whatsapp'
);

-- RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.variants enable row level security;
alter table public.colors enable row level security;
alter table public.prices enable row level security;
alter table public.preset_designs enable row level security;
alter table public.leads enable row level security;

create policy "Public read categories" on public.categories for select using (true);
create policy "Public read products" on public.products for select using (true);
create policy "Public read variants" on public.variants for select using (true);
create policy "Public read colors" on public.colors for select using (true);
create policy "Public read prices" on public.prices for select using (true);
create policy "Public read presets" on public.preset_designs for select using (true);
create policy "Anyone can insert leads" on public.leads for insert with check (true);

-- Storage buckets (public read)
insert into storage.buckets (id, name, public)
values
  ('products', 'products', true),
  ('presets', 'presets', true),
  ('logos', 'logos', true),
  ('client-logos', 'client-logos', true)
on conflict (id) do nothing;

create policy "Public read products bucket" on storage.objects for select using (bucket_id = 'products');
create policy "Public read presets bucket" on storage.objects for select using (bucket_id = 'presets');
create policy "Public read logos bucket" on storage.objects for select using (bucket_id = 'logos');
create policy "Public read client-logos bucket" on storage.objects for select using (bucket_id = 'client-logos');
create policy "Anyone can upload logos" on storage.objects for insert with check (bucket_id = 'logos');

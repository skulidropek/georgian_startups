create table if not exists public.startups (
  slug text primary key,
  startup_name text not null,
  tagline text not null,
  stage text not null check (
    stage in ('pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'exit')
  ),
  market text not null,
  industries text[] not null default '{}',
  about text not null,
  traction text not null,
  request text not null,
  needs text[] not null default '{}',
  website_url text,
  pitch_deck_url text not null,
  email text not null,
  created_at timestamptz not null default timezone('utc', now()),
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_by uuid references auth.users (id) on delete set null
);

create index if not exists startups_created_at_idx
  on public.startups (created_at desc);

create index if not exists startups_featured_idx
  on public.startups (is_featured, created_at desc);

alter table public.startups enable row level security;

drop policy if exists "Public startups are readable" on public.startups;
create policy "Public startups are readable"
  on public.startups
  for select
  using (is_published = true);

drop policy if exists "Authenticated users can insert their own startups" on public.startups;
create policy "Authenticated users can insert their own startups"
  on public.startups
  for insert
  to authenticated
  with check (auth.uid() = created_by);

drop policy if exists "Owners can update their own startups" on public.startups;
create policy "Owners can update their own startups"
  on public.startups
  for update
  to authenticated
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

drop policy if exists "Owners can delete their own startups" on public.startups;
create policy "Owners can delete their own startups"
  on public.startups
  for delete
  to authenticated
  using (auth.uid() = created_by);

insert into public.startups (
  slug,
  startup_name,
  tagline,
  stage,
  market,
  industries,
  about,
  traction,
  request,
  needs,
  website_url,
  pitch_deck_url,
  email,
  created_at,
  is_featured,
  is_published,
  created_by
) values
  (
    'atlasfreight',
    'AtlasFreight',
    'Freight visibility for Black Sea trade corridors.',
    'seed',
    'Logistics',
    array['supply chain', 'export', 'b2b saas'],
    'AtlasFreight helps exporters across Georgia coordinate port bookings, customs milestones, and invoice collections from a single dashboard.',
    'Piloting with 11 freight operators and two Tbilisi-based customs brokers, tracking more than $4.8M in annualized shipment volume.',
    'Looking for strategic capital and introductions to regional logistics groups expanding into the Caucasus.',
    array['Warm intros to port operators', 'Revenue-focused seed investors', 'Pricing feedback from freight forwarders'],
    'https://atlasfreight.example',
    'https://atlasfreight.example/deck',
    'hello@atlasfreight.example',
    '2026-03-28T10:00:00.000Z',
    true,
    true,
    null
  ),
  (
    'orchardos',
    'OrchardOS',
    'Farm operations software built for high-value orchards.',
    'pre-seed',
    'AgriTech',
    array['agritech', 'operations', 'climate'],
    'OrchardOS gives fruit producers task scheduling, irrigation logs, and crop-risk reporting tailored to Georgian orchards.',
    'Used by 23 farms this spring season with 87% weekly active managers and three paid pilots in Kakheti.',
    'Raising a pre-seed round to productize satellite-based yield forecasting and multilingual field workflows.',
    array['Pilot farms for pomegranate and hazelnut crops', 'Mentors in agri distribution', 'Design partner for forecasting UX'],
    'https://orchardos.example',
    'https://orchardos.example/deck',
    'team@orchardos.example',
    '2026-03-21T09:30:00.000Z',
    true,
    true,
    null
  ),
  (
    'clinicmesh',
    'ClinicMesh',
    'Care coordination for independent clinics and diagnostics labs.',
    'series-a',
    'HealthTech',
    array['healthtech', 'workflow', 'interop'],
    'ClinicMesh connects appointment intake, lab processing, and patient follow-up in one operational layer for private clinics.',
    'Processing 14,000 monthly visits across five clinics with signed expansion plans into two new diagnostic chains.',
    'Seeking growth capital and operators experienced in B2B healthcare sales across Eastern Europe.',
    array['Partnerships with diagnostics networks', 'Hiring pipeline for enterprise sales', 'Regulatory advisors for regional expansion'],
    'https://clinicmesh.example',
    'https://clinicmesh.example/deck',
    'contact@clinicmesh.example',
    '2026-02-14T14:15:00.000Z',
    false,
    true,
    null
  )
on conflict (slug) do nothing;

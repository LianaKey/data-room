create table datarooms (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default now()
);

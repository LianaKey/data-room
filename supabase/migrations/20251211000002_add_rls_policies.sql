-- Enable Row Level Security on datarooms table
alter table datarooms enable row level security;

-- Policy: Allow authenticated users to insert their own rooms
create policy "Users can create their own rooms"
on datarooms
for insert
to authenticated
with check (auth.uid() = user_id);

-- Policy: Allow authenticated users to select only their own rooms
create policy "Users can view their own rooms"
on datarooms
for select
to authenticated
using (auth.uid() = user_id);

-- Policy: Allow authenticated users to update their own rooms
create policy "Users can update their own rooms"
on datarooms
for update
to authenticated
using (auth.uid() = user_id);

-- Policy: Allow authenticated users to delete their own rooms
create policy "Users can delete their own rooms"
on datarooms
for delete
to authenticated
using (auth.uid() = user_id);

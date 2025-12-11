-- Add user_id column to datarooms table
alter table datarooms add column user_id uuid references auth.users(id) on delete cascade;

-- Set existing rooms to a default user (optional, or leave null)
-- update datarooms set user_id = (select id from auth.users limit 1) where user_id is null;

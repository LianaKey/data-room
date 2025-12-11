-- Update storage policies to be user-specific
-- Drop existing public policies
drop policy if exists "Allow anyone to upload images" on storage.objects;
drop policy if exists "Allow anyone to view images" on storage.objects;
drop policy if exists "Allow anyone to delete images" on storage.objects;

-- Create user-specific policies
-- Users can upload files to their own folder (path starts with their user_id)
create policy "Users can upload their own files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'userimages-prod' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can view their own files
create policy "Users can view their own files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'userimages-prod' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own files
create policy "Users can update their own files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'userimages-prod' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own files
create policy "Users can delete their own files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'userimages-prod' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

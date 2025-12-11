-- Create storage bucket for user images
insert into storage.buckets (id, name, public)
values ('userimages-prod', 'userimages-prod', true);

-- Set up storage policies for the bucket (allow anonymous access for now)
create policy "Allow anyone to upload images"
on storage.objects for insert
to public
with check (bucket_id = 'userimages-prod');

create policy "Allow anyone to view images"
on storage.objects for select
to public
using (bucket_id = 'userimages-prod');

create policy "Allow anyone to delete images"
on storage.objects for delete
to public
using (bucket_id = 'userimages-prod');

-- STEP 1: Add user_id column to datarooms table
ALTER TABLE datarooms ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- STEP 2: Update existing rooms to assign them to the first user (optional - or delete them)
-- Uncomment the next line if you want to assign existing rooms to a user:
-- UPDATE datarooms SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;

-- Or delete existing rooms without a user:
DELETE FROM datarooms WHERE user_id IS NULL;

-- STEP 3: Drop old RLS policies if they exist
DROP POLICY IF EXISTS "Authenticated users can create rooms" ON datarooms;
DROP POLICY IF EXISTS "Authenticated users can view all rooms" ON datarooms;
DROP POLICY IF EXISTS "Authenticated users can update rooms" ON datarooms;
DROP POLICY IF EXISTS "Authenticated users can delete rooms" ON datarooms;

-- STEP 4: Enable RLS on datarooms table
ALTER TABLE datarooms ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create new user-specific RLS policies for datarooms
CREATE POLICY "Users can create their own rooms"
ON datarooms
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own rooms"
ON datarooms
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own rooms"
ON datarooms
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rooms"
ON datarooms
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- STEP 6: Update storage policies
-- Drop old public storage policies
DROP POLICY IF EXISTS "Allow anyone to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anyone to view images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anyone to delete images" ON storage.objects;

-- Create user-specific storage policies
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'userimages-prod' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'userimages-prod' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'userimages-prod' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'userimages-prod' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

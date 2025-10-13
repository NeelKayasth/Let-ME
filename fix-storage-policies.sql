-- Fix Supabase Storage RLS Policies
-- Run this in Supabase SQL Editor to fix the storage upload issues

-- Drop existing policies that are too restrictive
DROP POLICY IF EXISTS "Allow authenticated users to upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update property images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete property images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload unit images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update unit images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete unit images" ON storage.objects;

-- Create simpler, more permissive policies for authenticated users
CREATE POLICY "Allow authenticated users to upload property images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to update property images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to delete property images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to upload unit images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'unit-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to update unit images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'unit-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to delete unit images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'unit-images' 
  AND auth.role() = 'authenticated'
);

-- Verify the policies were created
SELECT 'Storage policies updated successfully!' as status;

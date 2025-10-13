-- Supabase Storage Setup for Property Images
-- Run this in Supabase SQL Editor

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for unit images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('unit-images', 'unit-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for property images bucket
CREATE POLICY "Allow public read access to property images" ON storage.objects
FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Allow authenticated users to upload property images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'properties'
);

CREATE POLICY "Allow authenticated users to update property images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'properties'
);

CREATE POLICY "Allow authenticated users to delete property images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'properties'
);

-- Set up RLS policies for unit images bucket
CREATE POLICY "Allow public read access to unit images" ON storage.objects
FOR SELECT USING (bucket_id = 'unit-images');

CREATE POLICY "Allow authenticated users to upload unit images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'unit-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'units'
);

CREATE POLICY "Allow authenticated users to update unit images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'unit-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'units'
);

CREATE POLICY "Allow authenticated users to delete unit images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'unit-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'units'
);

-- Add image_url columns to existing tables if they don't exist
DO $$ 
BEGIN
    -- Add image_url to Properties table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Properties' AND column_name = 'image_url') THEN
        ALTER TABLE "Properties" ADD COLUMN "image_url" TEXT;
    END IF;
    
    -- Add image_url to Units table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Units' AND column_name = 'image_url') THEN
        ALTER TABLE "Units" ADD COLUMN "image_url" TEXT;
    END IF;
END $$;

-- Update existing properties with default image URLs (if they don't have images)
UPDATE "Properties" 
SET "image_url" = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center'
WHERE "image_url" IS NULL;

-- Update existing units with default image URLs (if they don't have images)
UPDATE "Units" 
SET "image_url" = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center'
WHERE "image_url" IS NULL;

-- Create function to get public URL for storage objects
CREATE OR REPLACE FUNCTION get_public_url(bucket_name TEXT, file_path TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN CONCAT('https://', current_setting('app.settings.supabase_url', true), '/storage/v1/object/public/', bucket_name, '/', file_path);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify setup
SELECT 'Storage setup completed successfully!' as status;
SELECT COUNT(*) as properties_with_images FROM "Properties" WHERE "image_url" IS NOT NULL;
SELECT COUNT(*) as units_with_images FROM "Units" WHERE "image_url" IS NOT NULL;

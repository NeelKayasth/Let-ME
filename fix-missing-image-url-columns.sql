-- Fix for missing image_url columns
-- Run this SQL in your Supabase SQL Editor

-- First, add the missing image_url columns to both tables
ALTER TABLE "Properties" ADD COLUMN IF NOT EXISTS "image_url" TEXT;
ALTER TABLE "Units" ADD COLUMN IF NOT EXISTS "image_url" TEXT;

-- Update existing properties with default image URLs (if they don't have images)
UPDATE "Properties" 
SET "image_url" = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center'
WHERE "image_url" IS NULL;

-- Update existing units with default image URLs (if they don't have images)
UPDATE "Units" 
SET "image_url" = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center'
WHERE "image_url" IS NULL;

-- Verify the columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Properties' AND column_name = 'image_url';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Units' AND column_name = 'image_url';

-- Verify the data was updated
SELECT COUNT(*) as properties_with_images FROM "Properties" WHERE "image_url" IS NOT NULL;
SELECT COUNT(*) as units_with_images FROM "Units" WHERE "image_url" IS NOT NULL;

-- Test query to make sure everything works
SELECT "PropertyID", "Properties", "image_url" FROM "Properties" LIMIT 3;
SELECT "UnitID", "UnitName", "image_url" FROM "Units" LIMIT 3;

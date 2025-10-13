-- Database Schema for LetMe.com
-- Based on the provided ERD and client requirements

-- Create Areas table
CREATE TABLE Areas (
    AreaID BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    AreaName VARCHAR(100) NOT NULL UNIQUE
);

-- Insert the 5 areas
INSERT INTO Areas (AreaName) VALUES 
('Bournemouth & Poole'),
('Christchurch'),
('Yeovil'),
('Weymouth'),
('Portsmouth');

-- Create Addresses table
CREATE TABLE addresses (
    AddressId BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    Address VARCHAR(500) NOT NULL
);

-- Insert sample addresses (you can add more as needed)
INSERT INTO addresses (Address) VALUES 
('123 Bournemouth Road, Bournemouth, BH1 1AA'),
('456 Poole Street, Poole, BH15 2BB'),
('789 Christchurch Avenue, Christchurch, BH23 3CC'),
('321 Yeovil Lane, Yeovil, BA20 4DD'),
('654 Weymouth Close, Weymouth, DT4 5EE'),
('987 Portsmouth Way, Portsmouth, PO1 6FF');

-- Create Properties table
CREATE TABLE Properties (
    PropertyID BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    Properties VARCHAR(200), -- Property name/identifier
    AreaID BIGINT NOT NULL REFERENCES Areas(AreaID),
    AddressID BIGINT NOT NULL REFERENCES addresses(AddressId),
    PlusCode VARCHAR(50) NOT NULL, -- Google Plus code for precise location
    Images TEXT, -- JSON array of image URLs (max 5 photos, JPG, max 2MB each)
    Description VARCHAR(500) -- Max 500 characters
);

-- Create Units table
CREATE TABLE Units (
    UnitID BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    PropertyID BIGINT NOT NULL REFERENCES Properties(PropertyID),
    UnitName VARCHAR(50) NOT NULL, -- Max 50 characters, alphanumeric
    MonthlyPrice DECIMAL(10,2) NOT NULL, -- Currency amount
    Available BOOLEAN NOT NULL DEFAULT true, -- Y/N field
    Images TEXT, -- JSON array of image URLs (max 5 photos, JPG, max 2MB each)
    Description VARCHAR(1000) -- Max 1000 characters
);

-- Create indexes for better performance
CREATE INDEX idx_properties_area ON Properties(AreaID);
CREATE INDEX idx_properties_address ON Properties(AddressID);
CREATE INDEX idx_units_property ON Units(PropertyID);
CREATE INDEX idx_units_available ON Units(Available);

-- Create admin users table for authentication
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: Admin users will be created through Supabase Auth dashboard
-- You can create an admin user by:
-- 1. Going to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" 
-- 3. Set email: admin@letme.com
-- 4. Set password: admin123 (or your preferred password)
-- 5. Then run this query to add them to admin_users table:
-- INSERT INTO admin_users (id, email) VALUES ('[USER_UUID_FROM_AUTH]', 'admin@letme.com');

-- Create applications table for storing rental applications
CREATE TABLE applications (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    property_name VARCHAR(200) NOT NULL,
    unit_name VARCHAR(50) NOT NULL,
    applicant_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    current_address TEXT NOT NULL,
    employment_status VARCHAR(50) NOT NULL,
    monthly_income DECIMAL(10,2) NOT NULL,
    application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending' -- pending, approved, rejected
);

-- Enable Row Level Security (RLS)
ALTER TABLE Areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE Properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE Units ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to main tables
CREATE POLICY "Allow public read access to Areas" ON Areas FOR SELECT USING (true);
CREATE POLICY "Allow public read access to addresses" ON addresses FOR SELECT USING (true);
CREATE POLICY "Allow public read access to Properties" ON Properties FOR SELECT USING (true);
CREATE POLICY "Allow public read access to Units" ON Units FOR SELECT USING (true);

-- Create policies for admin access
CREATE POLICY "Allow admin full access to Properties" ON Properties FOR ALL USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid()
    )
);

CREATE POLICY "Allow admin full access to Units" ON Units FOR ALL USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid()
    )
);

-- Allow public to insert applications
CREATE POLICY "Allow public to insert applications" ON applications FOR INSERT WITH CHECK (true);

-- Admin can read all applications
CREATE POLICY "Allow admin to read applications" ON applications FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid()
    )
);

-- Admin can update applications
CREATE POLICY "Allow admin to update applications" ON applications FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid()
    )
);

-- Admin can delete applications
CREATE POLICY "Allow admin to delete applications" ON applications FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid()
    )
);

-- Allow authenticated users to add themselves to admin_users table
CREATE POLICY "Allow users to add themselves as admin" ON admin_users FOR INSERT WITH CHECK (
    auth.uid() = id
);

-- Allow users to read their own admin status
CREATE POLICY "Allow users to read their own admin status" ON admin_users FOR SELECT USING (
    auth.uid() = id
);

-- Insert sample properties
INSERT INTO Properties (Properties, AreaID, AddressID, PlusCode, Images, Description) VALUES 
('St John''s Court', 1, 1, 'JG5W+PG Bournemouth', '["property1-1.jpg", "property1-2.jpg"]', 'Modern apartment complex in the heart of Bournemouth with excellent transport links.'),
('Poole Marina Apartments', 1, 2, 'JG5W+QH Poole', '["property2-1.jpg", "property2-2.jpg"]', 'Luxury apartments overlooking Poole Harbour with stunning sea views.'),
('Christchurch Gardens', 2, 3, 'JG5W+RJ Christchurch', '["property3-1.jpg", "property3-2.jpg"]', 'Beautiful period property converted into modern apartments near the town center.'),
('Yeovil Heights', 3, 4, 'JG5W+SK Yeovil', '["property4-1.jpg", "property4-2.jpg"]', 'Contemporary development with excellent amenities and parking facilities.'),
('Weymouth Seafront', 4, 5, 'JG5W+TL Weymouth', '["property5-1.jpg", "property5-2.jpg"]', 'Seaside apartments with direct beach access and panoramic sea views.'),
('Portsmouth Historic Quarter', 5, 6, 'JG5W+UM Portsmouth', '["property6-1.jpg", "property6-2.jpg"]', 'Characterful apartments in the historic heart of Portsmouth.');

-- Insert sample units
INSERT INTO Units (PropertyID, UnitName, MonthlyPrice, Available, Images, Description) VALUES 
-- St John's Court units
(1, 'Flat 1', 650.00, true, '["unit1-1.jpg", "unit1-2.jpg"]', 'Spacious 1-bedroom flat with modern kitchen and bathroom.'),
(1, 'Flat 2', 700.00, true, '["unit2-1.jpg", "unit2-2.jpg"]', 'Large 1-bedroom flat with balcony and sea views.'),
(1, 'Flat 3', 750.00, false, '["unit3-1.jpg", "unit3-2.jpg"]', 'Premium 2-bedroom flat with en-suite bathroom.'),
-- Poole Marina units
(2, 'Apartment A', 850.00, true, '["unit4-1.jpg", "unit4-2.jpg"]', 'Luxury 1-bedroom apartment with marina views.'),
(2, 'Apartment B', 900.00, true, '["unit5-1.jpg", "unit5-2.jpg"]', 'Premium 2-bedroom apartment with private balcony.'),
-- Christchurch Gardens units
(3, 'Garden Flat', 600.00, true, '["unit6-1.jpg", "unit6-2.jpg"]', 'Charming ground floor flat with private garden access.'),
(3, 'Top Floor Flat', 650.00, true, '["unit7-1.jpg", "unit7-2.jpg"]', 'Bright top floor flat with excellent natural light.'),
-- Yeovil Heights units
(4, 'Studio 1', 550.00, true, '["unit8-1.jpg", "unit8-2.jpg"]', 'Modern studio apartment with all amenities included.'),
(4, 'Studio 2', 580.00, true, '["unit9-1.jpg", "unit9-2.jpg"]', 'Contemporary studio with built-in storage solutions.'),
-- Weymouth Seafront units
(5, 'Seaside Studio', 700.00, true, '["unit10-1.jpg", "unit10-2.jpg"]', 'Beautiful studio with direct sea views and beach access.'),
(5, 'Ocean View Flat', 800.00, true, '["unit11-1.jpg", "unit11-2.jpg"]', 'Stunning 1-bedroom flat with panoramic ocean views.'),
-- Portsmouth Historic Quarter units
(6, 'Historic Apartment', 650.00, true, '["unit12-1.jpg", "unit12-2.jpg"]', 'Characterful apartment in historic building with modern amenities.'),
(6, 'City Center Flat', 600.00, true, '["unit13-1.jpg", "unit13-2.jpg"]', 'Convenient flat in the heart of Portsmouth with excellent transport links.');

-- Function to help add admin users (run this after creating a user in Supabase Auth)
CREATE OR REPLACE FUNCTION add_admin_user(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get the user UUID from auth.users
    SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
    
    IF user_uuid IS NULL THEN
        RETURN 'User not found in auth.users. Please create the user in Supabase Auth first.';
    END IF;
    
    -- Insert into admin_users table
    INSERT INTO admin_users (id, email) VALUES (user_uuid, user_email);
    
    RETURN 'Admin user added successfully: ' || user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Instructions for setting up admin user:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" and create user with email: admin@letme.com
-- 3. Copy the user UUID from the created user
-- 4. Run: SELECT add_admin_user('admin@letme.com');
-- OR manually insert: INSERT INTO admin_users (id, email) VALUES ('[USER_UUID]', 'admin@letme.com');

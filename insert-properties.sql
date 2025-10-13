-- Insert Properties for LetMe.com
-- This script inserts the provided properties into the database

-- First, ensure we have the required areas
INSERT INTO "Areas" ("AreaName") 
VALUES 
    ('Bournemouth & Poole'),
    ('Weymouth'),
    ('Yeovil')
ON CONFLICT ("AreaName") DO NOTHING;

-- Insert addresses for all properties
INSERT INTO addresses ("Address") VALUES
    ('Frances Road, BH1'),
    ('Old Christchurch Road, BH1'),
    ('Christchurch Road, BH1'),
    ('Victoria Park Road, BH9'),
    ('Herbert Avenue Poole, BH12'),
    ('Sunnyside Road, BH12'),
    ('34 Purbeck Road, BH2'),
    ('Westover Road, BH1'),
    ('130 Alma Road, BH9'),
    ('Campbell Road, BH1'),
    ('St Johns Road, BH5'),
    ('Gardens View, BH1'),
    ('Maiden Street, DT4'),
    ('New Street, DT4'),
    ('Elmes Road, BH9 2SZ'),
    ('Hinton Road, BH1 2EN'),
    ('Sherborne Road, BA21'),
    ('East Street Crewkerne, TA18'),
    ('St Michaels Avenue, BA21'),
    ('84 Crofton Park, BA21'),
    ('Crofton Avenue, BA21'),
    ('Goldcroft, BA21'),
    ('Higher Kingston, BA21'),
    ('Preston Road Yeovil, BA20'),
    ('96 Crofton Park, BA21'),
    ('Bournemouth Road, BH14'),
    ('South Street, BA20'),
    ('St Michaels Road, BH2'),
    ('Alderney Ave, BH12'),
    ('West Hill Road, BH2'),
    ('Palmerston Road, BH1');

-- Insert properties with their area and address relationships
INSERT INTO "Properties" ("Properties", "AreaID", "AddressID", "PlusCode", "Description") VALUES
    ('Frances Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Frances Road, BH1'), '9C4X+XF Bournemouth', 'Modern property on Frances Road in Bournemouth'),
    ('Old Christchurch Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Old Christchurch Road, BH1'), '9C4X+XX Bournemouth', 'Contemporary living on Old Christchurch Road'),
    ('Christchurch Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Christchurch Road, BH1'), '9C4X+XY Bournemouth', 'Prime location on Christchurch Road'),
    ('Victoria Park Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Victoria Park Road, BH9'), '9C4X+XZ Bournemouth', 'Beautiful property near Victoria Park'),
    ('Herbert Avenue Poole Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Herbert Avenue Poole, BH12'), '9C4X+YA Poole', 'Spacious property on Herbert Avenue'),
    ('Sunnyside Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Sunnyside Road, BH12'), '9C4X+YB Poole', 'Bright and airy property on Sunnyside Road'),
    ('Purbeck Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = '34 Purbeck Road, BH2'), '9C4X+YC Bournemouth', 'Modern residence on Purbeck Road'),
    ('Westover Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Westover Road, BH1'), '9C4X+YD Bournemouth', 'Central location on Westover Road'),
    ('Alma Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = '130 Alma Road, BH9'), '9C4X+YE Bournemouth', 'Comfortable living on Alma Road'),
    ('Campbell Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Campbell Road, BH1'), '9C4X+YF Bournemouth', 'Residential property on Campbell Road'),
    ('St Johns Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'St Johns Road, BH5'), '9C4X+YG Bournemouth', 'Well-located property on St Johns Road'),
    ('Gardens View Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Gardens View, BH1'), '9C4X+YH Bournemouth', 'Property with garden views'),
    ('Maiden Street Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Weymouth'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Maiden Street, DT4'), '9C4X+YI Weymouth', 'Charming property on Maiden Street'),
    ('New Street Weymouth Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Weymouth'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'New Street, DT4'), '9C4X+YJ Weymouth', 'Contemporary living on New Street'),
    ('Elmes Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Elmes Road, BH9 2SZ'), '9C4X+YK Bournemouth', 'Modern property on Elmes Road'),
    ('Hinton Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Hinton Road, BH1 2EN'), '9C4X+YL Bournemouth', 'Residential property on Hinton Road'),
    ('Sherborne Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Yeovil'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Sherborne Road, BA21'), '9C4X+YM Yeovil', 'Property on Sherborne Road in Yeovil'),
    ('East Street Crewkerne Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Yeovil'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'East Street Crewkerne, TA18'), '9C4X+YN Crewkerne', 'Property on East Street in Crewkerne'),
    ('St Michaels Avenue Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Yeovil'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'St Michaels Avenue, BA21'), '9C4X+YO Yeovil', 'Property on St Michaels Avenue'),
    ('Crofton Park Property 1', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Yeovil'), (SELECT "AddressId" FROM addresses WHERE "Address" = '84 Crofton Park, BA21'), '9C4X+YP Yeovil', 'Property on Crofton Park'),
    ('Crofton Avenue Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Yeovil'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Crofton Avenue, BA21'), '9C4X+YQ Yeovil', 'Modern living on Crofton Avenue'),
    ('Goldcroft Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Yeovil'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Goldcroft, BA21'), '9C4X+YR Yeovil', 'Property on Goldcroft'),
    ('Higher Kingston Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Yeovil'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Higher Kingston, BA21'), '9C4X+YS Yeovil', 'Property on Higher Kingston'),
    ('Preston Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Yeovil'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Preston Road Yeovil, BA20'), '9C4X+YT Yeovil', 'Property on Preston Road'),
    ('Crofton Park Property 2', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Yeovil'), (SELECT "AddressId" FROM addresses WHERE "Address" = '96 Crofton Park, BA21'), '9C4X+YU Yeovil', 'Another property on Crofton Park'),
    ('Bournemouth Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Bournemouth Road, BH14'), '9C4X+YV Poole', 'Property on Bournemouth Road'),
    ('South Street Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Yeovil'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'South Street, BA20'), '9C4X+YW Yeovil', 'Property on South Street'),
    ('St Michaels Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'St Michaels Road, BH2'), '9C4X+YX Bournemouth', 'Property on St Michaels Road'),
    ('Alderney Avenue Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Alderney Ave, BH12'), '9C4X+YY Poole', 'Property on Alderney Avenue'),
    ('West Hill Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'West Hill Road, BH2'), '9C4X+YZ Bournemouth', 'Property on West Hill Road'),
    ('Palmerston Road Property', (SELECT "AreaID" FROM "Areas" WHERE "AreaName" = 'Bournemouth & Poole'), (SELECT "AddressId" FROM addresses WHERE "Address" = 'Palmerston Road, BH1'), '9C4X+ZA Bournemouth', 'Property on Palmerston Road');

-- Add default image_url for all properties if the column exists
UPDATE "Properties" 
SET "image_url" = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center'
WHERE "image_url" IS NULL;

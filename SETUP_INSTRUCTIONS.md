# LetMe.com Setup Instructions

## Overview
This is a complete property rental website built with React, TypeScript, and Supabase. The website includes:

- **Home Page**: Static page with pictures, text and links to other pages
- **Area Pages**: Individual pages for each location (Bournemouth & Poole, Christchurch, Yeovil, Weymouth, Portsmouth)
- **Property Pages**: 31 individual property pages with dynamic routing
- **Unit Pages**: ~300 individual unit pages with dynamic routing
- **Application Form**: "Check whether you qualify" form with email functionality
- **Admin Panel**: Full CRUD operations for properties and units
- **Contact Page**: Contact information and form
- **Make Payment Page**: Static page for rent payments

## Database Schema

The database includes the following tables:

### Areas Table
- AreaID (Primary Key)
- AreaName (Bournemouth & Poole, Christchurch, Yeovil, Weymouth, Portsmouth)

### Addresses Table
- AddressId (Primary Key)
- Address (Property addresses)

### Properties Table
- PropertyID (Primary Key)
- Properties (Property name)
- AreaID (Foreign Key to Areas)
- AddressID (Foreign Key to Addresses)
- PlusCode (Google Plus code)
- Images (JSON array of image URLs)
- Description (Max 500 characters)

### Units Table
- UnitID (Primary Key)
- PropertyID (Foreign Key to Properties)
- UnitName (Max 50 characters)
- MonthlyPrice (Currency amount)
- Available (Boolean)
- Images (JSON array of image URLs)
- Description (Max 1000 characters)

### Applications Table
- id (Primary Key)
- property_name
- unit_name
- applicant_name
- email
- phone
- date_of_birth
- current_address
- employment_status
- monthly_income
- application_date
- status

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup
1. Create a new Supabase project
2. Run the SQL commands from `database-schema.sql` in the Supabase SQL editor
3. This will create all necessary tables, indexes, and policies

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

## Features Implemented

### ✅ Completed Features
- [x] Supabase integration for authentication and database
- [x] Database schema with proper relationships
- [x] Updated navigation to match client requirements
- [x] Individual area pages (5 locations)
- [x] Dynamic property pages (31 properties)
- [x] Dynamic unit pages (~300 units)
- [x] Application form with database storage
- [x] Admin panel with authentication and CRUD operations
- [x] Static home page with pictures and links
- [x] Static Make Payment page
- [x] Contact page with information and form
- [x] Robots.txt to prevent admin page indexing

### 🔄 Next Steps
- [ ] Populate database with real property data
- [ ] Implement email service for application notifications
- [ ] Add property and unit images
- [ ] Configure email templates
- [ ] Set up production deployment

## Admin Panel Access

The admin panel is accessible at `/admin` with the following default credentials:
- Email: admin@letme.com
- Password: admin123

**Important**: Change the default password in production!

## Application Form

The application form sends data to:
1. Database (applications table)
2. Email to apply@letme.com (needs email service implementation)
3. Confirmation email to applicant (needs email service implementation)

## File Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   ├── Index.tsx       # Home page
│   ├── ContactPage.tsx # Contact page
│   ├── MakePaymentPage.tsx # Payment page
│   ├── [Area]Page.tsx  # Area pages
│   ├── PropertyPage.tsx # Individual property pages
│   ├── UnitPage.tsx    # Individual unit pages
│   ├── ApplicationPage.tsx # Application form
│   └── AdminPage.tsx   # Admin panel
├── lib/
│   └── supabase.ts     # Supabase configuration
└── hooks/              # Custom React hooks
```

## Database Queries

### Get Properties by Area
```sql
SELECT p.*, a.AreaName, addr.Address 
FROM Properties p
JOIN Areas a ON p.AreaID = a.AreaID
JOIN addresses addr ON p.AddressID = addr.AddressId
WHERE p.AreaID = 1; -- Bournemouth & Poole
```

### Get Units by Property
```sql
SELECT u.*, p.Properties
FROM Units u
JOIN Properties p ON u.PropertyID = p.PropertyID
WHERE u.PropertyID = 1 AND u.Available = true;
```

### Get Application Data
```sql
SELECT * FROM applications 
WHERE status = 'pending'
ORDER BY application_date DESC;
```

## Security Features

- Row Level Security (RLS) enabled on all tables
- Public read access for main data
- Admin-only access for CRUD operations
- Admin panel protected by authentication
- Robots.txt prevents admin page indexing

## Contact Information

For support or questions about this implementation, please refer to the contact information in the Contact page or reach out to the development team.

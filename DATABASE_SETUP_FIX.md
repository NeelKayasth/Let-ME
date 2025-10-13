# Database Setup Fix - Step by Step

## 🚨 **THE PROBLEM**
The error "Could not find the table 'public.Units' in the schema cache" means the database tables haven't been created yet in your Supabase project.

## ✅ **THE SOLUTION**

### **Step 1: Go to Supabase Dashboard**
1. Open your Supabase project dashboard
2. Go to **SQL Editor** (in the left sidebar)

### **Step 2: Run the Complete Database Schema**
1. Copy the **entire contents** of `database-schema.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** button

### **Step 3: Verify Tables Are Created**
After running the SQL, you should see these tables in your **Table Editor**:
- ✅ `Areas` (5 rows)
- ✅ `addresses` (6 rows) 
- ✅ `Properties` (6 rows)
- ✅ `Units` (13 rows)
- ✅ `admin_users` (empty initially)
- ✅ `applications` (empty initially)

### **Step 4: Test Admin Panel**
1. Go to `/admin` in your website
2. Sign in with `admin@letme.com` / `admin123`
3. You should now see the admin panel with data!

## 🔧 **If You Get Errors**

### **Error: "relation already exists"**
This means some tables already exist. Run this to clean up first:
```sql
-- Drop existing tables (if any)
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS Units CASCADE;
DROP TABLE IF EXISTS Properties CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS Areas CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
```

Then run the full `database-schema.sql` again.

### **Error: "permission denied"**
Make sure you're running the SQL as the project owner/admin.

### **Error: "function does not exist"**
This might be a Supabase version issue. Try this alternative for the admin function:
```sql
-- Alternative admin function (if the first one fails)
CREATE OR REPLACE FUNCTION add_admin_user(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    user_uuid UUID;
BEGIN
    SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
    
    IF user_uuid IS NULL THEN
        RETURN 'User not found in auth.users. Please create the user in Supabase Auth first.';
    END IF;
    
    INSERT INTO admin_users (id, email) VALUES (user_uuid, user_email);
    RETURN 'Admin user added successfully: ' || user_email;
END;
$$ LANGUAGE plpgsql;
```

## 📋 **Quick Test Commands**

After setting up the database, test with these queries:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check if data was inserted
SELECT COUNT(*) FROM Areas;
SELECT COUNT(*) FROM Properties;
SELECT COUNT(*) FROM Units;

-- Check admin users
SELECT * FROM admin_users;
```

## 🎯 **Expected Results**

After successful setup:
- **Areas**: 5 rows (Bournemouth & Poole, Christchurch, etc.)
- **Properties**: 6 rows (St John's Court, Poole Marina, etc.)
- **Units**: 13 rows (various flats and apartments)
- **Admin Panel**: Should load with data and no errors

## 🚀 **Next Steps**

1. **Run the database schema** (Step 2 above)
2. **Test the admin panel** (Step 4 above)
3. **If still having issues**, check the browser console for specific error messages
4. **Verify in Supabase Table Editor** that all tables and data are present

The admin panel should work perfectly once the database is properly set up!

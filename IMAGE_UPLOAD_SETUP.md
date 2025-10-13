# Image Upload Feature Setup Guide

## 🎯 **FEATURE OVERVIEW**

This implementation adds comprehensive image upload functionality to the admin panel with:
- ✅ **Drag & drop image upload** with preview
- ✅ **Automatic image optimization** (resize & compress)
- ✅ **Supabase Storage integration** for secure file storage
- ✅ **Default image fallbacks** for existing properties/units
- ✅ **Client-side validation** (file type, size)
- ✅ **Error handling** with user-friendly messages

## 🚀 **SETUP INSTRUCTIONS**

### **Step 1: Set Up Supabase Storage**

1. Go to **Supabase Dashboard** > **SQL Editor**
2. Run the **complete** `supabase-storage-setup.sql` file
3. This will:
   - Create `property-images` and `unit-images` storage buckets
   - Set up RLS policies for secure access
   - Add `image_url` columns to existing tables
   - Update existing records with default images

### **Step 2: Verify Storage Buckets**

After running the SQL, check:
1. Go to **Storage** in Supabase Dashboard
2. You should see two buckets:
   - ✅ `property-images` (public)
   - ✅ `unit-images` (public)

### **Step 3: Test the Feature**

1. Go to `/admin` and sign in
2. Click **"Add New Property"**
3. You should see the new **Image Upload** component
4. Test uploading an image:
   - Drag & drop or click to select
   - See preview before submission
   - Upload and verify it appears in the property list

## 🎨 **FEATURES IMPLEMENTED**

### **1. Image Upload Component**
- **Drag & drop interface** with visual feedback
- **File validation** (JPEG, PNG, WEBP, max 5MB)
- **Image preview** before upload
- **Automatic optimization** (resize to 800x600, compress)
- **Remove functionality** with confirmation

### **2. Admin Panel Integration**
- **Property form** includes image upload
- **Unit form** includes image upload
- **Property/Unit listings** show images with fallbacks
- **Loading states** during upload
- **Error handling** with retry options

### **3. Default Image System**
- **High-quality default images** from Unsplash
- **Automatic fallback** for properties/units without images
- **Consistent styling** across all listings
- **No broken image placeholders**

### **4. Supabase Storage**
- **Secure file storage** with RLS policies
- **Public URLs** for easy access
- **Organized folder structure** (properties/, units/)
- **Unique filenames** to prevent conflicts

## 🔧 **TECHNICAL DETAILS**

### **File Structure**
```
src/
├── components/
│   └── ImageUpload.tsx          # Reusable upload component
├── lib/
│   ├── imageUtils.ts            # Image processing utilities
│   └── supabase.ts              # Updated with image_url fields
└── pages/
    └── AdminPage.tsx            # Updated with upload functionality
```

### **Database Changes**
- Added `image_url` column to `Properties` table
- Added `image_url` column to `Units` table
- Updated existing records with default images

### **Storage Structure**
```
property-images/
├── properties/
│   ├── property_1234567890_abc123.jpg
│   └── property_1234567891_def456.jpg
└── ...

unit-images/
├── units/
│   ├── unit_1234567890_xyz789.jpg
│   └── unit_1234567891_uvw012.jpg
└── ...
```

## 🎯 **USAGE GUIDE**

### **For Admins**

#### **Adding Properties with Images**
1. Click **"Add New Property"**
2. Fill in property details
3. **Upload image** using the drag & drop area
4. See **preview** before submitting
5. Click **"Add Property"** to save

#### **Adding Units with Images**
1. Click **"Add Unit"**
2. Fill in unit details
3. **Upload image** using the drag & drop area
4. See **preview** before submitting
5. Click **"Add Unit"** to save

### **For Users**
- **All property/unit listings** now show images
- **Default images** appear for items without uploaded images
- **Consistent visual experience** across the site

## 🔍 **TROUBLESHOOTING**

### **Common Issues**

#### **"Storage bucket not found"**
- Run the `supabase-storage-setup.sql` file
- Check Storage section in Supabase Dashboard

#### **"Permission denied"**
- Verify RLS policies are set up correctly
- Check that user is authenticated

#### **"Image upload failed"**
- Check file size (max 5MB)
- Verify file type (JPEG, PNG, WEBP)
- Check browser console for specific errors

#### **"Default images not showing"**
- Verify `image_url` columns exist in database
- Check that default image URLs are accessible
- Run the storage setup SQL again

### **Debug Steps**
1. **Check browser console** for error messages
2. **Verify storage buckets** exist in Supabase
3. **Test with small image** (under 1MB)
4. **Check network tab** for failed requests

## 🎉 **EXPECTED RESULTS**

After setup:
- ✅ **Admin panel** has image upload functionality
- ✅ **Property/unit listings** show images with fallbacks
- ✅ **Drag & drop** works smoothly
- ✅ **Image optimization** reduces file sizes
- ✅ **Default images** appear for existing items
- ✅ **No broken images** anywhere on the site

## 🚀 **NEXT STEPS**

The image upload system is now fully functional! You can:
1. **Upload images** for new properties and units
2. **View images** in the admin panel listings
3. **See default images** for existing items
4. **Scale the system** as you add more content

The feature is **production-ready** and includes all the requirements you specified!

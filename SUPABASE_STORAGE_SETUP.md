# 📁 Supabase Storage Setup for AKAZUBA FLORIST

This guide will help you set up Supabase storage for product images.

## 🚀 **Step 1: Create Storage Bucket**

1. **Go to your Supabase Dashboard**
2. **Navigate to "Storage"** in the left sidebar
3. **Click "Create a new bucket"**
4. **Configure the bucket**:
   - **Name**: `product-images`
   - **Public**: ✅ **Check this box** (important for public access)
   - **File size limit**: `10 MB` (or your preference)
   - **Allowed MIME types**: `image/*` (or specific types like `image/jpeg,image/png,image/webp`)

## 🔧 **Step 2: Set Up Bucket Policies**

1. **Go to "Policies" tab** in the Storage section
2. **Click "New Policy"**
3. **Create these policies**:

### **Policy 1: Allow Public Read Access**
```sql
CREATE POLICY "Public read access for product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
```

### **Policy 2: Allow Authenticated Users to Upload**
```sql
CREATE POLICY "Authenticated users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

### **Policy 3: Allow Authenticated Users to Update**
```sql
CREATE POLICY "Authenticated users can update product images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

### **Policy 4: Allow Authenticated Users to Delete**
```sql
CREATE POLICY "Authenticated users can delete product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

## 🎯 **Step 3: Test the Setup**

1. **Go to your admin dashboard**
2. **Try adding a new product with an image**
3. **Check if the image uploads successfully**
4. **Verify the image appears in the product list**

## 🔍 **Troubleshooting**

### **If images still don't show:**

1. **Check browser console** for error messages
2. **Verify bucket is public** in Supabase dashboard
3. **Check bucket policies** are correctly set
4. **Ensure file size** is under the limit
5. **Check file format** is supported (jpg, png, webp, etc.)

### **Common Issues:**

- **Bucket not public**: Images won't be accessible
- **Missing policies**: Upload/access will fail
- **File too large**: Upload will be rejected
- **Unsupported format**: Upload will fail

## 📋 **Quick Checklist:**

- [ ] Storage bucket `product-images` created
- [ ] Bucket is set to **public**
- [ ] All 4 policies are created
- [ ] Test upload works
- [ ] Images display in product list

## 🎨 **Fallback Images**

If storage setup fails, the system will automatically use placeholder images:
- **URL**: `https://via.placeholder.com/300x300/16a34a/ffffff?text=No+Image`
- **Color**: Green background with white text
- **Size**: 300x300 pixels

---

**Once storage is set up, your product images will upload and display correctly!** 🌸

# 🌸 Product Import Guide - Akazuba Florist

## 🎯 **Complete Product Import System Ready!**

I've created a comprehensive system for you to add all your products and videos to the site. Here's everything you need to know:

## 📋 **What's Been Added**

### ✅ **1. Enhanced Database Schema**
- **Video Support**: Added `videos` field to store video URLs
- **Enhanced Product Fields**: Added `color`, `brand`, `type`, `size`, `concentration`
- **Backward Compatible**: All existing products will continue to work

### ✅ **2. Admin Import Interface**
- **Location**: `/admin/import` (accessible from admin navbar)
- **Three Import Methods**:
  - 📄 **CSV Upload**: Upload a CSV file with your product data
  - 📋 **JSON Upload**: Upload a JSON file with your product data
  - ✋ **Manual Entry**: Add products one by one through a form

### ✅ **3. Enhanced Product Display**
- **Video Support**: Products can now display videos with play buttons
- **Image Galleries**: Multiple images with navigation dots
- **Video/Image Toggle**: Switch between images and videos
- **Better Descriptions**: Enhanced product descriptions with more detail

## 🚀 **How to Add Your Products**

### **Method 1: CSV Import (Recommended for Bulk)**

1. **Download the template**: Click "Download Template" on the import page
2. **Fill in your data** using the CSV template structure:
   ```csv
   name,price,description,category,color,type,images,videos
   Red Rose,45500,"Beautiful red rose perfect for any occasion",flowers,red,Rose,"/images/flowers/red-1.jpg|/images/flowers/red-2.jpg","/videos/red-rose-demo.mp4"
   ```

3. **Upload your CSV file** through the admin interface
4. **Preview and import** your products

### **Method 2: JSON Import**

1. **Use the JSON template** structure:
   ```json
   [
     {
       "name": "Red Rose",
       "price": 45500,
       "description": "Beautiful red rose perfect for any occasion",
       "category": "flowers",
       "color": "red",
       "type": "Rose",
       "images": ["/images/flowers/red-1.jpg", "/images/flowers/red-2.jpg"],
       "videos": ["/videos/red-rose-demo.mp4"]
     }
   ]
   ```

### **Method 3: Manual Entry**

1. **Go to** `/admin/import`
2. **Select "Manual Entry"**
3. **Fill in the form** for each product
4. **Add to preview** and then import

## 📁 **Where to Put Your Files**

### **Images**
- **Location**: `public/images/` directory
- **Structure**: Organize by category (e.g., `public/images/flowers/`, `public/images/perfumes/`)
- **Supported formats**: JPG, PNG, GIF, WebP
- **Recommended size**: 800x600px or larger

### **Videos**
- **Location**: `public/videos/` directory
- **Structure**: Organize by category (e.g., `public/videos/flowers/`, `public/videos/perfumes/`)
- **Supported formats**: MP4, WebM, OGG
- **Recommended size**: Keep under 50MB for web performance

## 📊 **Sample Data Structure**

### **CSV Format**
```csv
name,price,description,category,color,type,images,videos
Red Rose,45500,"Beautiful red rose perfect for any occasion. Freshly cut and carefully arranged by our expert florists.",flowers,red,Rose,"/images/flowers/red/red-1.jpg|/images/flowers/red/red-2.jpg","/videos/red-rose-demo.mp4"
White Lily,39000,"Elegant white lily for special moments. Symbol of purity and beauty.",flowers,white,Lily,"/images/flowers/white/white-1.jpg","/videos/white-lily-demo.mp4"
```

### **JSON Format**
```json
[
  {
    "name": "Red Rose",
    "price": 45500,
    "description": "Beautiful red rose perfect for any occasion. Freshly cut and carefully arranged by our expert florists.",
    "category": "flowers",
    "color": "red",
    "type": "Rose",
    "images": [
      "/images/flowers/red/red-1.jpg",
      "/images/flowers/red/red-2.jpg"
    ],
    "videos": [
      "/videos/red-rose-demo.mp4"
    ]
  }
]
```

## 🏷️ **Field Descriptions**

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `name` | ✅ | Product name | "Red Rose" |
| `price` | ✅ | Price in RWF | 45500 |
| `description` | ✅ | Detailed description | "Beautiful red rose..." |
| `category` | ✅ | Product category | "flowers", "perfumes", "wedding" |
| `color` | ❌ | Product color | "red", "white", "pink" |
| `type` | ❌ | Product type | "Rose", "Lily", "Perfume" |
| `images` | ❌ | Image URLs (separated by \|) | "/img1.jpg\|/img2.jpg" |
| `videos` | ❌ | Video URLs (separated by \|) | "/vid1.mp4\|/vid2.mp4" |

## 🎬 **Video Features**

### **Product Cards**
- **Play Button**: Click to switch between images and videos
- **Video Controls**: Full video player controls
- **Fallback**: If video fails to load, automatically shows images

### **Admin Management**
- **Video Upload**: Support for video file uploads
- **Video Preview**: Preview videos in admin interface
- **Video Management**: Edit and manage video URLs

## 📱 **Customer Experience**

### **Enhanced Product Display**
- **Multiple Images**: Swipe through product images
- **Video Demos**: Watch product videos directly
- **Better Descriptions**: More detailed product information
- **Improved Navigation**: Easy switching between media types

## 🔧 **Technical Details**

### **Database Changes**
- Added `videos` JSON field to products table
- Added `color`, `brand`, `type`, `size`, `concentration` fields
- Backward compatible with existing data

### **API Endpoints**
- `POST /api/admin/products/import` - Import products
- `GET /api/admin/products/import` - Get import templates
- Enhanced product creation with video support

### **File Structure**
```
public/
├── images/
│   ├── flowers/
│   ├── perfumes/
│   ├── wedding/
│   └── ...
└── videos/
    ├── flowers/
    ├── perfumes/
    └── ...
```

## 🚀 **Next Steps**

1. **Prepare Your Data**: Organize your product information
2. **Upload Media**: Place images and videos in the correct directories
3. **Use Import System**: Choose your preferred import method
4. **Test Display**: Check how products look on the customer side
5. **Refine**: Make adjustments as needed

## 📞 **Need Help?**

The system is designed to be user-friendly, but if you need assistance:
- Check the import preview before finalizing
- Use the template files as guides
- Start with a small batch to test the system
- All imports are logged with detailed success/error messages

## 🎉 **Ready to Go!**

Your product import system is fully functional and ready to handle all your products and videos. The enhanced display will give your customers a much better shopping experience with rich media content!

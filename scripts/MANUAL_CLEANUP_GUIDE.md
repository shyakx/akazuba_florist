
🗑️ MANUAL DATABASE CLEANUP GUIDE

If the automated cleanup doesn't work, here are manual options:

1. ADMIN PANEL METHOD:
   - Go to your admin panel (/admin)
   - Navigate to Products section
   - Select all products and delete them
   - Or delete them one by one

2. DATABASE DIRECT METHOD:
   - Access your database directly (PostgreSQL)
   - Run: DELETE FROM "Product";
   - Run: DELETE FROM "Category" WHERE name IN ('flowers', 'birthday', 'valentine', etc.);
   - Restart your application

3. BACKEND API METHOD:
   - Use Postman or similar tool
   - GET /api/admin/products (with admin auth)
   - For each product, DELETE /api/admin/products/{id}

4. DEVELOPMENT RESET:
   - If using Prisma: npx prisma db push --force-reset
   - This will recreate the entire database (DESTRUCTIVE!)

⚠️  IMPORTANT:
- Make sure you're in development mode
- Backup your database if you have important data
- Only run this if you're sure you want to delete all products

✅ AFTER CLEANUP:
- Import using: data/products-with-mapped-categories.json
- This file has proper categories that match your UI
- Products will appear in correct categories on customer side

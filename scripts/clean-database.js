const fs = require('fs');

console.log('🧹 Database Cleanup Script');
console.log('⚠️  WARNING: This will delete ALL existing products from the database!');

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production';

if (!isDevelopment) {
  console.log('❌ This script should only be run in development mode!');
  console.log('   Set NODE_ENV=development and try again.');
  process.exit(1);
}

console.log('✅ Running in development mode - proceeding with cleanup...');

// Create a cleanup API call
const cleanupScript = `
// Database Cleanup API Call
// This script will make an API call to delete all products

async function cleanupDatabase() {
  try {
    console.log('🧹 Starting database cleanup...');
    
    // Get auth token from localStorage (assuming you're logged in as admin)
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (!token) {
      console.error('❌ No authentication token found. Please log in as admin first.');
      return;
    }
    
    console.log('🔑 Found authentication token');
    
    // First, get all existing products to see what we're deleting
    const getProductsResponse = await fetch('/api/admin/products', {
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!getProductsResponse.ok) {
      console.error('❌ Failed to fetch existing products:', getProductsResponse.status);
      return;
    }
    
    const productsData = await getProductsResponse.json();
    const existingProducts = productsData.data || productsData.products || [];
    
    console.log(\`📊 Found \${existingProducts.length} existing products to delete\`);
    
    if (existingProducts.length === 0) {
      console.log('✅ Database is already clean - no products to delete');
      return;
    }
    
    // Delete each product individually
    let deletedCount = 0;
    let errorCount = 0;
    
    for (const product of existingProducts) {
      try {
        const deleteResponse = await fetch(\`/api/admin/products/\${product.id}\`, {
          method: 'DELETE',
          headers: {
            'Authorization': \`Bearer \${token}\`,
            'Content-Type': 'application/json'
          }
        });
        
        if (deleteResponse.ok) {
          deletedCount++;
          console.log(\`✅ Deleted product: \${product.name}\`);
        } else {
          errorCount++;
          console.error(\`❌ Failed to delete product: \${product.name} (\${deleteResponse.status})\`);
        }
      } catch (error) {
        errorCount++;
        console.error(\`❌ Error deleting product \${product.name}:\`, error);
      }
    }
    
    console.log(\`\\n📊 Cleanup Summary:\`);
    console.log(\`   ✅ Successfully deleted: \${deletedCount} products\`);
    console.log(\`   ❌ Failed to delete: \${errorCount} products\`);
    console.log(\`   📊 Total processed: \${existingProducts.length} products\`);
    
    if (errorCount === 0) {
      console.log('🎉 Database cleanup completed successfully!');
      console.log('🚀 Ready to import new products with proper categories');
    } else {
      console.log('⚠️  Some products could not be deleted. Check the errors above.');
    }
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
  }
}

// Run the cleanup
cleanupDatabase();
`;

// Save the cleanup script
fs.writeFileSync('scripts/run-cleanup.js', cleanupScript);

console.log('📝 Created cleanup script: scripts/run-cleanup.js');
console.log('\\n🔧 To clean the database:');
console.log('1. Open your browser developer console (F12)');
console.log('2. Make sure you\'re logged in as admin');
console.log('3. Copy and paste the contents of scripts/run-cleanup.js');
console.log('4. Press Enter to run the cleanup');
console.log('\\n⚠️  Alternative: Use the admin panel to delete products manually');
console.log('\\n🚀 After cleanup, you can import the properly mapped products:');
console.log('   - Use: data/products-with-mapped-categories.json');
console.log('   - Or CSV: data/products-with-mapped-categories.csv');

// Also create a simple manual cleanup guide
const manualCleanupGuide = `
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
`;

fs.writeFileSync('scripts/MANUAL_CLEANUP_GUIDE.md', manualCleanupGuide);
console.log('📋 Created manual cleanup guide: scripts/MANUAL_CLEANUP_GUIDE.md');

// Create a re-import script
const reimportScript = `
// Re-Import Script for Properly Mapped Products
// Run this after cleaning the database

async function reimportProducts() {
  try {
    console.log('🚀 Starting product re-import...');
    
    // Get auth token
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (!token) {
      console.error('❌ No authentication token found. Please log in as admin first.');
      return;
    }
    
    console.log('🔑 Found authentication token');
    
    // Read the mapped products file
    const response = await fetch('/data/products-with-mapped-categories.json');
    if (!response.ok) {
      console.error('❌ Failed to load products file');
      return;
    }
    
    const products = await response.json();
    console.log(\`📊 Found \${products.length} products to import\`);
    
    // Import products in batches to avoid overwhelming the server
    const batchSize = 5;
    let importedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      console.log(\`\\n📦 Processing batch \${Math.floor(i/batchSize) + 1} (\${batch.length} products)\`);
      
      for (const product of batch) {
        try {
          const importResponse = await fetch('/api/admin/products', {
            method: 'POST',
            headers: {
              'Authorization': \`Bearer \${token}\`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: product.name,
              description: product.description,
              shortDescription: product.description.substring(0, 150),
              price: product.price,
              stockQuantity: product.stockQuantity || 10,
              categoryName: product.category,
              images: product.images || [],
              videos: product.videos || [],
              color: product.color || '',
              type: product.type || '',
              isActive: true,
              isFeatured: false,
              tags: [product.color, product.type].filter(Boolean)
            })
          });
          
          if (importResponse.ok) {
            importedCount++;
            console.log(\`✅ Imported: \${product.name} (\${product.category})\`);
          } else {
            errorCount++;
            const errorData = await importResponse.text();
            console.error(\`❌ Failed to import \${product.name}: \${errorData}\`);
          }
          
          // Small delay between imports to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          errorCount++;
          console.error(\`❌ Error importing \${product.name}:\`, error);
        }
      }
      
      // Delay between batches
      if (i + batchSize < products.length) {
        console.log('⏳ Waiting 1 second before next batch...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(\`\\n📊 Import Summary:\`);
    console.log(\`   ✅ Successfully imported: \${importedCount} products\`);
    console.log(\`   ❌ Failed to import: \${errorCount} products\`);
    console.log(\`   📊 Total processed: \${products.length} products\`);
    
    if (errorCount === 0) {
      console.log('🎉 All products imported successfully!');
      console.log('🌐 Check your categories page to see products in correct categories');
    } else {
      console.log('⚠️  Some products could not be imported. Check the errors above.');
    }
    
  } catch (error) {
    console.error('❌ Re-import failed:', error);
  }
}

// Run the re-import
reimportProducts();
`;

fs.writeFileSync('scripts/run-reimport.js', reimportScript);
console.log('🚀 Created re-import script: scripts/run-reimport.js');

console.log('\\n📋 COMPLETE CLEANUP & RE-IMPORT PROCESS:');
console.log('1. 🧹 Clean database: Run scripts/run-cleanup.js in browser console');
console.log('2. 🚀 Re-import products: Run scripts/run-reimport.js in browser console');
console.log('3. ✅ Verify: Check categories page to see products in correct categories');
console.log('\\n🎯 This will fix your category mapping issues and authentication errors!');

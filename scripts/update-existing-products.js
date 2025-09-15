const fs = require('fs');

console.log('🔄 Product Update Script');
console.log('📝 Updating 8 existing products with proper category mapping...');

// The 8 products that need to be updated
const productsToUpdate = [
  { name: 'Green Flower', newCategory: 'mothers-day' },
  { name: 'Mixed Bouquet', newCategory: 'birthday' },
  { name: 'Mixed 1', newCategory: 'birthday' },
  { name: 'Mixed 10', newCategory: 'birthday' },
  { name: 'Mixed 2', newCategory: 'birthday' },
  { name: 'Mixed 3', newCategory: 'birthday' },
  { name: 'Mixed 4', newCategory: 'birthday' },
  { name: 'Mixed 5', newCategory: 'birthday' }
];

// Create the update script for browser console
const updateScript = `
// Update Existing Products Script
// Run this in your browser console while logged in as admin

async function updateExistingProducts() {
  try {
    console.log('🔄 Starting product updates...');
    
    // Get auth token
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (!token) {
      console.error('❌ No authentication token found. Please log in as admin first.');
      return;
    }
    
    console.log('🔑 Found authentication token');
    
    // Get all existing products to find the ones we need to update
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
    
    console.log(\`📊 Found \${existingProducts.length} existing products\`);
    
    // Products to update with their new categories
    const productsToUpdate = [
      { name: 'Green Flower', newCategory: 'mothers-day' },
      { name: 'Mixed Bouquet', newCategory: 'birthday' },
      { name: 'Mixed 1', newCategory: 'birthday' },
      { name: 'Mixed 10', newCategory: 'birthday' },
      { name: 'Mixed 2', newCategory: 'birthday' },
      { name: 'Mixed 3', newCategory: 'birthday' },
      { name: 'Mixed 4', newCategory: 'birthday' },
      { name: 'Mixed 5', newCategory: 'birthday' }
    ];
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const updateInfo of productsToUpdate) {
      try {
        // Find the existing product
        const existingProduct = existingProducts.find(p => p.name === updateInfo.name);
        
        if (!existingProduct) {
          console.log(\`⚠️ Product not found: \${updateInfo.name}\`);
          continue;
        }
        
        console.log(\`🔄 Updating: \${updateInfo.name} -> \${updateInfo.newCategory}\`);
        
        // Update the product with new category
        const updateResponse = await fetch(\`/api/admin/products/\${existingProduct.id}\`, {
          method: 'PUT',
          headers: {
            'Authorization': \`Bearer \${token}\`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...existingProduct,
            categoryName: updateInfo.newCategory,
            category: updateInfo.newCategory,
            categoryIds: [updateInfo.newCategory]
          })
        });
        
        if (updateResponse.ok) {
          updatedCount++;
          console.log(\`✅ Updated: \${updateInfo.name} -> \${updateInfo.newCategory}\`);
        } else {
          errorCount++;
          const errorData = await updateResponse.text();
          console.error(\`❌ Failed to update \${updateInfo.name}: \${errorData}\`);
        }
        
        // Small delay between updates
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        errorCount++;
        console.error(\`❌ Error updating \${updateInfo.name}:\`, error);
      }
    }
    
    console.log(\`\\n📊 Update Summary:\`);
    console.log(\`   ✅ Successfully updated: \${updatedCount} products\`);
    console.log(\`   ❌ Failed to update: \${errorCount} products\`);
    console.log(\`   📊 Total processed: \${productsToUpdate.length} products\`);
    
    if (errorCount === 0) {
      console.log('🎉 All products updated successfully!');
      console.log('🌐 Check your categories page to see products in correct categories');
    } else {
      console.log('⚠️ Some products could not be updated. Check the errors above.');
    }
    
  } catch (error) {
    console.error('❌ Update process failed:', error);
  }
}

// Run the updates
updateProducts();
`;

// Save the update script
fs.writeFileSync('scripts/run-update.js', updateScript);

console.log('📝 Created update script: scripts/run-update.js');
console.log('\\n🔧 To update the 8 existing products:');
console.log('1. Open your browser developer console (F12)');
console.log('2. Make sure you\'re logged in as admin');
console.log('3. Copy and paste the contents of scripts/run-update.js');
console.log('4. Press Enter to run the updates');
console.log('\n📊 Products to be updated:');
productsToUpdate.forEach((product, index) => {
  console.log(`   ${index + 1}. ${product.name} -> ${product.newCategory}`);
});

console.log('\\n🎯 After updates:');
console.log('   - Green Flower will appear in Mother\\'s Day category');
console.log('   - All Mixed products will appear in Birthday category');
console.log('   - All products will have proper category mapping');

// Also create a manual update guide
const manualUpdateGuide = `
🔄 MANUAL PRODUCT UPDATE GUIDE

If the automated update doesn't work, here are manual options:

1. ADMIN PANEL METHOD (Recommended):
   - Go to your admin panel (/admin)
   - Navigate to Products section
   - Find each of the 8 products
   - Edit each product and update the category field:
     * Green Flower -> mothers-day
     * Mixed Bouquet -> birthday
     * Mixed 1 -> birthday
     * Mixed 10 -> birthday
     * Mixed 2 -> birthday
     * Mixed 3 -> birthday
     * Mixed 4 -> birthday
     * Mixed 5 -> birthday

2. API METHOD:
   - Use Postman or similar tool
   - GET /api/admin/products/{id} to get product details
   - PUT /api/admin/products/{id} to update with new category

3. DATABASE DIRECT METHOD:
   - Access your database directly
   - Update the categoryName field for each product

⚠️ IMPORTANT:
- Make sure you're logged in as admin
- Test with one product first if unsure
- The category names must match your UI categories exactly

✅ AFTER UPDATES:
- All 71 products will have proper category mapping
- Products will appear in correct categories on customer UI
- No more "flowers" generic category issues
`;

fs.writeFileSync('scripts/MANUAL_UPDATE_GUIDE.md', manualUpdateGuide);
console.log('📋 Created manual update guide: scripts/MANUAL_UPDATE_GUIDE.md');

// Create a simple update API endpoint
const updateApiScript = `
// Simple API Update Script
// Alternative method using direct API calls

async function updateProductCategory(productId, newCategory) {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  
  const response = await fetch(\`/api/admin/products/\${productId}\`, {
    method: 'PUT',
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      categoryName: newCategory,
      category: newCategory,
      categoryIds: [newCategory]
    })
  });
  
  return response.ok;
}

// Usage example:
// updateProductCategory('product-id-here', 'birthday');
`;

fs.writeFileSync('scripts/simple-update-api.js', updateApiScript);
console.log('🔧 Created simple API update script: scripts/simple-update-api.js');

console.log('\\n🎯 SUMMARY:');
console.log('   📁 Scripts created:');
console.log('   - scripts/run-update.js (complete update process)');
console.log('   - scripts/simple-update-api.js (simple API calls)');
console.log('   - scripts/MANUAL_UPDATE_GUIDE.md (manual instructions)');
console.log('\\n🚀 Ready to update those 8 products!');

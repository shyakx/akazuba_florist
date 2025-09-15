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
const updateScript = `// Update Existing Products Script
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
updateExistingProducts();`;

// Save the update script
fs.writeFileSync('scripts/run-update.js', updateScript);

console.log('📝 Created update script: scripts/run-update.js');
console.log('\n🔧 To update the 8 existing products:');
console.log('1. Open your browser developer console (F12)');
console.log('2. Make sure you are logged in as admin');
console.log('3. Copy and paste the contents of scripts/run-update.js');
console.log('4. Press Enter to run the updates');
console.log('\n📊 Products to be updated:');
productsToUpdate.forEach((product, index) => {
  console.log(`   ${index + 1}. ${product.name} -> ${product.newCategory}`);
});

console.log('\n🎯 After updates:');
console.log('   - Green Flower will appear in Mother\'s Day category');
console.log('   - All Mixed products will appear in Birthday category');
console.log('   - All products will have proper category mapping');

console.log('\n🚀 Ready to update those 8 products!');

const fs = require('fs');
const path = require('path');

console.log('📦 Unique Products Import Script');

// Create a script to import the unique products
const importScript = `
// Import Unique Products
// Run this in your browser console while logged in as admin

async function importUniqueProducts() {
  try {
    console.log('🚀 Starting unique products import...');
    
    // Get auth token
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (!token) {
      console.error('❌ No authentication token found. Please log in as admin first.');
      return;
    }
    
    console.log('🔑 Found authentication token');
    
    // First, check current database status
    console.log('\\n📊 Checking current database...');
    const statusResponse = await fetch('/api/admin/products', {
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!statusResponse.ok) {
      console.error('❌ Failed to check database status:', statusResponse.status);
      return;
    }
    
    const statusData = await statusResponse.json();
    const currentProducts = statusData.data || statusData.products || [];
    
    if (currentProducts.length > 0) {
      console.log(\`⚠️ Database has \${currentProducts.length} existing products\`);
      console.log('\\n💡 Consider cleaning database first to avoid duplicates');
      console.log('   Run: scripts/run-cleanup.js (if available)');
      
      const shouldContinue = confirm(\`Continue importing \${currentProducts.length} existing products? This may create duplicates.`);
      if (!shouldContinue) {
        console.log('❌ Import cancelled by user');
        return;
      }
    } else {
      console.log('✅ Database is empty - perfect for clean import!');
    }
    
    // Import unique products
    console.log('\\n📦 Importing unique products...');
    
    const importResponse = await fetch('/api/admin/products/import', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        products: uniqueProductsData
      })
    });
    
    if (!importResponse.ok) {
      console.error('❌ Failed to import products:', importResponse.status);
      const errorText = await importResponse.text();
      console.error('Error details:', errorText);
      return;
    }
    
    const importResult = await importResponse.json();
    console.log('\\n✅ Import completed!');
    console.log(\`📊 Results:\`);
    console.log(\`   Total processed: \${importResult.total || importResult.processed || 'Unknown'}\`);
    console.log(\`   Successful: \${importResult.successful || importResult.success || 'Unknown'}\`);
    console.log(\`   Failed: \${importResult.failed || importResult.errors || 'Unknown'}\`);
    
    if (importResult.errors && importResult.errors.length > 0) {
      console.log('\\n❌ Import errors:');
      importResult.errors.forEach((error, index) => {
        console.log(\`   \${index + 1}. \${error}\`);
      });
    }
    
    // Verify final count
    console.log('\\n🔍 Verifying final database...');
    const finalResponse = await fetch('/api/admin/products', {
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      }
    });
    
    if (finalResponse.ok) {
      const finalData = await finalResponse.json();
      const finalProducts = finalData.data || finalData.products || [];
      console.log(\`📊 Final product count: \${finalProducts.length}\`);
      
      // Show category distribution
      const categoryCounts = {};
      finalProducts.forEach(product => {
        const category = product.categoryName || product.category || 'unknown';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      console.log('\\n📂 Final category distribution:');
      Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([category, count]) => {
          console.log(\`   \${category}: \${count} products\`);
        });
    }
    
    console.log('\\n🎉 Import process completed!');
    console.log('💡 Refresh your UI to see the new products');
    
    return importResult;
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    return { error: error.message };
  }
}

// Load unique products data
const uniqueProductsData = ${JSON.stringify(JSON.parse(fs.readFileSync(path.join(__dirname, '../data/unique-products-final.json'), 'utf8')), null, 2)};

console.log(\`📦 Loaded \${uniqueProductsData.length} unique products for import\`);

// Show preview of products to be imported
console.log('\\n🔍 Preview of products to import:');
uniqueProductsData.slice(0, 5).forEach((product, index) => {
  console.log(\`   \${index + 1}. \${product.name} (\${product.category}) - \${product.images[0]}\`);
});

if (uniqueProductsData.length > 5) {
  console.log(\`   ... and \${uniqueProductsData.length - 5} more products\`);
}

// Show category distribution
const categoryCounts = {};
uniqueProductsData.forEach(product => {
  categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
});

console.log('\\n📂 Import category distribution:');
Object.entries(categoryCounts)
  .sort(([,a], [,b]) => b - a)
  .forEach(([category, count]) => {
    console.log(\`   \${category}: \${count} products\`);
  });

// Run the import
console.log('\\n🚀 Ready to import! Run importUniqueProducts() to start.');
`;

// Save the import script
fs.writeFileSync('scripts/run-unique-import.js', importScript);

console.log('📝 Created unique products import script: scripts/run-unique-import.js');
console.log('\n🔧 To import your unique products:');
console.log('1. Open your browser developer console (F12)');
console.log('2. Make sure you are logged in as admin');
console.log('3. Copy and paste the contents of scripts/run-unique-import.js');
console.log('4. Press Enter to load the script');
console.log('5. Type: importUniqueProducts() and press Enter to start import');
console.log('\n📊 This will import:');
console.log('   - 41 unique products');
console.log('   - One image per product');
console.log('   - Proper categorization');
console.log('   - No duplicates or placeholders');
console.log('\n🚀 Ready for unique products import!');

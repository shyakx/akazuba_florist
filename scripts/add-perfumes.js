const fs = require('fs');
const path = require('path');

console.log('🌸 Creating Perfume Products Import Script');

// Create perfume products data
const perfumeProducts = [
  {
    name: "Beautiful Puppet Perfume",
    description: "Elegant and sophisticated perfume with a beautiful puppet design, perfect for special occasions",
    price: 85000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/A BEAUTFUL PUPPET.jpg"],
    videos: []
  },
  {
    name: "Premium Perfume Collection 1",
    description: "Luxurious premium perfume with elegant packaging and long-lasting fragrance",
    price: 95000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-1.jpg"],
    videos: []
  },
  {
    name: "Premium Perfume Collection 2",
    description: "Sophisticated fragrance with floral notes, perfect for romantic occasions",
    price: 92000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-2.jpg"],
    videos: []
  },
  {
    name: "Premium Perfume Collection 3",
    description: "Modern and trendy perfume with citrus undertones for a fresh, vibrant scent",
    price: 88000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-3.png"],
    videos: []
  },
  {
    name: "Premium Perfume Collection 4",
    description: "Classic and timeless fragrance with woody notes for an elegant appeal",
    price: 90000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-4.jpeg"],
    videos: []
  },
  {
    name: "Premium Perfume Collection 5",
    description: "Exotic and mysterious perfume with oriental spices and warm amber",
    price: 98000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-5.png"],
    videos: []
  },
  {
    name: "Premium Perfume Collection 6",
    description: "Light and airy fragrance with floral and fruity notes for everyday elegance",
    price: 86000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-6.jpg"],
    videos: []
  },
  {
    name: "Premium Perfume Collection 7",
    description: "Rich and luxurious perfume with vanilla and musk for a seductive allure",
    price: 94000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-7.png"],
    videos: []
  },
  {
    name: "Premium Perfume Collection 8",
    description: "Fresh and invigorating fragrance with marine notes for a clean, modern feel",
    price: 87000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-8.jpeg"],
    videos: []
  },
  {
    name: "Premium Perfume Collection 9",
    description: "Romantic and feminine perfume with rose and jasmine for special moments",
    price: 93000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-9.png"],
    videos: []
  },
  {
    name: "Premium Perfume Collection 10",
    description: "Bold and confident fragrance with spicy notes for a powerful presence",
    price: 96000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-10.png"],
    videos: []
  }
];

// Create import script
const importScript = `
// Import Perfume Products
// Run this in your browser console while logged in as admin

async function importPerfumes() {
  try {
    console.log('🌸 Starting perfume products import...');
    
    // Get auth token
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (!token) {
      console.error('❌ No authentication token found. Please log in as admin first.');
      return;
    }
    
    console.log('🔑 Found authentication token');
    
    // Check current database status
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
    
    console.log(\`📊 Current products in database: \${currentProducts.length}\`);
    
    // Import perfume products
    console.log('\\n🌸 Importing perfume products...');
    
    const importResponse = await fetch('/api/admin/products/import', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        products: perfumeProductsData
      })
    });
    
    if (!importResponse.ok) {
      console.error('❌ Failed to import perfumes:', importResponse.status);
      const errorText = await importResponse.text();
      console.error('Error details:', errorText);
      return;
    }
    
    const importResult = await importResponse.json();
    console.log('\\n✅ Perfume import completed!');
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
    
    console.log('\\n🎉 Perfume import process completed!');
    console.log('💡 Refresh your UI to see the new perfume products');
    
    return importResult;
    
  } catch (error) {
    console.error('❌ Perfume import failed:', error);
    return { error: error.message };
  }
}

// Load perfume products data
const perfumeProductsData = ${JSON.stringify(perfumeProducts, null, 2)};

console.log(\`🌸 Loaded \${perfumeProductsData.length} perfume products for import\`);

// Show preview of perfumes to be imported
console.log('\\n🔍 Preview of perfumes to import:');
perfumeProductsData.slice(0, 5).forEach((perfume, index) => {
  console.log(\`   \${index + 1}. \${perfume.name} - RF \${perfume.price.toLocaleString()}\`);
});

if (perfumeProductsData.length > 5) {
  console.log(\`   ... and \${perfumeProductsData.length - 5} more perfumes\`);
}

console.log('\\n🌸 Ready to import perfumes! Run importPerfumes() to start.');
`;

// Save the import script
fs.writeFileSync('scripts/run-perfume-import.js', importScript);

// Save perfume data to JSON file
fs.writeFileSync('data/perfume-products.json', JSON.stringify(perfumeProducts, null, 2));

console.log('📝 Created perfume import script: scripts/run-perfume-import.js');
console.log('📄 Saved perfume data to: data/perfume-products.json');

console.log('\n🌸 Perfume Import Plan:');
console.log('1. Open browser console (F12)');
console.log('2. Copy & paste contents of scripts/run-perfume-import.js');
console.log('3. Press Enter to load the script');
console.log('4. Type: importPerfumes() and press Enter to start import');

console.log('\n📊 Perfume Products Created:');
console.log(`   Total perfumes: ${perfumeProducts.length}`);
console.log('   Category: Perfumes');
console.log('   Price range: RF 85,000 - RF 98,000');
console.log('   All unique images (no duplicates)');

console.log('\n🎯 Expected Results:');
console.log('   - 11 new perfume products added');
console.log('   - Total products: 53 flowers + 11 perfumes = 64 products');
console.log('   - New "Perfumes" category in UI');
console.log('   - All perfumes display with unique images');

console.log('\n🚀 Ready to add perfumes to your store!');

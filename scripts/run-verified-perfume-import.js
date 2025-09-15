// Import Verified Perfume Products (perfume-1 to perfume-10)
// Run this in your browser console while logged in as admin

async function importVerifiedPerfumes() {
  try {
    console.log('🌸 Starting verified perfume products import...');
    
    // Get auth token
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (!token) {
      console.error('❌ No authentication token found. Please log in as admin first.');
      return;
    }
    
    console.log('🔑 Found authentication token');
    
    // Check current database status
    console.log('\n📊 Checking current database...');
    const statusResponse = await fetch('/api/admin/products', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!statusResponse.ok) {
      console.error('❌ Failed to check database status:', statusResponse.status);
      return;
    }
    
    const statusData = await statusResponse.json();
    const currentProducts = statusData.data || statusData.products || [];
    
    console.log(`📊 Current products in database: ${currentProducts.length}`);
    
    // Import verified perfume products
    console.log('\n🌸 Importing verified perfume products...');
    
    const importResponse = await fetch('/api/admin/products/import', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        products: verifiedPerfumeProductsData
      })
    });
    
    if (!importResponse.ok) {
      console.error('❌ Failed to import perfumes:', importResponse.status);
      const errorText = await importResponse.text();
      console.error('Error details:', errorText);
      return;
    }
    
    const importResult = await importResponse.json();
    console.log('\n✅ Verified perfume import completed!');
    console.log(`📊 Results:`);
    console.log(`   Total processed: ${importResult.total || importResult.processed || 'Unknown'}`);
    console.log(`   Successful: ${importResult.successful || importResult.success || 'Unknown'}`);
    console.log(`   Failed: ${importResult.failed || importResult.errors || 'Unknown'}`);
    
    if (importResult.errors && importResult.errors.length > 0) {
      console.log('\n❌ Import errors:');
      importResult.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    // Verify final count
    console.log('\n🔍 Verifying final database...');
    const finalResponse = await fetch('/api/admin/products', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (finalResponse.ok) {
      const finalData = await finalResponse.json();
      const finalProducts = finalData.data || finalData.products || [];
      console.log(`📊 Final product count: ${finalProducts.length}`);
      
      // Show category distribution
      const categoryCounts = {};
      finalProducts.forEach(product => {
        const category = product.categoryName || product.category || 'unknown';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      console.log('\n📂 Final category distribution:');
      Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([category, count]) => {
          console.log(`   ${category}: ${count} products`);
        });
    }
    
    console.log('\n🎉 Verified perfume import process completed!');
    console.log('💡 Refresh your UI to see the new perfume products');
    
    return importResult;
    
  } catch (error) {
    console.error('❌ Verified perfume import failed:', error);
    return { error: error.message };
  }
}

// Load verified perfume products data (perfume-1 to perfume-10)
const verifiedPerfumeProductsData = [
  {
    name: "Luxury Perfume Collection 1",
    description: "Elegant and sophisticated perfume with long-lasting fragrance, perfect for special occasions",
    price: 95000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-1.jpg"],
    videos: []
  },
  {
    name: "Luxury Perfume Collection 2",
    description: "Premium fragrance with floral notes and elegant packaging for romantic occasions",
    price: 92000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-2.jpg"],
    videos: []
  },
  {
    name: "Luxury Perfume Collection 3",
    description: "Modern and trendy perfume with citrus undertones for a fresh, vibrant scent",
    price: 88000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-3.png"],
    videos: []
  },
  {
    name: "Luxury Perfume Collection 4",
    description: "Classic and timeless fragrance with woody notes for an elegant appeal",
    price: 90000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-4.jpeg"],
    videos: []
  },
  {
    name: "Luxury Perfume Collection 5",
    description: "Exotic and mysterious perfume with oriental spices and warm amber",
    price: 98000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-5.png"],
    videos: []
  },
  {
    name: "Luxury Perfume Collection 6",
    description: "Light and airy fragrance with floral and fruity notes for everyday elegance",
    price: 86000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-6.jpg"],
    videos: []
  },
  {
    name: "Luxury Perfume Collection 7",
    description: "Rich and luxurious perfume with vanilla and musk for a seductive allure",
    price: 94000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-7.png"],
    videos: []
  },
  {
    name: "Luxury Perfume Collection 8",
    description: "Fresh and invigorating fragrance with marine notes for a clean, modern feel",
    price: 87000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-8.jpeg"],
    videos: []
  },
  {
    name: "Luxury Perfume Collection 9",
    description: "Romantic and feminine perfume with rose and jasmine for special moments",
    price: 93000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-9.png"],
    videos: []
  },
  {
    name: "Luxury Perfume Collection 10",
    description: "Bold and confident fragrance with spicy notes for a powerful presence",
    price: 96000,
    category: "Perfumes",
    categoryName: "Perfumes",
    categoryIds: ["perfumes"],
    images: ["/images/perfumes/perfume-10.png"],
    videos: []
  }
];

console.log(`🌸 Loaded ${verifiedPerfumeProductsData.length} verified perfume products for import`);

// Show preview of perfumes to be imported
console.log('\n🔍 Preview of verified perfumes to import:');
verifiedPerfumeProductsData.slice(0, 5).forEach((perfume, index) => {
  console.log(`   ${index + 1}. ${perfume.name} - RF ${perfume.price.toLocaleString()}`);
});

if (verifiedPerfumeProductsData.length > 5) {
  console.log(`   ... and ${verifiedPerfumeProductsData.length - 5} more perfumes`);
}

console.log('\n📂 Perfume Category:');
console.log(`   Category: Perfumes`);
console.log(`   Price range: RF 86,000 - RF 98,000`);
console.log(`   All verified perfume images (perfume-1 to perfume-10)`);

console.log('\n🎯 Expected Results:');
console.log('   - 10 new verified perfume products added');
console.log('   - Total products: 53 flowers + 10 perfumes = 63 products');
console.log('   - New "Perfumes" category in UI');
console.log('   - All perfumes display with unique verified images');

console.log('\n🌸 Ready to import verified perfumes! Run importVerifiedPerfumes() to start.');

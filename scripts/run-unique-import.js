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
    
    // Import unique products
    console.log('\n📦 Importing unique products...');
    
    const importResponse = await fetch('/api/admin/products/import', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
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
    console.log('\n✅ Import completed!');
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
    
    console.log('\n🎉 Import process completed!');
    console.log('💡 Refresh your UI to see the new products');
    
    return importResult;
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    return { error: error.message };
  }
}

// Load unique products data
const uniqueProductsData = [
  {
    "name": "Green Flower",
    "description": "Beautiful green flower arrangement",
    "price": 45000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/green/1 min video advertisemnet.mp4"],
    "videos": []
  },
  {
    "name": "Mixed Bouquet",
    "description": "Colorful mixed bouquet arrangement",
    "price": 55000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/mixed/mixed colors bouquet.jpg"],
    "videos": []
  },
  {
    "name": "Mixed 1",
    "description": "Beautiful mixed flower arrangement 1",
    "price": 60000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/mixed/mixed-1.jpg"],
    "videos": []
  },
  {
    "name": "Mixed 10",
    "description": "Beautiful mixed flower arrangement 10",
    "price": 65000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/mixed/mixed-10.jpg"],
    "videos": []
  },
  {
    "name": "Mixed 2",
    "description": "Beautiful mixed flower arrangement 2",
    "price": 58000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/mixed/mixed-2.jpg"],
    "videos": []
  },
  {
    "name": "Mixed 3",
    "description": "Beautiful mixed flower arrangement 3",
    "price": 62000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/mixed/mixed-3.jpg"],
    "videos": []
  },
  {
    "name": "Mixed 4",
    "description": "Beautiful mixed flower arrangement 4",
    "price": 59000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/mixed/mixed-4.jpg"],
    "videos": []
  },
  {
    "name": "Mixed 5",
    "description": "Beautiful mixed flower arrangement 5",
    "price": 61000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/mixed/mixed-5.jpg"],
    "videos": []
  },
  {
    "name": "Mixed 6",
    "description": "Beautiful mixed flower arrangement 6",
    "price": 57000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/mixed/mixed-6.jpg"],
    "videos": []
  },
  {
    "name": "Mixed 7",
    "description": "Beautiful mixed flower arrangement 7",
    "price": 63000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/mixed/mixed-7.jpg"],
    "videos": []
  },
  {
    "name": "Mixed 8",
    "description": "Beautiful mixed flower arrangement 8",
    "price": 56000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/mixed/mixed-8.jpg"],
    "videos": []
  },
  {
    "name": "Mixed 9",
    "description": "Beautiful mixed flower arrangement 9",
    "price": 64000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/mixed/mixed-9.jpg"],
    "videos": []
  },
  {
    "name": "Mized Colors",
    "description": "Beautiful mixed colors arrangement",
    "price": 55000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/mixed/mized colors.jpg"],
    "videos": []
  },
  {
    "name": "Mixed Bouquet 1",
    "description": "Beautiful mixed bouquet arrangement 1",
    "price": 60000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/mixed/placeholder-flower.jpg"],
    "videos": []
  },
  {
    "name": "Full Rose Flowers With White Cover",
    "description": "Full rose flowers with white cover arrangement",
    "price": 75000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/pink/full rose flowers with white cover.jpg"],
    "videos": []
  },
  {
    "name": "Pink Heart Shaped Rose",
    "description": "Beautiful pink heart shaped rose arrangement",
    "price": 85000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/pink/heartshapped roses with short moet and chocolates.jpg"],
    "videos": []
  },
  {
    "name": "Pink Gift Package",
    "description": "Beautiful pink gift package arrangement",
    "price": 70000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/pink/home decor flowers in glass yellow and pink colors.jpg"],
    "videos": []
  },
  {
    "name": "Pink Bouquet",
    "description": "Beautiful pink bouquet arrangement",
    "price": 65000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/pink/pink and cake and moet bouquet.jpg"],
    "videos": []
  },
  {
    "name": "Rose And Yelllow Boquet",
    "description": "Beautiful rose and yellow bouquet arrangement",
    "price": 60000,
    "category": "Birthday",
    "categoryName": "Birthday",
    "categoryIds": ["birthday"],
    "images": ["/images/flowers/pink/pink and while flowers with chocolate package.jpg"],
    "videos": []
  },
  {
    "name": "Pink Gift Package 2",
    "description": "Beautiful pink gift package arrangement 2",
    "price": 72000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/pink/pink and white bouquet.jpg"],
    "videos": []
  },
  {
    "name": "Pink Gift Package 3",
    "description": "Beautiful pink gift package arrangement 3",
    "price": 68000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/pink/pink-1.jpg"],
    "videos": []
  },
  {
    "name": "Pink Gift Package 4",
    "description": "Beautiful pink gift package arrangement 4",
    "price": 70000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/pink/pink-2.jpg"],
    "videos": []
  },
  {
    "name": "Pink Heart Shaped Rose 1",
    "description": "Beautiful pink heart shaped rose arrangement 1",
    "price": 90000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/pink/pink-3.jpg"],
    "videos": []
  },
  {
    "name": "Roses And White Boquetr",
    "description": "Beautiful roses and white bouquet arrangement",
    "price": 45000,
    "category": "Wedding",
    "categoryName": "Wedding",
    "categoryIds": ["wedding"],
    "images": ["/images/flowers/pink/rose and yelllow boquet.jpg"],
    "videos": []
  },
  {
    "name": "Pink Heart Shaped Rose 2",
    "description": "Beautiful pink heart shaped rose arrangement 2",
    "price": 85000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/pink/rose bouquet packed with moet and puppet and chocolate.jpg"],
    "videos": []
  },
  {
    "name": "Red Gift Package",
    "description": "Beautiful red gift package arrangement",
    "price": 78000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/pink/rose packed with chocolate and accompanied with four cousins .jpg"],
    "videos": []
  },
  {
    "name": "Red Heart Shaped Bouquet",
    "description": "Beautiful red heart shaped bouquet arrangement",
    "price": 93000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/pink/rose-whilte with four cousins and chocolate package.jpg"],
    "videos": []
  },
  {
    "name": "Red Bouquet",
    "description": "Beautiful red bouquet arrangement",
    "price": 55000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/pink/rosed heart shaped.jpg"],
    "videos": []
  },
  {
    "name": "Roses Red Video",
    "description": "Beautiful roses red video arrangement",
    "price": 50000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/pink/roses and white boquetr.jpg"],
    "videos": []
  },
  {
    "name": "White Bouquet",
    "description": "Beautiful white bouquet arrangement",
    "price": 65000,
    "category": "Wedding",
    "categoryName": "Wedding",
    "categoryIds": ["wedding"],
    "images": ["/images/flowers/pink/roses heart shaped package with nutella.jpg"],
    "videos": []
  },
  {
    "name": "Purple Bucket Bucket Arrangement",
    "description": "Beautiful purple bucket bucket arrangement",
    "price": 65000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/purple/purple bucket flowers.jpg"],
    "videos": []
  },
  {
    "name": "Purple Gift Package",
    "description": "Beautiful purple gift package arrangement",
    "price": 120000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/purple/purple flowers with chocolate package.jpg"],
    "videos": []
  },
  {
    "name": "Purple Bucket Bucket Arrangement 1",
    "description": "Beautiful purple bucket bucket arrangement 1",
    "price": 65000,
    "category": "Special Occasions",
    "categoryName": "Special Occasions",
    "categoryIds": ["special-occasions"],
    "images": ["/images/flowers/purple/purple-bucket.jpg"],
    "videos": []
  },
  {
    "name": "Red Flower",
    "description": "Beautiful red flower arrangement",
    "price": 35000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/red/basket package of mixed pink white yellow and red flowers.jpg"],
    "videos": []
  },
  {
    "name": "Red Gift Package 1",
    "description": "Beautiful red gift package arrangement 1",
    "price": 78000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/red/green and red colors flowers.jpg"],
    "videos": []
  },
  {
    "name": "Red Flower 1",
    "description": "Beautiful red flower arrangement 1",
    "price": 40000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/red/heart shaped red white flowers bouquet .jpg"],
    "videos": []
  },
  {
    "name": "Red Flower 2",
    "description": "Beautiful red flower arrangement 2",
    "price": 42000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/red/mixed colors booket red coat.jpg"],
    "videos": []
  },
  {
    "name": "Red Flower 3",
    "description": "Beautiful red flower arrangement 3",
    "price": 38000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/red/red pink and jp chenet AND CHOXOLATE PACKAGE.jpg"],
    "videos": []
  },
  {
    "name": "Red Flower 4",
    "description": "Beautiful red flower arrangement 4",
    "price": 45000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/red/red-1.jpg"],
    "videos": []
  },
  {
    "name": "Red Flower 5",
    "description": "Beautiful red flower arrangement 5",
    "price": 43000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/red/red-2.jpg"],
    "videos": []
  },
  {
    "name": "Red Flower 6",
    "description": "Beautiful red flower arrangement 6",
    "price": 41000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/red/red-3.jpg"],
    "videos": []
  },
  {
    "name": "Red Flower 7",
    "description": "Beautiful red flower arrangement 7",
    "price": 46000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/red/red-4.jpg"],
    "videos": []
  },
  {
    "name": "Red Flower 8",
    "description": "Beautiful red flower arrangement 8",
    "price": 44000,
    "category": "Valentine",
    "categoryName": "Valentine",
    "categoryIds": ["valentine"],
    "images": ["/images/flowers/red/red-5.jpg"],
    "videos": []
  },
  {
    "name": "White Flower",
    "description": "Beautiful white flower arrangement",
    "price": 60000,
    "category": "Wedding",
    "categoryName": "Wedding",
    "categoryIds": ["wedding"],
    "images": ["/images/flowers/red/red-6.jpg"],
    "videos": []
  },
  {
    "name": "White Bucket Bucket Arrangement",
    "description": "Beautiful white bucket bucket arrangement",
    "price": 70000,
    "category": "Wedding",
    "categoryName": "Wedding",
    "categoryIds": ["wedding"],
    "images": ["/images/flowers/red/red-7.jpg"],
    "videos": []
  },
  {
    "name": "White Flower 1",
    "description": "Beautiful white flower arrangement 1",
    "price": 65000,
    "category": "Wedding",
    "categoryName": "Wedding",
    "categoryIds": ["wedding"],
    "images": ["/images/flowers/red/red-8.jpg"],
    "videos": []
  },
  {
    "name": "White Flower 2",
    "description": "Beautiful white flower arrangement 2",
    "price": 62000,
    "category": "Wedding",
    "categoryName": "Wedding",
    "categoryIds": ["wedding"],
    "images": ["/images/flowers/white/all yellow flowers with white cover(coat).jpg"],
    "videos": []
  },
  {
    "name": "White Flower 3",
    "description": "Beautiful white flower arrangement 3",
    "price": 68000,
    "category": "Wedding",
    "categoryName": "Wedding",
    "categoryIds": ["wedding"],
    "images": ["/images/flowers/white/bucket flower of white blue and balloon .jpg"],
    "videos": []
  },
  {
    "name": "Wedding Wedding Bouquet",
    "description": "Beautiful wedding wedding bouquet arrangement",
    "price": 80000,
    "category": "Wedding",
    "categoryName": "Wedding",
    "categoryIds": ["wedding"],
    "images": ["/images/flowers/white/full white color bouquet.jpg"],
    "videos": []
  },
  {
    "name": "Wedding Wedding Bouquet 1",
    "description": "Beautiful wedding wedding bouquet arrangement 1",
    "price": 85000,
    "category": "Wedding",
    "categoryName": "Wedding",
    "categoryIds": ["wedding"],
    "images": ["/images/flowers/white/wedding white flower2.jpg"],
    "videos": []
  },
  {
    "name": "Yellow Flower",
    "description": "Beautiful yellow flower arrangement",
    "price": 50000,
    "category": "Birthday",
    "categoryName": "Birthday",
    "categoryIds": ["birthday"],
    "images": ["/images/flowers/white/white-1.jpg"],
    "videos": []
  },
  {
    "name": "Yellow Flower 1",
    "description": "Beautiful yellow flower arrangement 1",
    "price": 52000,
    "category": "Birthday",
    "categoryName": "Birthday",
    "categoryIds": ["birthday"],
    "images": ["/images/flowers/white/white-2.jpg"],
    "videos": []
  },
  {
    "name": "Funeral Funeral Wreath",
    "description": "Beautiful funeral funeral wreath arrangement",
    "price": 90000,
    "category": "Funerals",
    "categoryName": "Funerals",
    "categoryIds": ["funerals"],
    "images": ["/images/flowers/white/white-3.jpg"],
    "videos": []
  },
  {
    "name": "Funeral Funeral Wreath 1",
    "description": "Beautiful funeral funeral wreath arrangement 1",
    "price": 95000,
    "category": "Funerals",
    "categoryName": "Funerals",
    "categoryIds": ["funerals"],
    "images": ["/images/funerals/funeral many.jpg"],
    "videos": []
  }
];

console.log(`📦 Loaded ${uniqueProductsData.length} unique products for import`);

// Show preview of products to be imported
console.log('\n🔍 Preview of products to import:');
uniqueProductsData.slice(0, 5).forEach((product, index) => {
  console.log(`   ${index + 1}. ${product.name} (${product.category}) - ${product.images[0]}`);
});

if (uniqueProductsData.length > 5) {
  console.log(`   ... and ${uniqueProductsData.length - 5} more products`);
}

// Show category distribution
const categoryCounts = {};
uniqueProductsData.forEach(product => {
  categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
});

console.log('\n📂 Import category distribution:');
Object.entries(categoryCounts)
  .sort(([,a], [,b]) => b - a)
  .forEach(([category, count]) => {
    console.log(`   ${category}: ${count} products`);
  });

// Run the import
console.log('\n🚀 Ready to import! Run importUniqueProducts() to start.');


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
    console.log(`📊 Found ${products.length} products to import`);
    
    // Import products in batches to avoid overwhelming the server
    const batchSize = 5;
    let importedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1} (${batch.length} products)`);
      
      for (const product of batch) {
        try {
          const importResponse = await fetch('/api/admin/products', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
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
            console.log(`✅ Imported: ${product.name} (${product.category})`);
          } else {
            errorCount++;
            const errorData = await importResponse.text();
            console.error(`❌ Failed to import ${product.name}: ${errorData}`);
          }
          
          // Small delay between imports to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          errorCount++;
          console.error(`❌ Error importing ${product.name}:`, error);
        }
      }
      
      // Delay between batches
      if (i + batchSize < products.length) {
        console.log('⏳ Waiting 1 second before next batch...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`\n📊 Import Summary:`);
    console.log(`   ✅ Successfully imported: ${importedCount} products`);
    console.log(`   ❌ Failed to import: ${errorCount} products`);
    console.log(`   📊 Total processed: ${products.length} products`);
    
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

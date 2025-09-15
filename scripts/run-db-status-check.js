// Database Status Check
// Run this in your browser console while logged in as admin

async function checkDatabaseStatus() {
  try {
    console.log('🔍 Checking current database status...');
    
    // Get auth token
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (!token) {
      console.error('❌ No authentication token found. Please log in as admin first.');
      return;
    }
    
    console.log('🔑 Found authentication token');
    
    // Get all products
    const response = await fetch('/api/admin/products', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('❌ Failed to fetch products:', response.status);
      return;
    }
    
    const data = await response.json();
    const products = data.data || data.products || [];
    
    console.log(`📊 Current products in database: ${products.length}`);
    
    if (products.length > 0) {
      // Check for duplicate images
      const imageUsage = {};
      let duplicateImages = 0;
      let placeholderImages = 0;
      
      products.forEach(product => {
        if (product.images && Array.isArray(product.images)) {
          product.images.forEach(imagePath => {
            if (typeof imagePath === 'string') {
              const fileName = imagePath.split('/').pop();
              if (!imageUsage[fileName]) {
                imageUsage[fileName] = [];
              }
              imageUsage[fileName].push(product.name);
              
              if (fileName.includes('placeholder')) {
                placeholderImages++;
              }
            }
          });
        }
      });
      
      // Count duplicates
      Object.entries(imageUsage).forEach(([fileName, usage]) => {
        if (usage.length > 1) {
          duplicateImages += usage.length - 1;
        }
      });
      
      // Show status
      console.log('\n📈 Database Analysis:');
      console.log(`   Total products: ${products.length}`);
      console.log(`   Unique image files: ${Object.keys(imageUsage).length}`);
      console.log(`   Duplicate image instances: ${duplicateImages}`);
      console.log(`   Products with placeholder images: ${placeholderImages}`);
      
      if (duplicateImages > 0 || placeholderImages > 0) {
        console.log('\n⚠️ Issues found:');
        if (duplicateImages > 0) {
          console.log(`   - ${duplicateImages} duplicate image instances`);
        }
        if (placeholderImages > 0) {
          console.log(`   - ${placeholderImages} products with placeholder images`);
        }
        console.log('\n💡 Recommendation: Clean database and import unique products');
      } else {
        console.log('\n✅ Database looks clean - no duplicates or placeholders found!');
      }
      
      // Show category distribution
      const categoryCounts = {};
      products.forEach(product => {
        const category = product.categoryName || product.category || 'unknown';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      console.log('\n📂 Current category distribution:');
      Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([category, count]) => {
          console.log(`   ${category}: ${count} products`);
        });
        
    } else {
      console.log('✅ Database is empty - ready for clean import!');
    }
    
    return {
      totalProducts: products.length,
      duplicateImages: duplicateImages,
      placeholderImages: placeholderImages,
      isClean: products.length === 0 || (duplicateImages === 0 && placeholderImages === 0)
    };
    
  } catch (error) {
    console.error('❌ Failed to check database status:', error);
    return { error: error.message };
  }
}

// Run the check
checkDatabaseStatus();
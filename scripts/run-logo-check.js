
// Enhanced Product Check with Logo Detection
// Run this in your browser console while logged in as admin

async function checkProductsWithLogos() {
  try {
    console.log('🔍 Checking database products and detecting logo images...');
    
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
    
    console.log(`📊 Total products in database: ${products.length}`);
    
    if (products.length > 0) {
      // Count by category
      const categoryCounts = {};
      let logoProducts = [];
      
      products.forEach(product => {
        const category = product.categoryName || product.category || 'unknown';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        
        // Check for logo images in product images
        if (product.images && Array.isArray(product.images)) {
          const logoImages = product.images.filter(image => 
            typeof image === 'string' && (
              image.includes('logo.png') || 
              image.includes('cloud-sync') ||
              image.includes('company-logo')
            )
          );
          
          if (logoImages.length > 0) {
            logoProducts.push({
              name: product.name,
              id: product.id,
              logoImages: logoImages
            });
          }
        }
      });
      
      console.log('\n📂 Products by category:');
      Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([category, count]) => {
          console.log(`   ${category}: ${count} products`);
        });
      
      // Check for logo products
      if (logoProducts.length > 0) {
        console.log('\n❌ Products containing logo/cloud-sync images:');
        logoProducts.forEach(product => {
          console.log(`   - ${product.name} (ID: ${product.id})`);
          product.logoImages.forEach(img => {
            console.log(`     * ${img}`);
          });
        });
        console.log(`\n⚠️ Found ${logoProducts.length} products with logo images that need cleaning!`);
      } else {
        console.log('\n✅ No products contain logo or cloud-sync images!');
      }
      
      // Show sample products
      console.log('\n🔍 Sample products:');
      products.slice(0, 5).forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.categoryName || product.category || 'no category'})`);
      });
      
      if (products.length > 5) {
        console.log(`   ... and ${products.length - 5} more products`);
      }
    } else {
      console.log('⚠️ No products found in database');
    }
    
    return { totalProducts: products.length, logoProducts: logoProducts.length };
    
  } catch (error) {
    console.error('❌ Failed to check products:', error);
    return { totalProducts: 0, logoProducts: 0 };
  }
}

// Run the check
checkProductsWithLogos();

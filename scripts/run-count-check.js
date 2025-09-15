
// Check Database Product Count
// Run this in your browser console while logged in as admin

async function checkDatabaseCount() {
  try {
    console.log('🔍 Checking database product count...');
    
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
      products.forEach(product => {
        const category = product.categoryName || product.category || 'unknown';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      console.log('\n📂 Products by category:');
      Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([category, count]) => {
          console.log(`   ${category}: ${count} products`);
        });
      
      // Show first few products as examples
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
    
    return products.length;
    
  } catch (error) {
    console.error('❌ Failed to check database count:', error);
    return 0;
  }
}

// Run the check
checkDatabaseCount();


// Database Cleanup API Call
// This script will make an API call to delete all products

async function cleanupDatabase() {
  try {
    console.log('🧹 Starting database cleanup...');
    
    // Get auth token from localStorage (assuming you're logged in as admin)
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (!token) {
      console.error('❌ No authentication token found. Please log in as admin first.');
      return;
    }
    
    console.log('🔑 Found authentication token');
    
    // First, get all existing products to see what we're deleting
    const getProductsResponse = await fetch('/api/admin/products', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!getProductsResponse.ok) {
      console.error('❌ Failed to fetch existing products:', getProductsResponse.status);
      return;
    }
    
    const productsData = await getProductsResponse.json();
    const existingProducts = productsData.data || productsData.products || [];
    
    console.log(`📊 Found ${existingProducts.length} existing products to delete`);
    
    if (existingProducts.length === 0) {
      console.log('✅ Database is already clean - no products to delete');
      return;
    }
    
    // Delete each product individually
    let deletedCount = 0;
    let errorCount = 0;
    
    for (const product of existingProducts) {
      try {
        const deleteResponse = await fetch(`/api/admin/products/${product.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (deleteResponse.ok) {
          deletedCount++;
          console.log(`✅ Deleted product: ${product.name}`);
        } else {
          errorCount++;
          console.error(`❌ Failed to delete product: ${product.name} (${deleteResponse.status})`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Error deleting product ${product.name}:`, error);
      }
    }
    
    console.log(`\n📊 Cleanup Summary:`);
    console.log(`   ✅ Successfully deleted: ${deletedCount} products`);
    console.log(`   ❌ Failed to delete: ${errorCount} products`);
    console.log(`   📊 Total processed: ${existingProducts.length} products`);
    
    if (errorCount === 0) {
      console.log('🎉 Database cleanup completed successfully!');
      console.log('🚀 Ready to import new products with proper categories');
    } else {
      console.log('⚠️  Some products could not be deleted. Check the errors above.');
    }
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
  }
}

// Run the cleanup
cleanupDatabase();

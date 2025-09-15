// Simple Database Cleanup
// Run this in your browser console while logged in as admin

async function cleanDatabase() {
  try {
    console.log('🧹 Starting database cleanup...');
    
    // Get auth token
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (!token) {
      console.error('❌ No authentication token found. Please log in as admin first.');
      return;
    }
    
    console.log('🔑 Found authentication token');
    
    // First, check current count
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
    
    if (currentProducts.length === 0) {
      console.log('✅ Database is already empty!');
      return;
    }
    
    // Confirm cleanup
    const shouldClean = confirm(`Delete all ${currentProducts.length} products from database?`);
    if (!shouldClean) {
      console.log('❌ Cleanup cancelled by user');
      return;
    }
    
    // Delete all products
    console.log('\n🗑️ Deleting all products...');
    const deleteResponse = await fetch('/api/admin/products/cleanup', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!deleteResponse.ok) {
      console.error('❌ Failed to delete products:', deleteResponse.status);
      const errorText = await deleteResponse.text();
      console.error('Error details:', errorText);
      return;
    }
    
    const deleteResult = await deleteResponse.json();
    console.log('✅ Database cleanup completed!');
    console.log(`📊 Deleted: ${deleteResult.deletedCount || 'Unknown'} products`);
    
    // Verify cleanup
    console.log('\n🔍 Verifying cleanup...');
    const verifyResponse = await fetch('/api/admin/products', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      const remainingProducts = verifyData.data || verifyData.products || [];
      console.log(`📊 Remaining products: ${remainingProducts.length}`);
      
      if (remainingProducts.length === 0) {
        console.log('✅ Database is now empty - ready for clean import!');
      } else {
        console.log('⚠️ Some products may still remain');
      }
    }
    
    return deleteResult;
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    return { error: error.message };
  }
}

// Run the cleanup
console.log('🚀 Ready to clean database! Run cleanDatabase() to start.');

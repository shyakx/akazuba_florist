// Force Database Cleanup with Cache Clear
// Run this in your browser console while logged in as admin

async function forceCleanup() {
  try {
    console.log('🧹 Force cleaning database with cache clear...');
    
    // Get auth token
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (!token) {
      console.error('❌ No authentication token found. Please log in as admin first.');
      return;
    }
    
    console.log('🔑 Found authentication token');
    
    // Step 1: Clear all caches first
    console.log('\n🗑️ Clearing all caches...');
    
    // Clear localStorage
    localStorage.removeItem('products');
    localStorage.removeItem('productsCache');
    localStorage.removeItem('productCache');
    
    // Clear sessionStorage
    sessionStorage.removeItem('products');
    sessionStorage.removeItem('productsCache');
    sessionStorage.removeItem('productCache');
    
    console.log('✅ Caches cleared');
    
    // Step 2: Check current database status
    console.log('\n📊 Checking current database...');
    const statusResponse = await fetch('/api/admin/products?t=' + Date.now(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
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
      console.log('💡 Try refreshing the page to clear UI cache');
      return;
    }
    
    // Step 3: Delete all products via cleanup endpoint
    console.log('\n🗑️ Deleting all products...');
    const deleteResponse = await fetch('/api/admin/products/cleanup?t=' + Date.now(), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!deleteResponse.ok) {
      console.error('❌ Failed to delete products:', deleteResponse.status);
      const errorText = await deleteResponse.text();
      console.error('Error details:', errorText);
      
      // Try alternative cleanup method
      console.log('\n🔄 Trying alternative cleanup method...');
      await alternativeCleanup(token);
      return;
    }
    
    const deleteResult = await deleteResponse.json();
    console.log('✅ Database cleanup completed!');
    console.log(`📊 Deleted: ${deleteResult.deletedCount || 'Unknown'} products`);
    
    // Step 4: Verify cleanup
    console.log('\n🔍 Verifying cleanup...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    const verifyResponse = await fetch('/api/admin/products?t=' + Date.now(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      const remainingProducts = verifyData.data || verifyData.products || [];
      console.log(`📊 Remaining products: ${remainingProducts.length}`);
      
      if (remainingProducts.length === 0) {
        console.log('✅ Database is now empty!');
        console.log('💡 Please refresh the page to see changes');
      } else {
        console.log('⚠️ Some products still remain - trying alternative cleanup');
        await alternativeCleanup(token);
      }
    }
    
    return deleteResult;
    
  } catch (error) {
    console.error('❌ Force cleanup failed:', error);
    return { error: error.message };
  }
}

// Alternative cleanup method - delete products individually
async function alternativeCleanup(token) {
  try {
    console.log('\n🔄 Alternative cleanup: deleting products individually...');
    
    // Get all products
    const response = await fetch('/api/admin/products?t=' + Date.now(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.error('❌ Failed to fetch products for individual deletion');
      return;
    }
    
    const data = await response.json();
    const products = data.data || data.products || [];
    
    console.log(`📊 Found ${products.length} products to delete individually`);
    
    let deletedCount = 0;
    let errorCount = 0;
    
    // Delete each product individually
    for (const product of products) {
      try {
        const deleteResponse = await fetch(`/api/admin/products/${product.id}?t=${Date.now()}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (deleteResponse.ok) {
          deletedCount++;
          console.log(`✅ Deleted: ${product.name}`);
        } else {
          errorCount++;
          console.log(`❌ Failed to delete: ${product.name}`);
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        errorCount++;
        console.log(`❌ Error deleting ${product.name}:`, error.message);
      }
    }
    
    console.log(`\n📊 Individual cleanup completed:`);
    console.log(`   Deleted: ${deletedCount} products`);
    console.log(`   Errors: ${errorCount} products`);
    
    // Final verification
    console.log('\n🔍 Final verification...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const finalResponse = await fetch('/api/admin/products?t=' + Date.now(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (finalResponse.ok) {
      const finalData = await finalResponse.json();
      const finalProducts = finalData.data || finalData.products || [];
      console.log(`📊 Final product count: ${finalProducts.length}`);
      
      if (finalProducts.length === 0) {
        console.log('✅ Database is now completely empty!');
        console.log('💡 Please refresh the page to see changes');
      }
    }
    
  } catch (error) {
    console.error('❌ Alternative cleanup failed:', error);
  }
}

// Run the force cleanup
console.log('🚀 Ready to force clean database! Run forceCleanup() to start.');

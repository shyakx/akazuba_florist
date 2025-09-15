const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearProducts() {
  try {
    console.log('🗑️ Clearing all products...');
    
    // Delete products directly (simpler approach)
    const deletedProducts = await prisma.product.deleteMany({});
    console.log(`✅ Deleted ${deletedProducts.count} products`);
    
    // Verify
    const count = await prisma.product.count();
    console.log(`📊 Products remaining: ${count}`);
    
  } catch (error) {
    console.error('❌ Error clearing products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearProducts();

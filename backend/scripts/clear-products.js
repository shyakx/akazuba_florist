const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearProducts() {
  try {
    console.log('🗑️ Clearing all products...');
    
    // Delete in order to avoid foreign key constraints
    await prisma.$transaction(async (tx) => {
      await tx.cart_items.deleteMany({});
      await tx.order_items.deleteMany({});
      await tx.reviews.deleteMany({});
      await tx.wishlist.deleteMany({});
      await tx.product.deleteMany({});
    });
    
    console.log('✅ All products cleared successfully!');
    
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

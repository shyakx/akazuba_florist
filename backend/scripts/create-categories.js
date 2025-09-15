const { PrismaClient } = require('@prisma/client');

/**
 * Create Categories Script
 * 
 * This script creates the necessary categories for the products
 */

async function createCategories() {
  let prisma;
  
  try {
    console.log('🏗️ Creating categories...');
    
    prisma = new PrismaClient();
    await prisma.$connect();
    
    // Check existing categories
    const existingCategories = await prisma.category.findMany();
    console.log(`📊 Found ${existingCategories.length} existing categories`);
    
    if (existingCategories.length > 0) {
      console.log('✅ Categories already exist:');
      existingCategories.forEach(cat => {
        console.log(`- ${cat.name} (${cat.slug})`);
      });
      return;
    }
    
    // Define categories to create
    const categoriesToCreate = [
      {
        name: 'Flowers',
        slug: 'flowers',
        description: 'Beautiful fresh flowers and bouquets'
      },
      {
        name: 'Birthday',
        slug: 'birthday',
        description: 'Special birthday arrangements and gifts'
      },
      {
        name: 'Valentine',
        slug: 'valentine',
        description: 'Romantic flowers and gifts for Valentine\'s Day'
      },
      {
        name: 'Wedding',
        slug: 'wedding',
        description: 'Wedding flowers and bridal arrangements'
      },
      {
        name: 'Funerals',
        slug: 'funerals',
        description: 'Sympathy flowers and funeral arrangements'
      },
      {
        name: 'Special Occasions',
        slug: 'special-occasions',
        description: 'Perfumes and special occasion gifts'
      }
    ];
    
    console.log('📝 Creating categories...');
    
    for (const categoryData of categoriesToCreate) {
      try {
        const category = await prisma.category.create({
          data: categoryData
        });
        console.log(`✅ Created: ${category.name} (${category.slug})`);
      } catch (error) {
        console.log(`⚠️ Failed to create ${categoryData.name}: ${error.message}`);
      }
    }
    
    // Verify creation
    const finalCategories = await prisma.category.findMany();
    console.log(`\n🎉 Successfully created ${finalCategories.length} categories:`);
    finalCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (${cat.slug}) - ID: ${cat.id}`);
    });
    
  } catch (error) {
    console.error('❌ Error creating categories:', error);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

// Run the script
if (require.main === module) {
  createCategories();
}

module.exports = { createCategories };

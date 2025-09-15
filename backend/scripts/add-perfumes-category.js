const { PrismaClient } = require('@prisma/client');

/**
 * Add Perfumes Category Script
 * 
 * This script adds the missing Perfumes category
 */

async function addPerfumesCategory() {
  let prisma;
  
  try {
    console.log('🏗️ Adding Perfumes category...');
    
    prisma = new PrismaClient();
    await prisma.$connect();
    
    // Check if Perfumes category already exists
    const existingPerfumes = await prisma.category.findFirst({
      where: {
        OR: [
          { name: 'Perfumes' },
          { slug: 'perfumes' }
        ]
      }
    });
    
    if (existingPerfumes) {
      console.log('✅ Perfumes category already exists:', existingPerfumes.name, '(ID:', existingPerfumes.id, ')');
      return existingPerfumes;
    }
    
    // Create the Perfumes category
    const perfumesCategory = await prisma.category.create({
      data: {
        name: 'Perfumes',
        slug: 'perfumes',
        description: 'Fine perfumes and fragrances for men and women',
        isActive: true,
        sortOrder: 6
      }
    });
    
    console.log('✅ Created Perfumes category:', perfumesCategory.name, '(ID:', perfumesCategory.id, ')');
    
    // Verify all categories
    const allCategories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log('\n📊 All categories in database:');
    allCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (${cat.slug}) - ID: ${cat.id}`);
    });
    
    return perfumesCategory;
    
  } catch (error) {
    console.error('❌ Error adding Perfumes category:', error);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

// Run the script
if (require.main === module) {
  addPerfumesCategory();
}

module.exports = { addPerfumesCategory };

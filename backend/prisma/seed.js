const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create categories
  const categories = [
    { name: 'Flowers', slug: 'flowers', description: 'Beautiful fresh flowers' },
    { name: 'Bouquets', slug: 'bouquets', description: 'Elegant flower bouquets' },
    { name: 'Plants', slug: 'plants', description: 'Indoor and outdoor plants' },
    { name: 'Gifts', slug: 'gifts', description: 'Gift items and accessories' },
    { name: 'Accessories', slug: 'accessories', description: 'Flower care accessories' }
  ];

  console.log('📂 Creating categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
  }

  // Get category IDs
  const flowersCategory = await prisma.category.findUnique({ where: { slug: 'flowers' } });
  const bouquetsCategory = await prisma.category.findUnique({ where: { slug: 'bouquets' } });
  const plantsCategory = await prisma.category.findUnique({ where: { slug: 'plants' } });

  // Create sample products
  const products = [
    {
      name: 'Red Rose',
      slug: 'red-rose',
      description: 'Beautiful red rose, perfect for romantic occasions',
      shortDescription: 'Fresh red rose',
      price: 2500,
      stockQuantity: 50,
      minStockAlert: 5,
      categoryId: flowersCategory.id,
      images: ['/images/flowers/red/red-1.jpg'],
      isActive: true,
      isFeatured: true,
      weight: 0.5,
      dimensions: { length: 30, width: 5, height: 5 },
      tags: ['rose', 'red', 'romantic', 'fresh']
    },
    {
      name: 'White Lily',
      slug: 'white-lily',
      description: 'Elegant white lily, symbol of purity and beauty',
      shortDescription: 'Pure white lily',
      price: 3000,
      stockQuantity: 30,
      minStockAlert: 5,
      categoryId: flowersCategory.id,
      images: ['/images/flowers/white/white-1.jpg'],
      isActive: true,
      isFeatured: false,
      weight: 0.8,
      dimensions: { length: 40, width: 8, height: 8 },
      tags: ['lily', 'white', 'elegant', 'pure']
    },
    {
      name: 'Sunflower Bouquet',
      slug: 'sunflower-bouquet',
      description: 'Bright and cheerful sunflower bouquet',
      shortDescription: 'Cheerful sunflower bouquet',
      price: 8000,
      stockQuantity: 20,
      minStockAlert: 3,
      categoryId: bouquetsCategory.id,
      images: ['/images/flowers/yellow/yellow-1.jpg'],
      isActive: true,
      isFeatured: true,
      weight: 1.2,
      dimensions: { length: 50, width: 25, height: 25 },
      tags: ['sunflower', 'bouquet', 'cheerful', 'bright']
    },
    {
      name: 'Indoor Plant - Peace Lily',
      slug: 'peace-lily-plant',
      description: 'Beautiful peace lily plant, perfect for indoor decoration',
      shortDescription: 'Indoor peace lily plant',
      price: 15000,
      stockQuantity: 15,
      minStockAlert: 2,
      categoryId: plantsCategory.id,
      images: ['/images/flowers/white/white-2.jpg'],
      isActive: true,
      isFeatured: false,
      weight: 2.5,
      dimensions: { length: 60, width: 40, height: 80 },
      tags: ['plant', 'indoor', 'peace-lily', 'decoration']
    }
  ];

  console.log('🌺 Creating products...');
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product
    });
  }

  // Create admin user if not exists
  console.log('👨‍💼 Creating admin user...');
  const adminEmail = 'admin@akazubaflorist.com';
  const adminPassword = 'akazuba2024';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+250700000000',
        role: 'ADMIN',
        isActive: true,
        emailVerified: true,
      }
    });
    console.log(`   ✅ Admin user created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`   ℹ️  Admin user already exists: ${adminEmail}`);
  }

  // Create sample customer
  console.log('👤 Creating sample customer...');
  const customerEmail = 'customer@example.com';
  const customerPassword = 'password123';
  
  const existingCustomer = await prisma.user.findUnique({
    where: { email: customerEmail }
  });

  if (!existingCustomer) {
    const hashedPassword = await bcrypt.hash(customerPassword, 10);
    await prisma.user.create({
      data: {
        email: customerEmail,
        passwordHash: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+250700000001',
        role: 'CUSTOMER',
        isActive: true,
        emailVerified: true,
      }
    });
    console.log(`   ✅ Sample customer created: ${customerEmail} / ${customerPassword}`);
  } else {
    console.log(`   ℹ️  Sample customer already exists: ${customerEmail}`);
  }

  console.log('✅ Database seeding completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - ${categories.length} categories created`);
  console.log(`   - ${products.length} products created`);
  console.log('   - Admin and customer users ready');
  console.log('');
  console.log('🔗 Access your application:');
  console.log('   Frontend: http://localhost:3000');
  console.log('   Backend: http://localhost:5000');
  console.log('   Admin: http://localhost:3000/admin');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('akazuba2024', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@akazubaflorist.com' },
    update: {},
    create: {
      email: 'admin@akazubaflorist.com',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+250 784 586 110',
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
    },
  })
  console.log('✅ Admin user created:', adminUser.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'roses' },
      update: {},
      create: {
        name: 'Roses',
        slug: 'roses',
        description: 'Classic and elegant roses in various colors',
        imageUrl: '/images/categories/roses.jpg',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tulips' },
      update: {},
      create: {
        name: 'Tulips',
        slug: 'tulips',
        description: 'Beautiful spring tulips in vibrant colors',
        imageUrl: '/images/categories/tulips.jpg',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'lilies' },
      update: {},
      create: {
        name: 'Lilies',
        slug: 'lilies',
        description: 'Elegant lilies perfect for special occasions',
        imageUrl: '/images/categories/lilies.jpg',
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sunflowers' },
      update: {},
      create: {
        name: 'Sunflowers',
        slug: 'sunflowers',
        description: 'Bright and cheerful sunflowers',
        imageUrl: '/images/categories/sunflowers.jpg',
        sortOrder: 4,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'bouquets' },
      update: {},
      create: {
        name: 'Bouquets',
        slug: 'bouquets',
        description: 'Handcrafted flower bouquets for every occasion',
        imageUrl: '/images/categories/bouquets.jpg',
        sortOrder: 5,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'wedding-flowers' },
      update: {},
      create: {
        name: 'Wedding Flowers',
        slug: 'wedding-flowers',
        description: 'Special arrangements for weddings and ceremonies',
        imageUrl: '/images/categories/wedding.jpg',
        sortOrder: 6,
        isActive: true,
      },
    }),
  ])
  console.log('✅ Categories created:', categories.length)

  // Get category IDs for product creation
  const rosesCategory = await prisma.category.findUnique({ where: { slug: 'roses' } })
  const tulipsCategory = await prisma.category.findUnique({ where: { slug: 'tulips' } })
  const liliesCategory = await prisma.category.findUnique({ where: { slug: 'lilies' } })
  const sunflowersCategory = await prisma.category.findUnique({ where: { slug: 'sunflowers' } })
  const bouquetsCategory = await prisma.category.findUnique({ where: { slug: 'bouquets' } })
  const weddingCategory = await prisma.category.findUnique({ where: { slug: 'wedding-flowers' } })

  // Create products
  const products = await Promise.all([
    // Red Roses
    prisma.product.upsert({
      where: { slug: 'red-rose' },
      update: {},
      create: {
        name: 'Red Rose',
        slug: 'red-rose',
        description: 'Beautiful red rose from Akazuba Florist. Perfect for any occasion.',
        shortDescription: 'Red Rose',
        price: 45500,
        images: ['/images/flowers/red/red-1.jpg'],
        categoryId: rosesCategory?.id || '',
        isActive: true,
        isFeatured: true,
        stockQuantity: 50,
        tags: ['red', 'rose', 'romantic'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'pink-rose' },
      update: {},
      create: {
        name: 'Pink Rose',
        slug: 'pink-rose',
        description: 'Beautiful pink rose from Akazuba Florist. Perfect for any occasion.',
        shortDescription: 'Pink Rose',
        price: 41600,
        images: ['/images/flowers/pink/pink-1.jpg'],
        categoryId: rosesCategory?.id || '',
        isActive: true,
        isFeatured: true,
        stockQuantity: 45,
        tags: ['pink', 'rose', 'romantic'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'white-rose' },
      update: {},
      create: {
        name: 'White Rose',
        slug: 'white-rose',
        description: 'Beautiful white rose from Akazuba Florist. Perfect for any occasion.',
        shortDescription: 'White Rose',
        price: 39000,
        images: ['/images/flowers/white/white-2.jpg'],
        categoryId: rosesCategory?.id || '',
        isActive: true,
        isFeatured: true,
        stockQuantity: 40,
        tags: ['white', 'rose', 'elegant'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'yellow-rose' },
      update: {},
      create: {
        name: 'Yellow Rose',
        slug: 'yellow-rose',
        description: 'Beautiful yellow rose from Akazuba Florist. Perfect for any occasion.',
        shortDescription: 'Yellow Rose',
        price: 36400,
        images: ['/images/flowers/yellow/yellow-2.jpg'],
        categoryId: rosesCategory?.id || '',
        isActive: true,
        stockQuantity: 35,
        tags: ['yellow', 'rose', 'friendship'],
      },
    }),

    // Tulips
    prisma.product.upsert({
      where: { slug: 'red-tulip' },
      update: {},
      create: {
        name: 'Red Tulip',
        slug: 'red-tulip',
        description: 'Beautiful red tulip from Akazuba Florist. Perfect for any occasion.',
        shortDescription: 'Red Tulip',
        price: 32500,
        images: ['/images/flowers/red/red-2.jpg'],
        categoryId: tulipsCategory?.id || '',
        isActive: true,
        isFeatured: true,
        stockQuantity: 30,
        tags: ['red', 'tulip', 'spring'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'pink-tulip' },
      update: {},
      create: {
        name: 'Pink Tulip',
        slug: 'pink-tulip',
        description: 'Beautiful pink tulip from Akazuba Florist. Perfect for any occasion.',
        shortDescription: 'Pink Tulip',
        price: 41600,
        images: ['/images/flowers/pink/pink-2.jpg'],
        categoryId: tulipsCategory?.id || '',
        isActive: true,
        stockQuantity: 25,
        tags: ['pink', 'tulip', 'spring'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'yellow-tulip' },
      update: {},
      create: {
        name: 'Yellow Tulip',
        slug: 'yellow-tulip',
        description: 'Beautiful yellow tulip from Akazuba Florist. Perfect for any occasion.',
        shortDescription: 'Yellow Tulip',
        price: 26000,
        images: ['/images/flowers/yellow/yellow-1.jpg'],
        categoryId: tulipsCategory?.id || '',
        isActive: true,
        stockQuantity: 20,
        tags: ['yellow', 'tulip', 'spring'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'white-tulip' },
      update: {},
      create: {
        name: 'White Tulip',
        slug: 'white-tulip',
        description: 'Beautiful white tulip from Akazuba Florist. Perfect for any occasion.',
        shortDescription: 'White Tulip',
        price: 39000,
        images: ['/images/flowers/white/white-3.jpg'],
        categoryId: tulipsCategory?.id || '',
        isActive: true,
        stockQuantity: 15,
        tags: ['white', 'tulip', 'spring'],
      },
    }),

    // Lilies
    prisma.product.upsert({
      where: { slug: 'white-lily' },
      update: {},
      create: {
        name: 'White Lily',
        slug: 'white-lily',
        description: 'Beautiful white lily from Akazuba Florist. Perfect for any occasion.',
        shortDescription: 'White Lily',
        price: 39000,
        images: ['/images/flowers/white/white-1.jpg'],
        categoryId: liliesCategory?.id || '',
        isActive: true,
        isFeatured: true,
        stockQuantity: 25,
        tags: ['white', 'lily', 'elegant'],
      },
    }),

    // Sunflowers
    prisma.product.upsert({
      where: { slug: 'yellow-sunflower' },
      update: {},
      create: {
        name: 'Yellow Sunflower',
        slug: 'yellow-sunflower',
        description: 'Beautiful yellow sunflower from Akazuba Florist. Perfect for any occasion.',
        shortDescription: 'Yellow Sunflower',
        price: 26000,
        images: ['/images/flowers/yellow/yellow-1.jpg'],
        categoryId: sunflowersCategory?.id || '',
        isActive: true,
        stockQuantity: 30,
        tags: ['yellow', 'sunflower', 'cheerful'],
      },
    }),

    // Bouquets
    prisma.product.upsert({
      where: { slug: 'mixed-bouquet' },
      update: {},
      create: {
        name: 'Mixed Bouquet',
        slug: 'mixed-bouquet',
        description: 'Beautiful mixed bouquet from Akazuba Florist. Perfect for any occasion.',
        shortDescription: 'Mixed Bouquet',
        price: 78000,
        images: ['/images/flowers/mixed/mixed-1.jpg'],
        categoryId: bouquetsCategory?.id || '',
        isActive: true,
        isFeatured: true,
        stockQuantity: 20,
        tags: ['mixed', 'bouquet', 'colorful'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'mixed-arrangement' },
      update: {},
      create: {
        name: 'Mixed Arrangement',
        slug: 'mixed-arrangement',
        description: 'Beautiful mixed arrangement from Akazuba Florist. Perfect for any occasion.',
        shortDescription: 'Mixed Arrangement',
        price: 97500,
        images: ['/images/flowers/mixed/mixed-2.jpg'],
        categoryId: bouquetsCategory?.id || '',
        isActive: true,
        stockQuantity: 15,
        tags: ['mixed', 'arrangement', 'elegant'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'mixed-gift-set' },
      update: {},
      create: {
        name: 'Mixed Gift Set',
        slug: 'mixed-gift-set',
        description: 'Beautiful mixed gift set from Akazuba Florist. Perfect for any occasion.',
        shortDescription: 'Mixed Gift Set',
        price: 104000,
        images: ['/images/flowers/mixed/mixed-4.jpg'],
        categoryId: bouquetsCategory?.id || '',
        isActive: true,
        stockQuantity: 10,
        tags: ['mixed', 'gift', 'premium'],
      },
    }),

    // Wedding Flowers
    prisma.product.upsert({
      where: { slug: 'mixed-wedding-bouquet' },
      update: {},
      create: {
        name: 'Mixed Wedding Bouquet',
        slug: 'mixed-wedding-bouquet',
        description: 'Beautiful mixed wedding bouquet from Akazuba Florist. Perfect for any occasion.',
        shortDescription: 'Mixed Wedding Bouquet',
        price: 156000,
        images: ['/images/flowers/mixed/mixed-5.jpg'],
        categoryId: weddingCategory?.id || '',
        isActive: true,
        isFeatured: true,
        stockQuantity: 5,
        tags: ['mixed', 'wedding', 'premium'],
      },
    }),
  ])
  console.log('✅ Products created:', products.length)

  // Create system settings
  const settings = await Promise.all([
    prisma.setting.upsert({
      where: { key: 'site_name' },
    update: {},
    create: {
        key: 'site_name',
        value: 'Akazuba Florist',
        description: 'Website name',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'site_description' },
    update: {},
    create: {
        key: 'site_description',
        value: 'Rwanda\'s premier floral destination, crafting exquisite arrangements that tell your story.',
        description: 'Website description',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'contact_phone' },
      update: {},
      create: {
        key: 'contact_phone',
        value: '+250 784 586 110',
        description: 'Contact phone number',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'contact_email' },
      update: {},
      create: {
        key: 'contact_email',
        value: 'hello@akazubaflorist.com',
        description: 'Contact email',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'address' },
      update: {},
      create: {
        key: 'address',
        value: 'Kigali, Rwanda',
        description: 'Business address',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'momo_account' },
      update: {},
      create: {
        key: 'momo_account',
        value: '0784 5861 10',
        description: 'Mobile Money account number',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'bk_account' },
      update: {},
      create: {
        key: 'bk_account',
        value: '100161182448',
        description: 'Bank of Kigali account number',
      },
    }),
  ])
  console.log('✅ System settings created:', settings.length)

  console.log('🎉 Database seeding completed successfully!')
  console.log(`📊 Created:`)
  console.log(`   - ${categories.length} categories`)
  console.log(`   - ${products.length} products`)
  console.log(`   - ${settings.length} system settings`)
  console.log(`   - 1 admin user (admin@akazubaflorist.com / akazuba2024)`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
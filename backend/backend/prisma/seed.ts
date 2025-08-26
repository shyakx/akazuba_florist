import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('akazuba2024', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@akazubaflorist.com' },
    update: {},
    create: {
      email: 'admin@akazubaflorist.com',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
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
        description: 'Beautiful roses in various colors',
        imageUrl: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tulips' },
      update: {},
      create: {
        name: 'Tulips',
        slug: 'tulips',
        description: 'Elegant tulips for any occasion',
        imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=400',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'mixed-bouquets' },
      update: {},
      create: {
        name: 'Mixed Bouquets',
        slug: 'mixed-bouquets',
        description: 'Stunning mixed flower arrangements',
        imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'wedding-flowers' },
      update: {},
      create: {
        name: 'Wedding Flowers',
        slug: 'wedding-flowers',
        description: 'Perfect flowers for your special day',
        imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400',
        sortOrder: 4,
      },
    }),
  ])

  console.log('✅ Categories created:', categories.length)

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'red-roses-bouquet' },
      update: {},
      create: {
        name: 'Red Roses Bouquet',
        slug: 'red-roses-bouquet',
        description: 'A stunning bouquet of 12 red roses, perfect for expressing love and passion.',
        shortDescription: '12 Red Roses Bouquet',
        price: 45.99,
        salePrice: 39.99,
        costPrice: 25.00,
        sku: 'RRB-001',
        stockQuantity: 50,
        categoryId: categories[0].id, // Roses
        images: [
          'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=600',
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600'
        ],
        isActive: true,
        isFeatured: true,
        weight: 1.5,
        dimensions: { length: 30, width: 20, height: 40 },
        tags: ['roses', 'red', 'romantic', 'bouquet'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'pink-tulips-arrangement' },
      update: {},
      create: {
        name: 'Pink Tulips Arrangement',
        slug: 'pink-tulips-arrangement',
        description: 'Elegant arrangement of pink tulips, symbolizing perfect love and happiness.',
        shortDescription: 'Pink Tulips Arrangement',
        price: 35.99,
        costPrice: 20.00,
        sku: 'PTA-001',
        stockQuantity: 30,
        categoryId: categories[1].id, // Tulips
        images: [
          'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=600',
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600'
        ],
        isActive: true,
        isFeatured: true,
        weight: 1.2,
        dimensions: { length: 25, width: 15, height: 35 },
        tags: ['tulips', 'pink', 'spring', 'elegant'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'yellow-tulips-bundle' },
      update: {},
      create: {
        name: 'Yellow Tulips Bundle',
        slug: 'yellow-tulips-bundle',
        description: 'Bright and cheerful yellow tulips that bring sunshine to any room.',
        shortDescription: 'Yellow Tulips Bundle',
        price: 28.99,
        costPrice: 15.00,
        sku: 'YTB-001',
        stockQuantity: 40,
        categoryId: categories[1].id, // Tulips
        images: [
          'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600',
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600'
        ],
        isActive: true,
        weight: 1.0,
        dimensions: { length: 20, width: 12, height: 30 },
        tags: ['tulips', 'yellow', 'spring', 'cheerful'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'red-tulips-classic' },
      update: {},
      create: {
        name: 'Red Tulips Classic',
        slug: 'red-tulips-classic',
        description: 'Classic red tulips representing perfect love and passion.',
        shortDescription: 'Red Tulips Classic',
        price: 32.99,
        salePrice: 29.99,
        costPrice: 18.00,
        sku: 'RTC-001',
        stockQuantity: 35,
        categoryId: categories[1].id, // Tulips
        images: [
          'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=600',
          'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=600'
        ],
        isActive: true,
        isFeatured: true,
        weight: 1.1,
        dimensions: { length: 22, width: 14, height: 32 },
        tags: ['tulips', 'red', 'classic', 'romantic'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'purple-tulips-elegance' },
      update: {},
      create: {
        name: 'Purple Tulips Elegance',
        slug: 'purple-tulips-elegance',
        description: 'Sophisticated purple tulips for the most elegant occasions.',
        shortDescription: 'Purple Tulips Elegance',
        price: 38.99,
        costPrice: 22.00,
        sku: 'PTE-001',
        stockQuantity: 25,
        categoryId: categories[1].id, // Tulips
        images: [
          'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=600',
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600'
        ],
        isActive: true,
        weight: 1.3,
        dimensions: { length: 28, width: 18, height: 38 },
        tags: ['tulips', 'purple', 'elegant', 'sophisticated'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'white-tulips-pure' },
      update: {},
      create: {
        name: 'White Tulips Pure',
        slug: 'white-tulips-pure',
        description: 'Pure white tulips symbolizing forgiveness and new beginnings.',
        shortDescription: 'White Tulips Pure',
        price: 30.99,
        costPrice: 17.00,
        sku: 'WTP-001',
        stockQuantity: 30,
        categoryId: categories[1].id, // Tulips
        images: [
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600',
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600'
        ],
        isActive: true,
        weight: 1.0,
        dimensions: { length: 24, width: 16, height: 34 },
        tags: ['tulips', 'white', 'pure', 'innocent'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'mixed-tulips-spring' },
      update: {},
      create: {
        name: 'Mixed Tulips Spring',
        slug: 'mixed-tulips-spring',
        description: 'Colorful mix of spring tulips in various vibrant colors.',
        shortDescription: 'Mixed Tulips Spring',
        price: 45.99,
        salePrice: 39.99,
        costPrice: 25.00,
        sku: 'MTS-001',
        stockQuantity: 20,
        categoryId: categories[1].id, // Tulips
        images: [
          'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600',
          'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=600'
        ],
        isActive: true,
        isFeatured: true,
        weight: 1.5,
        dimensions: { length: 30, width: 20, height: 40 },
        tags: ['tulips', 'mixed', 'spring', 'colorful', 'vibrant'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'mixed-spring-bouquet' },
      update: {},
      create: {
        name: 'Mixed Spring Bouquet',
        slug: 'mixed-spring-bouquet',
        description: 'A vibrant mix of spring flowers including daisies, lilies, and baby\'s breath.',
        shortDescription: 'Mixed Spring Flowers',
        price: 42.99,
        salePrice: 37.99,
        costPrice: 22.00,
        sku: 'MSB-001',
        stockQuantity: 25,
        categoryId: categories[2].id, // Mixed Bouquets
        images: [
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600',
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600'
        ],
        isActive: true,
        weight: 1.8,
        dimensions: { length: 35, width: 25, height: 45 },
        tags: ['mixed', 'spring', 'colorful', 'cheerful'],
      },
    }),
    prisma.product.upsert({
      where: { slug: 'wedding-bridal-bouquet' },
      update: {},
      create: {
        name: 'Wedding Bridal Bouquet',
        slug: 'wedding-bridal-bouquet',
        description: 'Exquisite bridal bouquet featuring white roses, peonies, and eucalyptus.',
        shortDescription: 'Bridal Wedding Bouquet',
        price: 89.99,
        costPrice: 45.00,
        sku: 'WBB-001',
        stockQuantity: 15,
        categoryId: categories[3].id, // Wedding Flowers
        images: [
          'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600',
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600'
        ],
        isActive: true,
        isFeatured: true,
        weight: 2.0,
        dimensions: { length: 40, width: 30, height: 50 },
        tags: ['wedding', 'bridal', 'white', 'elegant', 'peonies'],
      },
    }),
  ])

  console.log('✅ Products created:', products.length)

  // Create sample customer
  const customerPassword = await bcrypt.hash('password123', 12)
  
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+250 788 123 456',
      role: 'CUSTOMER',
      isActive: true,
      emailVerified: true,
    },
  })

  console.log('✅ Sample customer created:', customer.email)

  // Create some settings
  const settings = await Promise.all([
    prisma.setting.upsert({
      where: { key: 'store_name' },
      update: {},
      create: {
        key: 'store_name',
        value: 'Akazuba Florist',
        description: 'Store name',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'store_description' },
      update: {},
      create: {
        key: 'store_description',
        value: 'Beautiful flowers for every occasion',
        description: 'Store description',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'shipping_fee' },
      update: {},
      create: {
        key: 'shipping_fee',
        value: '5.00',
        description: 'Default shipping fee',
      },
    }),
  ])

  console.log('✅ Settings created:', settings.length)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
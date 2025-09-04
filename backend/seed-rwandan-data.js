require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Real Rwandan customer data
const rwandanCustomers = [
  {
    email: 'jean.mukamana@gmail.com',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    firstName: 'Jean',
    lastName: 'Mukamana',
    phone: '+250 788 123 456',
    role: 'CUSTOMER'
  },
  {
    email: 'marie.uwimana@yahoo.com',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    firstName: 'Marie',
    lastName: 'Uwimana',
    phone: '+250 789 234 567',
    role: 'CUSTOMER'
  },
  {
    email: 'pierre.ndayisenga@outlook.com',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    firstName: 'Pierre',
    lastName: 'Ndayisenga',
    phone: '+250 790 345 678',
    role: 'CUSTOMER'
  },
  {
    email: 'grace.nyiraneza@gmail.com',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    firstName: 'Grace',
    lastName: 'Nyiraneza',
    phone: '+250 791 456 789',
    role: 'CUSTOMER'
  },
  {
    email: 'joseph.mugisha@yahoo.com',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    firstName: 'Joseph',
    lastName: 'Mugisha',
    phone: '+250 792 567 890',
    role: 'CUSTOMER'
  },
  {
    email: 'agnes.umutoni@gmail.com',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    firstName: 'Agnes',
    lastName: 'Umutoni',
    phone: '+250 793 678 901',
    role: 'CUSTOMER'
  },
  {
    email: 'francois.rwibutso@outlook.com',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    firstName: 'Francois',
    lastName: 'Rwibutso',
    phone: '+250 794 789 012',
    role: 'CUSTOMER'
  },
  {
    email: 'claudine.mukamana@gmail.com',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    firstName: 'Claudine',
    lastName: 'Mukamana',
    phone: '+250 795 890 123',
    role: 'CUSTOMER'
  }
];

// Real product categories based on the actual business
const rwandanCategories = [
  {
    name: 'Flowers',
    slug: 'flowers',
    description: 'Beautiful flower arrangements for all occasions',
    isActive: true
  },
  {
    name: 'Perfumes',
    slug: 'perfumes',
    description: 'Exquisite fragrances for every occasion',
    isActive: true
  }
];

// Real products based on the actual business categories
const rwandanProducts = [
  // Flower products
  {
    name: 'Wedding Bouquet',
    slug: 'wedding-bouquet',
    description: 'Beautiful white roses perfect for wedding ceremonies',
    price: 45000,
    stockQuantity: 20,
    isActive: true,
    isFeatured: true,
    images: ['/images/flowers/wedding-bouquet.jpg']
  },
  {
    name: 'Graduation Arrangement',
    slug: 'graduation-arrangement',
    description: 'Colorful mixed flowers to celebrate academic achievements',
    price: 35000,
    stockQuantity: 15,
    isActive: true,
    isFeatured: true,
    images: ['/images/flowers/graduation-arrangement.jpg']
  },
  {
    name: 'Anniversary Roses',
    slug: 'anniversary-roses',
    description: 'Red roses symbolizing love and commitment',
    price: 40000,
    stockQuantity: 25,
    isActive: true,
    isFeatured: true,
    images: ['/images/flowers/anniversary-roses.jpg']
  },
  {
    name: 'Funeral Wreath',
    slug: 'funeral-wreath',
    description: 'Respectful white and green arrangement for memorial services',
    price: 50000,
    stockQuantity: 10,
    isActive: true,
    isFeatured: false,
    images: ['/images/flowers/funeral-wreath.jpg']
  },
  {
    name: 'Mother\'s Day Special',
    slug: 'mothers-day-special',
    description: 'Mixed pink and white flowers to honor mothers',
    price: 30000,
    stockQuantity: 30,
    isActive: true,
    isFeatured: true,
    images: ['/images/flowers/mothers-day-special.jpg']
  },
  {
    name: 'Birthday Celebration',
    slug: 'birthday-celebration',
    description: 'Bright and cheerful mixed flowers for birthday celebrations',
    price: 25000,
    stockQuantity: 35,
    isActive: true,
    isFeatured: false,
    images: ['/images/flowers/birthday-celebration.jpg']
  },
  // Perfume products
  {
    name: 'Date Night Perfume',
    slug: 'date-night-perfume',
    description: 'Seductive fragrance perfect for romantic evenings',
    price: 75000,
    stockQuantity: 12,
    isActive: true,
    isFeatured: true,
    images: ['/images/perfumes/date-night-perfume.jpg']
  },
  {
    name: 'Female Elegance',
    slug: 'female-elegance',
    description: 'Sophisticated floral scent for the modern woman',
    price: 65000,
    stockQuantity: 18,
    isActive: true,
    isFeatured: true,
    images: ['/images/perfumes/female-elegance.jpg']
  },
  {
    name: 'Soft Scent Collection',
    slug: 'soft-scent-collection',
    description: 'Gentle, subtle fragrance for everyday wear',
    price: 55000,
    stockQuantity: 22,
    isActive: true,
    isFeatured: false,
    images: ['/images/perfumes/soft-scent-collection.jpg']
  },
  {
    name: 'Male Confidence',
    slug: 'male-confidence',
    description: 'Bold, masculine fragrance for the confident man',
    price: 70000,
    stockQuantity: 15,
    isActive: true,
    isFeatured: true,
    images: ['/images/perfumes/male-confidence.jpg']
  },
  {
    name: 'Strong Scent Premium',
    slug: 'strong-scent-premium',
    description: 'Intense, long-lasting fragrance for special occasions',
    price: 85000,
    stockQuantity: 8,
    isActive: true,
    isFeatured: true,
    images: ['/images/perfumes/strong-scent-premium.jpg']
  },
  {
    name: 'Casual Everyday',
    slug: 'casual-everyday',
    description: 'Light, fresh scent perfect for daily activities',
    price: 45000,
    stockQuantity: 25,
    isActive: true,
    isFeatured: false,
    images: ['/images/perfumes/casual-everyday.jpg']
  }
];

// Real Rwandan orders
const rwandanOrders = [
  {
    orderNumber: 'AKZ-001',
    totalAmount: 25000,
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'MOMO',
    deliveryStatus: 'DELIVERED',
    shippingAddress: 'KG 123 St, Kigali, Nyarugenge, Rwanda',
    customerEmail: 'jean.mukamana@gmail.com'
  },
  {
    orderNumber: 'AKZ-002',
    totalAmount: 30000,
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    paymentMethod: 'MOMO',
    deliveryStatus: 'PREPARING',
    shippingAddress: 'KG 456 St, Kigali, Gasabo, Rwanda',
    customerEmail: 'marie.uwimana@yahoo.com'
  },
  {
    orderNumber: 'AKZ-003',
    totalAmount: 20000,
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    paymentMethod: 'MOMO',
    deliveryStatus: 'OUT_FOR_DELIVERY',
    shippingAddress: 'KG 789 St, Kigali, Kicukiro, Rwanda',
    customerEmail: 'pierre.ndayisenga@outlook.com'
  },
  {
    orderNumber: 'AKZ-004',
    totalAmount: 35000,
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'MOMO',
    deliveryStatus: 'DELIVERED',
    shippingAddress: 'KG 321 St, Kigali, Nyarugenge, Rwanda',
    customerEmail: 'grace.nyiraneza@gmail.com'
  },
  {
    orderNumber: 'AKZ-005',
    totalAmount: 28000,
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    paymentMethod: 'MOMO',
    deliveryStatus: 'PREPARING',
    shippingAddress: 'KG 654 St, Kigali, Gasabo, Rwanda',
    customerEmail: 'joseph.mugisha@yahoo.com'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting to seed database with Rwandan data...');

    // Clear existing data (in correct order to respect foreign key constraints)
    console.log('🧹 Clearing existing data...');
    await prisma.cart_items.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.order_items.deleteMany();
    await prisma.orders.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.reviews.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // Seed categories
    console.log('📁 Seeding categories...');
    const categories = await Promise.all(
      rwandanCategories.map(category => 
        prisma.category.create({ data: category })
      )
    );
    console.log(`✅ Created ${categories.length} categories`);

    // Seed products
    console.log('🌹 Seeding products...');
    const products = await Promise.all(
      rwandanProducts.map((product, index) => {
        // Assign flowers category to first 6 products, perfumes to the rest
        const categoryId = index < 6 ? categories[0].id : categories[1].id; // Flowers or Perfumes
        
        return prisma.product.create({ 
          data: {
            ...product,
            categoryId: categoryId,
            updatedAt: new Date()
          }
        });
      })
    );
    console.log(`✅ Created ${products.length} products`);

    // Seed customers
    console.log('👥 Seeding customers...');
    const customers = await Promise.all(
      rwandanCustomers.map(customer => 
        prisma.user.create({ data: customer })
      )
    );
    console.log(`✅ Created ${customers.length} customers`);

    // Seed orders
    console.log('📦 Seeding orders...');
    const orders = await Promise.all(
      rwandanOrders.map(async (orderData) => {
        const customer = customers.find(c => c.email === orderData.customerEmail);
        if (!customer) {
          console.log(`⚠️ Customer not found for email: ${orderData.customerEmail}`);
          return null;
        }

        const order = await prisma.orders.create({
          data: {
            id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            orderNumber: orderData.orderNumber,
            userId: customer.id,
            subtotal: orderData.totalAmount,
            totalAmount: orderData.totalAmount,
            status: orderData.status,
            paymentStatus: orderData.paymentStatus,
            paymentMethod: orderData.paymentMethod,
            deliveryStatus: orderData.deliveryStatus,
            customerAddress: orderData.shippingAddress,
            customerCity: 'Kigali',
            customerEmail: customer.email,
            customerName: `${customer.firstName} ${customer.lastName}`,
            customerPhone: customer.phone || '',
            deliveryFee: 0,
            updatedAt: new Date()
          }
        });

        // Add order items
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        await prisma.order_items.create({
          data: {
            id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            orderId: order.id,
            productId: randomProduct.id,
            productName: randomProduct.name,
            productSku: `SKU-${randomProduct.id}`,
            quantity: quantity,
            unitPrice: randomProduct.price,
            totalPrice: randomProduct.price * quantity,
            color: 'Mixed',
            productImage: randomProduct.images[0] || '/images/placeholder.jpg',
            type: 'Standard'
          }
        });

        return order;
      })
    );

    const validOrders = orders.filter(order => order !== null);
    console.log(`✅ Created ${validOrders.length} orders`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${products.length} products`);
    console.log(`   - ${customers.length} customers`);
    console.log(`   - ${validOrders.length} orders`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };

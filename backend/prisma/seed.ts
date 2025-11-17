import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminEmail = 'admin@kolaqbitters.com';
  const adminPasscode = 'admin123'; // Change this in production

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passcodeHash = await bcrypt.hash(adminPasscode, 10);

    const admin = await prisma.adminUser.create({
      data: {
        email: adminEmail,
        name: 'Admin User',
        role: 'admin',
        passcodeHash,
      },
    });

    console.log('✅ Created admin user:', admin.email);
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Passcode:', adminPasscode);
    console.log('⚠️  Please change the passcode after first login!');
  } else {
    console.log('✅ Admin user already exists');
  }

  // Seed products
  const productCount = await prisma.product.count();
  if (productCount === 0) {
    console.log('🌱 Seeding products...');

    const products = [
      {
        slug: 'kolaq-alagbo-bitters-original',
        name: 'KOLAQ ALAGBO BITTERS - Original',
        description: 'Our signature herbal bitters blend with traditional Nigerian herbs and spices. Perfect for digestive health and overall wellness.',
        category: 'Bitters',
        size: '750ml',
        isFeatured: true,
        image: '/images/products/original-bitters.jpg',
        prices: [
          { currency: 'NGN' as const, amount: 15000 },
          { currency: 'USD' as const, amount: 35 },
        ],
      },
      {
        slug: 'kolaq-alagbo-bitters-premium',
        name: 'KOLAQ ALAGBO BITTERS - Premium',
        description: 'Enhanced formula with additional premium herbs for maximum potency and flavor.',
        category: 'Bitters',
        size: '750ml',
        isFeatured: true,
        image: '/images/products/premium-bitters.jpg',
        prices: [
          { currency: 'NGN' as const, amount: 25000 },
          { currency: 'USD' as const, amount: 55 },
        ],
      },
      {
        slug: 'kolaq-herbal-elixir',
        name: 'KOLAQ Herbal Elixir',
        description: 'A smooth herbal elixir combining traditional herbs with modern taste profiles.',
        category: 'Elixirs',
        size: '500ml',
        isFeatured: false,
        image: '/images/products/herbal-elixir.jpg',
        prices: [
          { currency: 'NGN' as const, amount: 18000 },
          { currency: 'USD' as const, amount: 42 },
        ],
      },
    ];

    for (const product of products) {
      const { prices, ...productData } = product;
      await prisma.product.create({
        data: {
          ...productData,
          prices: {
            create: prices,
          },
        },
      });
    }

    console.log('✅ Created', products.length, 'products');
  } else {
    console.log('✅ Products already exist');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

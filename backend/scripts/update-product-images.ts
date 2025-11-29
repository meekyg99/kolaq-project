import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const imageUpdates: Record<string, string> = {
  'kolaq-alagbo-bitters-original': '/images/products/essence-bitter.jpg',
  'kolaq-alagbo-bitters-premium': '/images/products/noir-botanica.jpg',
  'kolaq-herbal-elixir': '/images/products/velvet-root.jpg',
};

async function updateProductImages() {
  console.log('🖼️  Updating product images...\n');

  for (const [slug, image] of Object.entries(imageUpdates)) {
    try {
      const product = await prisma.product.update({
        where: { slug },
        data: { image },
      });
      console.log(`✅ Updated ${product.name}: ${image}`);
    } catch (error) {
      console.log(`⚠️  Product with slug "${slug}" not found, skipping...`);
    }
  }

  // Also update any products with missing or invalid images
  const productsWithBadImages = await prisma.product.findMany({
    where: {
      OR: [
        { image: null },
        { image: '' },
        { image: { contains: 'original-bitters' } },
        { image: { contains: 'premium-bitters' } },
        { image: { contains: 'herbal-elixir' } },
      ],
    },
  });

  if (productsWithBadImages.length > 0) {
    console.log(`\n🔧 Found ${productsWithBadImages.length} products with invalid images:`);
    for (const product of productsWithBadImages) {
      // Assign a default image based on category or just use essence-bitter
      const defaultImage = '/images/products/essence-bitter.jpg';
      await prisma.product.update({
        where: { id: product.id },
        data: { image: defaultImage },
      });
      console.log(`   Fixed: ${product.name} -> ${defaultImage}`);
    }
  }

  console.log('\n✨ Done!');
}

updateProductImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
